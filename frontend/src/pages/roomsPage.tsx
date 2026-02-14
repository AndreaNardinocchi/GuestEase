import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import type { Room } from "../types/interfaces";
import { getRooms } from "../api/guestease-api";
// Importing the supabase 'assets' storage function
import RoomCardRoomsPage from "../components/roomCardRoomsPage/roomCardRoomsPage";

/**
 * The RoomsPage is a page where the user can check out all rooms, regardless of
 * whether they are available or not on the chosen booking dates
 */
const RoomsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Our Rooms | GuestEase";
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  if (isLoading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    console.error("Supabase error:", error);
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography color="error">Failed to load rooms.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 12 }}>
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" gutterBottom>
          Our Rooms
        </Typography>
        <Typography color="text.secondary">
          Choose from a variety of cozy, comfortable, and well-equipped rooms.
        </Typography>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        {(data ?? []).map((room: Room) => (
          <RoomCardRoomsPage key={room.id} room={room} />
        ))}
      </Grid>
    </Container>
  );
};

export default RoomsPage;
