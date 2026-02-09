import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api/guestease-api";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import { Link } from "react-router-dom";

const AdminRoomsPage: React.FC = () => {
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
  const {
    data: rooms,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ["rooms"], queryFn: getRooms });

  if (isLoading) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <Typography color="error">Failed to load rooms.</Typography>
          <Button onClick={() => refetch()} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ pb: 8 }}>
        <Box my={4} display="flex" justifyContent="space-between">
          <Typography variant="h4">Rooms</Typography>{" "}
        </Box>
        {/* Table wrapper */}
        <TableContainer
          component={Paper}
          sx={{ mb: 6, overflowX: "auto", borderRadius: 2, boxShadow: 3 }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Room ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amenities</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Images
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms?.map((r) => {
                const images = r.images ?? [];
                return (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Box
                        component={Link}
                        to={`/room/${r.id}`}
                        sx={{
                          color: "#472d30",
                          textDecoration: "none",
                          fontWeight: 500,
                          display: "inline-block",
                          "&:hover": { color: "#E26D5C" },
                        }}
                      >
                        {r.name}
                      </Box>
                    </TableCell>

                    <TableCell>{r.description}</TableCell>
                    {/* Amenities formatting */}
                    <TableCell>{r.amenities.join(", ") ?? []}</TableCell>
                    <TableCell>{r.capacity}</TableCell>
                    <TableCell>€{r.price}</TableCell>

                    {/* Images column*/}
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          overflowX: "auto",
                          maxWidth: 300,
                          p: 1,
                          /**
                           * Custom Scrollbar Styling (WebKit Browsers)
                           * These pseudo-elements are part of the WebKit scrollbar API.
                           * The idea is that we might have plenty of images, hence a scrollable bar
                           * might come in handy.
                           * ::-webkit-scrollbar      styles the scrollbar track
                           * ::-webkit-scrollbar-thumb    styles the draggable thumb
                           * https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar
                           */
                          "&::-webkit-scrollbar": { height: 6 },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#ccc",
                            borderRadius: 3,
                          },
                        }}
                      >
                        {images.map((img: any) => {
                          /**
                           * The image path example below determines the shape of the
                           * varianle 'fullPath'
                           * Ex. rooms/3a622dc8-b2e3-40fa-99d9-050873802107/SeanchaiNook1.jpg
                           * getPublicUrl() will convert this into:
                           * https://<project>.supabase.co/storage/v1/object/public/assets/rooms/<roomId>/<filename>
                           * */
                          const fullPath = `rooms/${r.id}/${img}`;
                          return (
                            <img
                              key={fullPath}
                              src={getPublicUrl(fullPath)}
                              alt=""
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                flexShrink: 0,
                              }}
                            />
                          );
                        })}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};
export default AdminRoomsPage;
