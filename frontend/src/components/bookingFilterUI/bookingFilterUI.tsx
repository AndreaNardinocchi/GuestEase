import React from "react";
import { Box, Button, Paper, TextField } from "@mui/material";
import { BookingWithUser } from "../../types/interfaces";

// Props accepted by the BookingFilterUI component.
// This component does not perform filtering itself, it only controls
// the UI for opening/closing the filter panel and updating the search input.
interface BookingFilterUIProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  // Filter value is 'search' only for now
  filters: { search: string };
  /**
   * State setter used to search based on the inputted value
   * http://stackoverflow.com/questions/65823778/ddg#65824149
   * https://www.xjavascript.com/blog/how-can-i-define-type-for-setstate-when-react-dispatch-react-setstateaction-string-not-accepted/
   * */
  setFilters: React.Dispatch<React.SetStateAction<{ search: string }>>;
  // The list of bookings after filtering has been applied
  // (computed in the parent using useFilteredBookings)
  filtered: BookingWithUser[];
  // List of rooms used to resolve room names
  rooms: any[] | undefined;
}

const BookingFilterUI: React.FC<BookingFilterUIProps> = ({
  open,
  setOpen,
  filters,
  setFilters,
  filtered,
  rooms,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <h2>Bookings Filter</h2>

      {/* Filter button */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#e26d5c" }}
        // 'The logical NOT (!) (logical complement, negation) operator takes truth to falsity and vice versa.'
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT
        onClick={() => setOpen(!open)}
      >
        {open ? "Close Filters" : "Open Filters"}
      </Button>

      {/* Filter panel */}
      {open && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <TextField
            label="Search"
            fullWidth
            value={filters.search}
            // Update the filters state by keeping all existing fields (...f)
            // and replacing ONLY the "search" field with the new input value
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
        </Paper>
      )}
    </Box>
  );
};

export default BookingFilterUI;
