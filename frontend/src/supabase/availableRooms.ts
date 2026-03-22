import { supabase } from "./supabaseClient";

/**
 * 'searchAvailableRooms' calls the Supabase Postgres function 'get_available_rooms'
 * (created in https://supabase.com/dashboard/project/xxxxxxxxxxxxxxx/sql/xxxxxxxxx?schema=public )
 * via RPC and returns a normalized result object.
 * It is basically a plain async service function which calls Supabase RPC and returns
 * { success, rooms, message }.
 * It does not manage loading, caching, or refetching and it is meant to be used inside
 * a context or inside React Query.
 */
export const searchAvailableRooms = async (
  checkIn: string,
  checkOut: string,
  guests: number,
  // Added to exclude the current booking id when user is updating their booking dates
  // It must be called out as possibly undefined as searchAvailableRooms is also used
  // for generic search when the user is not logged in
  // excludeBookingId?: number,
  // We pass a string now because booking IDs in the database are UUIDs, not numbers.
  excludeBookingId?: string | null,
) => {
  try {
    console.log("RPC payload:", {
      check_in: checkIn,
      check_out: checkOut,
      guests,
      exclude_booking_id: excludeBookingId,
    });
    /**
     * Call the Supabase Postgres function 'get_available_rooms'
     * using the rpc() helper.
     * The first argument is the name of the PostrgreSQL function, whereas
     * the second argument is made of parameters object, keys must match SQL function args
     * https://supabase.com/docs/reference/javascript/rpc
     */
    const { data, error } = await supabase.rpc("get_available_rooms", {
      check_in: checkIn,
      check_out: checkOut,
      guests: guests,
      // Added to exclude the current booking id when user is updating their booking dates
      exclude_booking_id: excludeBookingId,
    });

    // If Supabase returned an error, throw it so it is caught by the catch block
    if (error) throw error;

    // console.log("[searchAvailableRooms] RPC returned:", data);

    /**
     * On success: true and rooms: data returned from the RPC (array of rooms or similar)
     */
    return { success: true, rooms: data };
  } catch (err: any) {
    /**
     * console.error is standard here:
     * https://developer.mozilla.org/en-US/docs/Web/API/console/error
     */
    // console.error("Error fetching rooms:", err);

    /**
     * Normalize the error result:
     * success: false
     * rooms: empty array (caller can rely on rooms always being an array)
     * message: human-readable error message for the UI
     */
    return { success: false, rooms: [], message: err.message };
  }
};
