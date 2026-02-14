import { useQuery } from "@tanstack/react-query";
import { getRoomReviews } from "../api/reviews-api";

export const useRoomReviews = (roomId: string | undefined) => {
  return useQuery({
    queryKey: ["roomReviews", roomId],
    queryFn: () => getRoomReviews(roomId as string),
    // Prevents running when roomId is undefined
    enabled: !!roomId,
  });
};
