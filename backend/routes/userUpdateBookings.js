/**
 * Router managing the booking updates from the user side
 */
import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import { calculateStay } from "../utils/calculateTotalPriceUtil.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// --------------------
// USER Update Booking
// --------------------
router.post("/user/update_booking", async (req, res) => {
  res.json({
    status: "placeholder",
    message: "Update booking endpoint wired",
  });
});

export default router;
