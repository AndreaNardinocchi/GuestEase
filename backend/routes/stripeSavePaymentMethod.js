/**
 * This is the backend to save a Stripe payment method
 * https://docs.stripe.com/payments/save-and-reuse
 *https://docs.stripe.com/api/payment_methods/retrieve
 https://docs.stripe.com/payments/save-and-reuse#web-create-setup-intent
 *
 */
import express from "express";
// http://stackoverflow.com/questions/78148005/ddg#78148045
import Stripe from "stripe";
import { supabase } from "../supabaseClientBackend.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/save-payment-method", async (req, res) => {
  try {
    // https://docs.stripe.com/api/payment_methods/retrieve

    // Fetch the userId and payment method id
    const { userId, paymentMethodId } = req.body;
    if (!userId || !paymentMethodId) {
      return res
        .status(400)
        .json({ error: "Missing userId or paymentMethodId" });
    }

    // Retrieve full card details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    const card = paymentMethod.card;

    if (!card) {
      return res.status(400).json({ error: "Payment method is not a card" });
    }

    /**
     * Fetch the user's Stripe customer ID
     */
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (profileErr || !profile?.stripe_customer_id) {
      return res.status(400).json({ error: "User has no Stripe customer ID" });
    }

    const stripeCustomerId = profile.stripe_customer_id;

    /**
     * If the payment method is already attached to a DIFFERENT customer,
     * we must stop immediately. Stripe will not allow re-attaching it.
     * https://docs.stripe.com/api/payment_methods/attach
     */
    if (paymentMethod.customer && paymentMethod.customer !== stripeCustomerId) {
      return res.status(400).json({
        error:
          "This payment method belongs to a different customer. Please add a new card.",
      });
    }

    /**
     * Only attach the payment method if it is NOT already attached.
     * If paymentMethod.customer === stripeCustomerId, skip attaching.
     * https://docs.stripe.com/api/payment_methods/attach?lang=node
     */
    if (!paymentMethod.customer) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId,
      });
    }

    /**
     * Always set as default, even if already attached
     * https://docs.stripe.com/api/customers/update
     */
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    /**
     *  Clear previous default payment methods for this user
     * https://docs.stripe.com/api/customers/delete
     */
    await supabase.from("user_payment_methods").delete().eq("user_id", userId);

    /**
     * Creating/inserting the payment method in supabase
     */
    const { data: insertedPaymentMethods, error: insertError } = await supabase
      .from("user_payment_methods")
      .insert([
        {
          user_id: userId,
          payment_method_id: paymentMethodId,
          brand: card.brand,
          last4: card.last4,
          exp_month: card.exp_month,
          exp_year: card.exp_year,
          is_default: true,
        },
      ])
      // We need supabase to return the card payment details to avoid backend errors
      .select();

    if (insertError || !insertedPaymentMethods?.length) {
      return res.status(500).json({
        error: insertError?.message || "Payment method insertion failed",
      });
    }

    // Send the client_secret back to the client
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
