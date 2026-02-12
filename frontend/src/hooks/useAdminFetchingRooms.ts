import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api/guestease-api";

export const useAdminFetchingRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRooms(),
  });
};
