import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Link as MuiLink,
  Alert,
  Container,
} from "@mui/material";
import {
  getConfirmationBooking,
  getUserProfile,
  getRoomById,
} from "../api/guestease-api";
import { useQuery } from "@tanstack/react-query";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams();

  /**
   * Once again we make use of the useQuery() function to catch data
   * from the 'bookings' table in Supabase through the 'getConfirmationBooking'
   * function in the 'guestease-api.tsx' file
   * https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
   */
  const bookingQuery = useQuery({
    queryKey: ["booking", id],
    enabled: !!id,
    queryFn: () => getConfirmationBooking(id as string),
  });

  /**
   * We make use of the useQuery() function to catch data
   * from the 'profiles' table in Supabase through the 'getUserProfile'
   * function in the 'guestease-api.tsx' file
   * https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
   */
  const profileQuery = useQuery({
    queryKey: ["profile", bookingQuery.data?.user_id],
    enabled: !!bookingQuery.data?.user_id,
    queryFn: () => getUserProfile(bookingQuery.data!.user_id),
  });

  /**
   * We make use of the useQuery() function to catch data
   * from the 'rooms' table in Supabase through the 'getRoomById'
   * function in the 'guestease-api.tsx' file
   * https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
   */
  const roomQuery = useQuery({
    queryKey: ["room", bookingQuery.data?.room_id],
    enabled: !!bookingQuery.data?.room_id,
    queryFn: () => getRoomById(bookingQuery.data!.room_id),
  });

  // Browser title
  useEffect(() => {
    if (bookingQuery.data && roomQuery.data) {
      document.title = `${roomQuery.data.name}'s #${bookingQuery.data.id.slice(
        -8,
      )} Reservation | GuestEase`;
    }
  }, [bookingQuery.data, roomQuery.data]);

  if (bookingQuery.isLoading || roomQuery.isLoading || profileQuery.isLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  }

  if (bookingQuery.isError) {
    return <Alert severity="error">Booking not found</Alert>;
  }

  if (roomQuery.isError) {
    return <Alert severity="error">Room not found.</Alert>;
  }

  const booking = bookingQuery.data;
  const room = roomQuery.data;
  const userProfile = profileQuery.data;

  return (
    <>
      {/* Hero image placeholder */}

      <Box
        sx={{
          width: "100%",
          height: { xs: 240, md: 360 },
          mb: 3,
        }}
      >
        <Box
          component="img"
          src={getPublicUrl(`/rooms/${room.id}/${room.images[0]}`)}
          alt={room.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 1,
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Box sx={{ py: 3 }}>
          {/* Title */}
          <Typography
            variant="h4"
            sx={{ mt: 2, mb: 8, color: "#000000de", textAlign: "center" }}
          >
            Your The Wild Atlantic Room Reservation is confirmed!
          </Typography>

          {/* Main grid */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={4}
          >
            {/* Left column */}
            <Box>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mt: 4, mb: 4 }}>
                    Reservation Number Placeholder
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Internal grid */}
                  <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                    gap={2}
                    mt={4}
                  >
                    <Box>
                      <Typography>Guest Info Placeholder</Typography>
                    </Box>

                    <Box>
                      <Typography>Booking Info Placeholder</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                    Total Price: €0.00
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mb: 2,
                      backgroundColor: "#E26D5C",
                      "&:hover": { backgroundColor: "#c95b4d" },
                    }}
                  >
                    View My Bookings
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2, color: "#000000de" }}
                  >
                    Back to Home
                  </Button>
                </CardContent>
              </Card>
            </Box>

            {/* Right column */}
            <Box>
              <Box
                component="img"
                src={getPublicUrl(`/rooms/${room.id}/${room.images[1]}`)}
                alt={room.name}
                sx={{
                  width: "100%",
                  height: 370,
                  bgcolor: "#d0d0d0",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />

              <Typography sx={{ mb: "5%", mt: 4 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default BookingConfirmationPage;
