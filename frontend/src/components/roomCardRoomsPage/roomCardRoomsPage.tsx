import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Room } from "../../types/interfaces";
import { useRoomReviews } from "../../hooks/useRoomReviews";
import { calculateAverageRating } from "../../utils/calculateAverageRating";
import { getPublicUrl } from "../../utils/supabaseAssetsStorage";

/**
 * This is the room card used in the roomsPage
 */
const RoomCardRoomsPage: React.FC<{ room: Room }> = ({ room }) => {
  /**
   * We fetch the reviews through the useRoomReviews hook
   */
  const { data: reviews = [] } = useRoomReviews(room.id);

  // Using the below function to get the average review rating
  const avgRating = calculateAverageRating(reviews);

  // We create this variable for an extra layer of safety to avoid page breaks
  // whenever for some reason the first image turns out to be 'null'
  const firstImage = room.images?.[0];

  return (
    <Box
      // The key will via the room id in Supabase the room to show in the below card
      key={room.id}
      sx={{
        width: {
          xs: "100%",
          sm: "48%",
          md: "49%",
          lg: "49%",
        },
        mb: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      <Card
        sx={{
          height: "100%",

          borderRadius: 3,
          boxShadow: 4,
          /**
           * Bulge‑out hover effect
           *
           * https://developer.mozilla.org/en-US/docs/Web/CSS/transition
           * https://developer.mozilla.org/en-US/docs/Web/CSS/transform
           */
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            transform: "scale(1.04)",
            boxShadow: 10,
          },
        }}
      >
        {/**
         * Room preview image
         *
         * - Uses MUI CardMedia to render the room's primary image.
         * - `component="img"` tells MUI to output a standard <img> element.
         * - `height="260"` sets a fixed display height for consistent card layout.
         * - `image` pulls the first image from the room's images array.
         * - `alt` provides accessible text for screen readers.
         */}
        <CardMedia
          component="img"
          height="260"
          /**
           * The images of the rooms are now stored in the 'storage' section of supabase:
           * https://supabase.com/dashboard/project/xxxxxxxxxxxxxx/storage/files/buckets/assets
           * The folder hierarchy is '/assets/rooms/roomId/4 images per room', but we are pulling the first
           * room only here.
           * The 4 images will be shown in a carousel component on other pages in the nextst steps. Also,
           * the images have now been manually uploaded to Suapabase, but the plan is that of having the 'admin'
           * role being able to CRUD rooms.
           * */
          image={
            /**
             * The uploaded image path is like 'rooms/a77ddc44-0a5e-4585-b4e7-5b61cb2865d3/1770573915402-DruidsRest2.jpg',
             * as per 'const filePath = `rooms/${roomId}/${Date.now()}-${safeName}`;' in the adminRoomsPage.tsx file.
             * Hence, we are saying below, that if 'img' does include 'rooms/' in its path, that mean it has been uploaded by
             * the admin and will show the uploaded path. Otherwise, it will enable the old image path display, whose
             * image was originally manually uploaded straight into supabase
             */
            firstImage
              ? firstImage.includes("rooms/")
                ? getPublicUrl(firstImage)
                : getPublicUrl(`rooms/${room.id}/${firstImage}`)
              : "/placeholder-room.jpg" // fallback image
          }
          alt={room.name}
        />

        <CardContent sx={{ padding: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
            {room.name}
          </Typography>

          <Box sx={{ mb: 2 }}>
            {reviews && reviews.length > 0 ? (
              <Typography variant="body2" color="text.secondary">
                ★ {avgRating} ({reviews.length}{" "}
                {reviews.length > 1 ? (
                  <span>reviews</span>
                ) : (
                  <span>review</span>
                )}
                )
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews yet
              </Typography>
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              /** Enables multi‑line text truncation using the WebKit flexbox model, creating a vertical box container
               * that allows line clamping.
               * https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
               */
              display: "-webkit-box",
              /**
               * Specifies the maximum number of lines to display before truncating.
               * https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
               */
              WebkitLineClamp: 3,
              /**
               * Sets the box orientation to vertical, required for line clamping.
               * https://developer.mozilla.org/en-US/docs/Web/CSS/box-orient
               */
              WebkitBoxOrient: "vertical",
              /**
               * Ensures any text beyond the clamped lines is hidden instead of overflowing.
               * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
               */
              overflow: "hidden",
            }}
          >
            {room.description}
          </Typography>

          <Typography variant="subtitle2" sx={{ pt: 3 }}>
            {room.capacity} Guests (max) · €{room.price}/night
          </Typography>
        </CardContent>

        <CardActions
          /**
           * 'flex-end' will make the View Details CTA align to the right
           *
           * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content
           * */
          sx={{ px: 2, pt: 0, pb: 2, justifyContent: "flex-end" }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            component={Link}
            to={`/room/${room.id}`}
            sx={{
              textDecoration: "none",
              color: "#000000de",
              fontWeight: "bold",
            }}
          >
            View Details →
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default RoomCardRoomsPage;
