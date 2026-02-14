import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import { useRoomReviews } from "../../hooks/useRoomReviews";

interface RoomReviewProps {
  roomId: string;
}

const RoomReviews: React.FC<RoomReviewProps> = ({ roomId }) => {
  /**
   * React Query is a data-fetching and caching library that simplifies working with
   * asynchronous data in React applications. Instead of manually managing loading states,
   * errors, caching, refetching, and background updates, React Query handles all of this
   * automatically. This results in cleaner components, fewer bugs, and a much smoother UX.
   * React Query v5 is the latest, actively maintained version of TanStack Query.
   * It introduces a simpler, more consistent API using a single options object:
   *
   *    useQuery({ queryKey: [...], queryFn: ... })
   *
   * https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
   * https://tanstack.com/query/latest/docs/framework/react/quick-start
   * */
  const { data: reviews, isLoading, error } = useRoomReviews(roomId);

  // We create this useState to show more than 2 reviews on the roomDetailsPage
  const [showAll, setShowAll] = useState(false);
  // The visibleReviews will be 'sliced' to 2
  const visibleReviews = showAll ? reviews : reviews?.slice(0, 2);

  if (isLoading) return <CircularProgress />;

  if (error) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography color="error">Failed to load reviews</Typography>
      </Container>
    );
  }

  if (reviews?.length === 0) return;

  return (
    <Box mt={4} pb={4} sx={{ color: "#472d30" }}>
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Reviews
      </Typography>

      {reviews?.length === 0 && (
        <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
          No reviews yet — be the first to leave one!
        </Typography>
      )}

      {visibleReviews?.map((review) => (
        <Box
          key={review.id}
          sx={{
            mt: 2,
            p: 2.5,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header: Name + Rating */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>{review.guestName}</Typography>

            {/* Star rating */}
            <Typography sx={{ color: "#e26d5c", fontWeight: 600 }}>
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </Typography>
          </Box>

          {/* Comment */}
          <Typography sx={{ mb: 1.5, lineHeight: 1.5 }}>
            <span style={{ fontStyle: "italic" }}>{review.comment}</span>
          </Typography>

          {/* Date */}
          <Typography variant="caption" color="text.secondary">
            {new Date(review.created_at!).toLocaleDateString()}
          </Typography>
        </Box>
      ))}

      {/* Show more / Show less
      This will determine whether the below links will show */}
      {(reviews?.length ?? 0) > 2 && (
        <Box mt={2}>
          <Typography
            onClick={() => setShowAll(!showAll)}
            sx={{
              cursor: "pointer",
              color: "#472d30",
              fontWeight: 600,
              "&:hover": { color: "#e26d5c" },
            }}
          >
            {showAll ? "Show less ↑" : "Show more reviews ↓"}{" "}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RoomReviews;
