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
    <Box mt={3} pb={4}>
      <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
        Reviews:
      </Typography>
      {reviews?.map((review) => (
        <Box
          key={review.id}
          mt={2}
          p={2}
          border="1px solid #ccc"
          borderRadius={2}
        >
          <Typography>
            <strong>User:</strong> {review.guestName}
          </Typography>
          <Typography>
            <strong>Rating:</strong> {review.rating} / 5
          </Typography>
          <Typography>
            <strong>Comment:</strong>{" "}
            <span style={{ fontStyle: "italic" }}>{review.comment}</span>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(review.created_at!).toLocaleDateString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RoomReviews;
