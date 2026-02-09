import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";

interface RoomPayload {
  name: string;
  description: string;
  amenities: string[];
  capacity: number;
  price: number;
}

/**
 * React Query’s useMutation updates the user profile, then invalidates the
 * cached "profile" query so fresh data is refetched.
 * Local form state mirrors the profile data, and useEffect keeps it synced
 * whenever the profile query returns new values from Supabase.
 * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
 * https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
 */
export function useAdminCreateRoom() {
  const queryClient = useQueryClient();

  // This will insert the room in the supabase 'rooms' table
  return useMutation({
    mutationFn: async (payload: RoomPayload) => {
      const { error } = await supabase.from("rooms").insert([payload]);
      if (error) throw error;
    },

    onSuccess: () => {
      // Refresh rooms list
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
