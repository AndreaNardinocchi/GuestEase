import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "../api/reviews-api";

/**
 * React Query’s useMutation submits the review, then invalidates the
 * cached "reviews" query so fresh data is refetched.
 * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
 * https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
 */
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: (_data, variables) => {
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      // Refresh the specific room page
      queryClient.invalidateQueries({ queryKey: ["rooms", variables.room_id] });
      // Refresh the reviews associated with that room page
      queryClient.invalidateQueries({
        queryKey: ["roomReviews", variables.room_id],
      });
    },
  });
};
