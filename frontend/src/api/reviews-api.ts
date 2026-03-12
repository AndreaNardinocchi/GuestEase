import { supabase } from "../supabase/supabaseClient";
import { reviewEmailTemplate } from "../utils/reviewEmail";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import { getBookingById, getRoomById, getUserProfile } from "./guestease-api";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

/**
 * This is a function to submit a review.
 * We create a payload with all fields in the supabase 'revies' table and insert
 * it.
 * https://supabase.com/docs/reference/javascript/insert
 */
export const submitReview = async (payload: {
  booking_id: string;
  room_id: string;
  user_id: string;
  rating: number;
  comment: string;
}) => {
  const { booking_id, rating, comment } = payload;
  // Retrieving the user object
  const user = await getUserProfile(payload.user_id);
  // We now create the reviewer_name variable to insert along with the above payload
  // This is a bug fix as the logout status would not show the reviewer name othrwise
  const reviewer_name =
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const { error } = await supabase.from("reviews").insert({
    ...payload,
    reviewer_name,
    created_at: new Date(),
  });
  if (error) throw new Error(error.message);

  // Retrieving all objects needed for the email parameters
  const room = await getRoomById(payload.room_id);
  const booking = await getBookingById(payload.booking_id);

  // Fetching the GuestEase logo from the Supabase storage
  const logoUrl = getPublicUrl("GuestEaseLogo.png");
  const adminEmail = import.meta.env.VITE_RESEND_ADMIN_EMAIL;

  // Generate the full HTML for the booking confirmation email using the template
  // and pass the below values
  const html = reviewEmailTemplate({
    booking_id,
    check_in: booking.check_in,
    check_out: booking.check_out,
    rating,
    room_name: room?.name ?? "Unknown Room",
    user_name: user?.first_name ?? "Guest",
    comment,
    logoUrl,
    adminDashboardUrl: `${frontendUrl}/admin/reviews`,
  });

  const res = await fetch(`${backendUrl}/send_email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: adminEmail,
      subject: "New Review Submitted",
      body: html,
    }),
  });

  return true;
};

/**
 * This is a helper to get all reviews of a specific room
 */
export const getRoomReviews = async (roomId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      ` *,
    reviewer_name
        `,
    )

    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];

  /**
   * We then 'return' a 'map' of 'guestname' which is nothing but
   * the reviewer_name column from the 'reviews' table
   */

  return data.map((review: any) => {
    const guestName = review.reviewer_name || "Guest";
    return { ...review, guestName };
  });
};

/**
 * This will fetch a review by booking
 */
export const getBookingReview = async (bookingId: string) => {
  const { data: review, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();
  if (error) throw new Error(error.message);

  return review;
};
