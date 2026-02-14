import { supabase } from "../supabase/supabaseClient";

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
  const { error } = await supabase.from("reviews").insert({
    ...payload,
    created_at: new Date(),
  });

  if (error) throw new Error(error.message);
  return true;
};

/**
 * This is a helper to get all reviews of a specific room, which also
 * create a 'join' with the profiles table through 'profile as a foreign key
 * constraint.
 * https://supabase.com/docs/guides/database/joins-and-nesting?queryGroups=language&language=js
 */
export const getRoomReviews = async (roomId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profile:profiles (
        first_name,
        last_name
      )
    `,
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];

  /**
   * We then 'return' a 'map' of 'guestname' which is nothing but
   * the combination of the first and last name's guest
   */
  return data.map((review: any) => {
    const first = review.profile?.first_name || "";
    const last = review.profile?.last_name || "";

    const guestName = (first + " " + last).trim() || "Guest";
    // We then, return, the review object through the stread operator and add the new field 'guestName'
    return { ...review, guestName };
  });
};
