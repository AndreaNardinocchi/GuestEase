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
  const { email, userId } = req.body;

  try {
    // Create Stripe customer
    // https://docs.stripe.com/api/customers/create
    const customer = await stripe.customers.create({ email });

    // Save the Stripe customer id to Supabase which is needed to link
    // the user to Stripe
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("id", userId);

    res.json({ customerId: customer.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create Stripe customer" });
  }
});

export default router;
