import {
  AppBar,
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
// https://mui.com/material-ui/material-icons/
import HotelIcon from "@mui/icons-material/Hotel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import React, { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

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

      <Container sx={{ py: 6 }}>
        {/* Available Room Card with dummy data*/}
        <Card
          id="dummy-room-1"
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            height: { xs: "auto", md: 350 },
            borderRadius: 2,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
        >
          {/* Image section */}
          <Box
            sx={{
              width: { xs: "100%", sm: "50%" },
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src="https://placehold.co/800x600"
              alt="Lorem Ipsum Room"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          {/* Content section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              order: { xs: 1, md: 0 },
            }}
          >
            <CardContent
              sx={{ flexGrow: 1, padding: "5%", overflow: "hidden" }}
            >
              {/* Room name */}
              <Typography
                variant="h6"
                gutterBottom
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "bold",
                  mb: 2,
                }}
              >
                Lorem Ipsum Deluxe Room
              </Typography>

              {/* Room description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  mt: 1,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Typography>

              {/* Amenities */}
              <Box
                component="ul"
                sx={{
                  pl: 0,
                  mt: 2,
                  mb: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 0.5,
                  listStyle: "none",
                }}
              >
                <Box
                  component="li"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    lineHeight: 1.4,
                  }}
                >
                  <CheckCircleIcon
                    fontSize="inherit"
                    sx={{ mr: 0.5, color: "text.secondary" }}
                  />
                  Lorem ipsum
                </Box>

                <Box
                  component="li"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    lineHeight: 1.4,
                  }}
                >
                  <CheckCircleIcon
                    fontSize="inherit"
                    sx={{ mr: 0.5, color: "text.secondary" }}
                  />
                  Dolor sit amet
                </Box>

                <Box
                  component="li"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    lineHeight: 1.4,
                  }}
                >
                  <CheckCircleIcon
                    fontSize="inherit"
                    sx={{ mr: 0.5, color: "text.secondary" }}
                  />
                  Consectetur
                </Box>

                <Box
                  component="li"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    lineHeight: 1.4,
                  }}
                >
                  <CheckCircleIcon
                    fontSize="inherit"
                    sx={{ mr: 0.5, color: "text.secondary" }}
                  />
                  Adipiscing elit
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {/* Price */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      fontSize: "1.1rem",
                      paddingBottom: "3%",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>€99</span>
                    <span style={{ fontSize: "0.7rem" }}> Euro / night</span> ·
                    Guests 2 <span style={{ fontSize: "0.7rem" }}>(max)</span>
                  </Typography>
                </Box>

                {/* Details link */}
                <Box>
                  <Link
                    to="/room/lorem-ipsum"
                    style={{ textDecoration: "none", color: "#000000de" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: "bold" }}
                    >
                      View Details →
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </CardActions>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default SearchResultsPage;
