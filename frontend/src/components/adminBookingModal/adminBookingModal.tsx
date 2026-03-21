import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import { BookingModalProps } from "../../types/interfaces";
import { getRoomName } from "../../utils/getRoomName";
import { TransitionProps } from "@mui/material/transitions";
import { useAvailableRooms } from "../../hooks/useAvailableRooms";
import { calculateNumberOfNights } from "../../utils/calculateNumberOfNights";

/**
 * This is a nice transition effect we were eager to try out,
 * and worked out well.
 * https://mui.com/material-ui/react-dialog/#transitions
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminBookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  onSave,
  rooms,
  editingBooking,
  onOpenPaymentDialog,
}) => {
  /**
   * We clone the booking so edits inside the modal do not immediately mutate
   * the parent state until the user clicks 'Save'.
   * If editingBooking is null, we start with an empty booking for create mode.
   */
  const [localBooking, setLocalBooking] = useState<any>(
    editingBooking ?? {
      room_id: "",
      user_email: "",
      check_in: "",
      check_out: "",
      guests: 1,
      nights: 0,
      total_price: 0,
    },
  );

  // This state is needed to show an error message for empty fields
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  /**
   * Reset local state whenever a new booking is passed in.
   * This ensures the modal always displays the correct data when reopened.
   */
  useEffect(() => {
    if (editingBooking) {
      setLocalBooking(editingBooking);
    } else {
      setLocalBooking({
        room_id: "",
        user_email: "",
        check_in: "",
        check_out: "",
        guests: 1,
        nights: 0,
        total_price: 0,
      });
    }
  }, [editingBooking]);

  /**
   * Generate today's date in YYYY-MM-DD format
   * Date.toISOString():
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
  const today = new Date().toISOString().split("T")[0];

  /**
   * Compute the minimum allowed check-out date.
   * If check-in is selected, next day after check-in is
   * the minimum allowed date possible.
   * If not, then, 'tomorrow'
   * */
  const nextDayAfterCheckIn = localBooking?.check_in
    ? new Date(
        new Date(localBooking.check_in).setDate(
          new Date(localBooking.check_in).getDate() + 1,
        ),
      )
        .toISOString()
        .split("T")[0]
    : null;

  /**
   * If the user selects a check-in date beyond the check-out one,
   * an error helper will display in the modal.
   */
  const checkInDate = new Date(localBooking?.check_in || "");
  const checkOutDate = new Date(localBooking?.check_out || "");
  const dateError = checkInDate >= checkOutDate;

  /**
   * Fetch rooms available for the selected dates and guest count.
   * When editing, we pass '0' so the hook ignores the current booking
   * and doesn’t flag its own room as unavailable.
   */
  const { data: availableRooms } = useAvailableRooms(
    localBooking?.check_in || "",
    localBooking?.check_out || "",
    Number(localBooking?.guests || 1),
    editingBooking ? 0 : undefined,
  );

  // We get the selected room using the find() function...
  const selectedRoom = rooms.find((r) => r.id === localBooking?.room_id);

  // ...and we set the max capacity
  const maxGuests = selectedRoom?.capacity || 1;

  // Compute the total price based on the selected dates.
  const computePrice = (
    check_in: string,
    check_out: string,
    pricePerNight: number,
  ) => {
    if (!check_in || !check_out || !pricePerNight) {
      // Returning existing values
      return {
        nights: editingBooking?.nights ?? 0,
        total_price: editingBooking?.total_price ?? 0,
      };
    }
    const nights = calculateNumberOfNights(check_in, check_out);
    const total_price = nights * pricePerNight;
    return { nights, total_price };
  };

  // Here we fetch the room id of our booked room to check its availability
  const roomIsAvailable =
    availableRooms?.some((r: any) => r.id === selectedRoom?.id) ?? true;

  // If the room is not available, we raise the overlapError
  const overlapError = !roomIsAvailable;

  /**
   * This will handle our Create or Update button.
   */
  const handleSaveClick = () => {
    // Basic required field validation
    if (
      !localBooking.room_id ||
      !localBooking.user_email ||
      !localBooking.check_in ||
      !localBooking.check_out ||
      !localBooking.guests ||
      overlapError ||
      dateError
    ) {
      // Error
      console.warn("Missing required fields");
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      // Stop
      return;
    }

    // These variables are needed to check whether the payment dialog needs to pop up
    const oldPrice = editingBooking?.total_price ?? 0;
    const newPrice = localBooking?.total_price ?? 0;

    // In this case, we create the booking, hence, we will have the payment dialog pop up
    if (!editingBooking) {
      onOpenPaymentDialog(localBooking);
      return;
    }

    // Here, we update and have the payment dialog pop up
    // since the new price will increase
    if (newPrice > oldPrice) {
      onOpenPaymentDialog(localBooking);
      return;
    }

    // Otherwise we just save
    onSave(localBooking);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { mx: 2 } } }}
        slots={{ transition: Transition }}
      >
        <DialogTitle>
          {editingBooking ? "Update Booking" : "Create Booking"}
        </DialogTitle>

        <DialogContent>
          <InputLabel id="rooms">Rooms</InputLabel>
          <Select
            labelId="Room ID"
            value={localBooking?.room_id || ""}
            fullWidth
            displayEmpty
            renderValue={(value) =>
              value ? value : <span style={{ color: "#aaa" }}>Rooms</span>
            }
            onChange={(e) =>
              setLocalBooking((prev: any) => ({
                ...prev,
                room_id: e.target.value,
              }))
            }
          >
            {rooms.map((r: any) => (
              <MenuItem key={r.id} value={r.id}>
                {getRoomName(r.id, rooms)}
              </MenuItem>
            ))}
          </Select>

          {!editingBooking && (
            <TextField
              margin="dense"
              label="User Email"
              fullWidth
              value={localBooking?.user_email || ""}
              onChange={(e) =>
                setLocalBooking((prev: any) => ({
                  ...prev,
                  user_email: e.target.value,
                }))
              }
            />
          )}

          <TextField
            margin="dense"
            type="date"
            label="Check-in"
            fullWidth
            /** slotProps property.
             * https://mui.com/material-ui/api/menu/#props
             * https://mui.com/material-ui/api/menu/#slots
             * */
            slotProps={{
              input: {
                inputProps: { min: today },
              },
              inputLabel: { shrink: true },
            }}
            value={localBooking?.check_in || ""}
            onChange={(e) => {
              // When the user selects a new check‑in date, recalculate
              // the number of nights and total price...
              const newCheckIn = e.target.value;
              const { nights, total_price } = computePrice(
                newCheckIn,
                localBooking?.check_out || "",
                selectedRoom?.price ?? 0,
              );
              // ...then update the local booking state accordingly.
              setLocalBooking((prev: any) => ({
                ...prev,
                check_in: newCheckIn,
                nights,
                total_price,
              }));
            }}
            error={overlapError || dateError}
            helperText={
              overlapError
                ? "This room is already booked for these dates"
                : dateError
                  ? "Check-in must be before check-out"
                  : ""
            }
          />

          <TextField
            margin="dense"
            type="date"
            label="Check-out"
            fullWidth
            slotProps={{
              input: {
                inputProps: { min: nextDayAfterCheckIn || today },
              },
              inputLabel: { shrink: true },
            }}
            value={localBooking?.check_out || ""}
            onChange={(e) => {
              // When the user selects a new check‑out date, recalculate
              // the number of nights and total price...
              const newCheckOut = e.target.value;
              const { nights, total_price } = computePrice(
                localBooking?.check_in || "",
                newCheckOut,
                selectedRoom?.price ?? 0,
              );
              // ...then update the local booking state accordingly.
              setLocalBooking((prev: any) => ({
                ...prev,
                check_out: newCheckOut,
                nights,
                total_price,
              }));
            }}
            error={overlapError || dateError}
            helperText={
              overlapError
                ? "This room is already booked for these dates"
                : dateError
                  ? "Check-in must be before check-out"
                  : ""
            }
          />

          <TextField
            margin="dense"
            type="number"
            label="Guests"
            fullWidth
            value={String(localBooking?.guests ?? "")}
            onChange={(e) => {
              /**
               * 'value' will return the smallest between what the user types
               * and the room capacity. This prevents exceeding the room capacity.
               */
              const value = Math.min(Number(e.target.value), maxGuests);
              setLocalBooking((prev: any) => ({ ...prev, guests: value }));
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              color: "#472d30",
              "&:hover": { color: "#E26D5C" },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveClick}
            /**
             * By disabling the button in case of any errors, we prevent overlapping
             * and invalid date selections.
             */
            disabled={overlapError || dateError}
            sx={{
              backgroundColor: "#472d30",
              color: "#fff",
              "&:hover": { backgroundColor: "#E26D5C" },
              px: 5,
            }}
          >
            {/* This very same modal will be used for updates too */}
            {editingBooking ? "Update Booking" : "Create Booking"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for error message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        // anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={snackbarMessage}
      >
        {/* <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
        {snackbarMessage}
        </Alert> */}
      </Snackbar>
    </>
  );
};

export default AdminBookingModal;
