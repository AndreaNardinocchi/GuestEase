import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
// https://mui.com/material-ui/material-icons/
import HotelIcon from "@mui/icons-material/Hotel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import React, { useEffect } from "react";
import RoomHorizontalCard from "../components/roomHorizontalCard/roomHorizontalCard";

/**
 * This is the the page where all available rooms will be shown based on
 * the search parameters checkIn, checkOut, and guests
 */
const SearchResultsPage: React.FC = () => {
  /**
   * Set page title on mount.
   * This is optional but keeps consistency with other pages.
   */
  useEffect(() => {
    document.title = "Search Results Page | GuestEase";
  }, []);

  return (
    <>
      {/* Top App Bar indicating the search dates*/}
      <AppBar position="static" sx={{ backgroundColor: "#EFF5E0" }}>
        <Toolbar>
          <HotelIcon sx={{ mr: 1, color: "#000000de" }} />

          <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000de" }}>
            Search Results
          </Typography>

          {/* Show selected dates + guests */}
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonthIcon sx={{ color: "#000000de" }} />
            <Typography variant="body2" sx={{ color: "#000000de" }}>
              {/* These are placeholder data */}
              2026-01-14 → 2026-01-15 (2 guests)
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Page content goes here */}
      {/* Main Content */}
      <Container sx={{ py: 6 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            rowGap: 4,
          }}
        >
          <RoomHorizontalCard
            id={"123"}
            name="Sample Room"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore"
            price={99}
            images={["https://placehold.co/600x400"]} // Placeholder image
            amenities={[
              "WiFi",
              "Parking",
              "Balcony",
              "Coffee machine",
              "Late check-out",
              "Microwave",
              "Desk",
            ]}
            // Placeholder image
            firstImage="https://placehold.co/800x600"
            checkIn={"2026-01-14"}
            checkOut={"2026-01-15"}
            guests={2}
            capacity={2}
          />
        </Box>
      </Container>
    </>
  );
};

export default SearchResultsPage;
