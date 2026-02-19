import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import Stripe from "stripe";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// ADMIN cancel Booking (with refund if charged)
router.post("/admin/cancel-booking", async (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ error: "Missing bookingId" });
  }

  try {
    // Fetch booking with payment info
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select("id, charged, payment_intent_id")
      .eq("id", booking_id)
      .single();

    if (bookingErr || !booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Retrieving the Stripe secret key for the refund
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    /**
     * If booking was charged, issue refund
     * */
    if (booking.charged === true) {
      if (!booking.payment_intent_id) {
        return res.status(400).json({
          error:
            "Booking is marked as charged but has no payment_intent_id stored.",
        });
      }

      try {
        // We create a refund at this point, as Admin does have the power
        // to cancel and refund a booking afer check-in if needed
        // https://docs.stripe.com/api/refunds/create?lang=node
        await stripe.refunds.create({
          payment_intent: booking.payment_intent_id,
        });
      } catch (refundErr) {
        return res.status(500).json({
          error: "Stripe refund failed",
          details: refundErr.message,
        });
      }
    }

    // Delete booking after refund (or if not charged)
    const { error: deleteErr } = await supabase
      .from("bookings")
      .delete()
      .eq("id", booking_id);

    if (deleteErr) {
      return res.status(500).json({ error: deleteErr.message });
    }

    return res.json({
      message:
        booking.charged === true
          ? "Booking cancelled and refunded successfully"
          : "Booking cancelled successfully (no charge to refund)",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
