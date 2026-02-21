import { useQuery } from "@tanstack/react-query";
<<<<<<< HEAD
import { getRoomReviews } from "../api/reviews-api";

export const useUserFetchReviews = (roomId: string) => {
  return useQuery({
    queryKey: ["reviews", roomId],
    queryFn: () => getRoomReviews(roomId),
    enabled: !!roomId, // only run when roomId exists
=======
import { getBookingReview } from "../api/reviews-api";

export const useUserFetchReviews = (bookingId: string) => {
  return useQuery({
    queryKey: ["review", bookingId],
    queryFn: () => getBookingReview(bookingId),
    enabled: !!bookingId,
>>>>>>> 2d2bdf6 (Fix already submitted review bug on the BookedRoomCard)
  });
};
