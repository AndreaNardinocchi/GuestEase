import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../api/guestease-api";

export const useAdminFetchingReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => getReviews(),
  });
};
