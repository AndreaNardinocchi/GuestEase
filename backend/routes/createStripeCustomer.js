/**
 * This is the backend to creaye a Stripe customer
 * https://docs.stripe.com/api/customers/create
 */
import express from "express";
// http://stackoverflow.com/questions/78148005/ddg#78148045
import Stripe from "stripe";
import { supabase } from "../supabaseClientBackend.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-stripe-customer", async (req, res) => {
  try {
    const { email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: "Missing email or userId" });
    }

    /**
     * We check if the user already has a Stripe customer ID.
     * If yes, we are not creating a new customer.
     */
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (profileErr) {
      return res.status(400).json({ error: "Failed to fetch profile" });
    }

    if (profile?.stripe_customer_id) {
      // User already has a Stripe customer, so we return it
      return res.json({
        customerId: profile.stripe_customer_id,
        existing: true,
      });
    }

    /**
     * If we reach here, the user does not have a Stripe customer yet.
     * Create Stripe customer
     *  https://docs.stripe.com/api/customers/create
     */
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });

    // We then save the new customer ID in Supabase
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("id", userId);

    res.json({
      customerId: customer.id,
      existing: false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
