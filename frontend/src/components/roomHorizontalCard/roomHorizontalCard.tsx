import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardActions, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * This card is used to show available rooms data, where each card will show 1 room.
 * It replaces the card created on the Search Results page
 */
const RoomHorizontalCard: React.FC<any> = (props) => {
  return (
    <Card
      id={props.id}
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
          // Tablet+ gets a split layout
          width: { xs: "100%", sm: "50%" },
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <img
          src={props.firstImage}
          alt={props.name}
          style={{
            width: "100%",
            height: "100%",
            /**
             * objectFit ensures the image fills the area while keeping its aspect ratio;
             * parts of the image may be cropped to avoid distortion
             * https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
             */
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
          // flex: 1 Allows content to expand naturally
          flex: 1,
          // Prevents premature text wrapping inside flex layouts
          minWidth: 0,
          order: { xs: 1, md: 0 },
        }}
      >
        <CardContent sx={{ flexGrow: 1, padding: "5%", overflow: "hidden" }}>
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
            {props.name}
          </Typography>

          {/* Room description*/}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 3,
              // Limits description to 3 lines
              WebkitBoxOrient: "vertical",
              mt: 1,
            }}
          >
            {props.description}
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
            {/* Mapping amenities */}
            {props.amenities.map((amenity: any, i: any) => (
              <Box
                key={i}
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
                {amenity}
              </Box>
            ))}
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
                <span style={{ fontWeight: "bold" }}>{props.price}</span>
                <span style={{ fontSize: "0.7rem" }}> Euro / night</span> ·
                Guests {props.guests}
                <span style={{ fontSize: "0.7rem" }}>(max)</span>
              </Typography>
            </Box>

            {/* Details link */}
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                component={Link}
                to={`/room/${props.id}`}
                sx={{
                  textDecoration: "none",
                  color: "#000000de",
                  fontWeight: "bold",
                }}
              >
                View Details →
              </Typography>
            </Box>
          </Box>
        </CardActions>
      </Box>
    </Card>
  );
};

export default RoomHorizontalCard;
