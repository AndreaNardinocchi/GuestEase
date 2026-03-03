import express from "express";
import { supabase } from "../supabaseClientBackend.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// ADMIN Delete user
router.post("/admin/delete-user", async (req, res) => {
  // Retrieving the user id from the body
  const { userId, role } = req.body;

  /**
   * To be able to show a message stating that the user cannot be deleted
   * as long as they have bookings, we first check if they have any by
   * fetching them from Supabase
   */
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("id")
    .eq("user_id", userId);
  if (bookingsError) {
    return res.status(500).json({ error: "Error checking user bookings." });
  }

  // If they do, we will show the below error message foe a better UI experience
  if (bookings.length > 0) {
    return res.status(400).json({
      error: "User cannot be deleted because they still have bookings.",
    });
  }

  /**
   * Delete the user from Supabase Auth
   * This removes the authentication identity (email/password, login access).
   * If this fails, we stop immediately and return an error.
   * https://supabase.com/docs/reference/javascript/auth-admin-deleteuser
   * */
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) return res.status(400).json({ error: authError.message });

  // Otherwise, return a success response to the client.
  res.json({ success: true });
});

export default router;
