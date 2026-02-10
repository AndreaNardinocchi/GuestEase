import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";

interface RoomToDelete {
  id: string;
}

/**
 * React Query’s useMutation updates the room,  then invalidates the
 * cached "rooms" query so fresh data is refetched.
 * Local form state mirrors the room data, and useEffect keeps it synced
 * whenever the room query returns new values from Supabase.
 * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
 * https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
 */
export function useAdminDeleteRoom() {
  const queryClient = useQueryClient();

  // This will insert the room in the supabase 'rooms' table
  return useMutation({
    mutationFn: async (room: RoomToDelete) => {
      // const { id, ...restOfRoomData } = payload;
      const { data, error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", room.id);
      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      // Refresh rooms list
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
