import React from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FilterBookingsCardProps } from "../../types/interfaces";

/**
 * Shared styling for form controls.
 */
const styles = {
  root: {
    width: "100%",
    marginBottom: 20,
  },
  formControl: {
    mt: 2,
    width: "100%",
    backgroundColor: "#fff",
  },
};

const FilterBookingsCard: React.FC<FilterBookingsCardProps> = ({
  filters,
  setFilters,
  rooms,
}) => {
  /**
   * Generic handler for updating any filter field.
   */
  const handleChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  /** Reset all filters to default empty values */
  const resetFilters = () => {
    setFilters({
      search: "",
      room: "",
      first_name: "",
      last_name: "",
      email: "",
      guests: "",
      check_in: "",
      check_out: "",
      created_at: "",
      charged: "",
    });
  };

  return (
    <Card sx={styles.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          <FilterAltIcon fontSize="large" /> Booking Filters
        </Typography>

        {/* Global search across all fields */}
        <TextField
          label="Search all fields"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          slotProps={{
            root: { sx: styles.formControl },
          }}
        />

        {/* Room filter */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Room</InputLabel>
          <Select
            label="Room"
            value={filters.room}
            onChange={(e) => handleChange("room", e.target.value)}
          >
            <MenuItem value="">All Rooms</MenuItem>
            {rooms.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* First Name */}
        <TextField
          label="First Name"
          value={filters.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
          slotProps={{ root: { sx: styles.formControl } }}
        />

        {/* Last Name */}
        <TextField
          label="Last Name"
          value={filters.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
          slotProps={{ root: { sx: styles.formControl } }}
        />

        {/* Email */}
        <TextField
          label="Email"
          value={filters.email}
          onChange={(e) => handleChange("email", e.target.value)}
          slotProps={{ root: { sx: styles.formControl } }}
        />

        {/* Guests */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Guests</InputLabel>
          <Select
            label="Guests"
            value={filters.guests}
            onChange={(e) => handleChange("guests", e.target.value)}
          >
            <MenuItem value="">All Guests</MenuItem>
            <MenuItem value="1">1 Guest</MenuItem>
            <MenuItem value="2">2 Guests</MenuItem>
            <MenuItem value="3">3 Guests</MenuItem>
            <MenuItem value="4">4 Guests</MenuItem>
          </Select>
        </FormControl>

        {/* Check-in */}
        <TextField
          label="Check-in"
          type="date"
          value={filters.check_in}
          onChange={(e) => handleChange("check_in", e.target.value)}
          slotProps={{
            root: { sx: styles.formControl },
            inputLabel: { shrink: true },
          }}
        />

        {/* Check-out */}
        <TextField
          label="Check-out"
          type="date"
          value={filters.check_out}
          onChange={(e) => handleChange("check_out", e.target.value)}
          slotProps={{
            root: { sx: styles.formControl },
            inputLabel: { shrink: true },
          }}
        />

        {/* Created At */}
        <TextField
          label="Created at"
          type="date"
          value={filters.created_at}
          onChange={(e) => handleChange("created_at", e.target.value)}
          slotProps={{
            root: { sx: styles.formControl },
            inputLabel: { shrink: true },
          }}
        />

        {/* Charged */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Charged?</InputLabel>
          <Select
            label="Charged"
            value={filters.charged}
            onChange={(e) => handleChange("charged", e.target.value)}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Button */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterBookingsCard;
