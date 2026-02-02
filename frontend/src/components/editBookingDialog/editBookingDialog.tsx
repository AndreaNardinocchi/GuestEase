import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  Typography,
} from "@mui/material";
import { useAvailableRooms } from "../../hooks/useAvailableRooms";
import { TransitionProps } from "@mui/material/transitions";
import { calculateNumberOfNights } from "../../utils/calculateNumberOfNights";

/**
 * This is a nice transition effect we were eager to try out,
 * and worked out well.
 * https://mui.com/material-ui/react-dialog/#transitions
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface EditBookingDialogProps {
  open: boolean;
  booking: any | null;
  room: any;
  onClose: () => void;
  onSave: (updatedBooking: any) => void;
}

/**
 * This component creates a pop up / modal form to dialog with the booking data,
 * and update them.
 * https://mui.com/material-ui/react-dialog/
 */
const EditBookingDialog: React.FC<EditBookingDialogProps> = ({
  open,
  booking,
  room,
  onClose,
  onSave,
}) => {
  if (!booking) return null;

  /**
   * We clone the booking so edits inside the modal do not immediately mutate
   * the parent state until the user clicks "Save".
   */
  const [localBooking, setLocalBooking] = useState({ ...booking });

  /**
   * Reset local state whenever a new booking is passed in.
   * This ensures the modal always displays the correct data when reopened.
   */
  useEffect(() => {
    setLocalBooking({ ...booking });
  }, [booking]);

  // Define today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  /**
   * Compute the minimum allowed check-out date.
   * If check-in is selected, the next day after check-in is the minimum.
   * If not, then 'tomorrow'.
   */
  const nextDayAfterCheckIn = localBooking.check_in
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
  const checkInDate = new Date(localBooking.check_in);
  const checkOutDate = new Date(localBooking.check_out);
  const dateError = checkInDate >= checkOutDate;

  const { data: availableRooms } = useAvailableRooms(
    localBooking.check_in,
    localBooking.check_out,
    localBooking.guests,
    /**
     * Fetching the booking id to exclude when checking the room availability for updates.
     * If we do not exclude it, the modal will show the overlapError at any time.
     * We want it to only show when there is an actual overlap with other bookings.
     */
    localBooking.id,
  );

  // Compute the total price based on the selected dates.
  const computePrice = (
    check_in: string,
    check_out: string,
    pricePerNight: number,
  ) => {
    if (!check_in || !check_out) {
      return {
        nights: booking.nights ?? 0,
        total_price: booking.total_price ?? 0,
      };
    }
    const nights = calculateNumberOfNights(check_in, check_out);
    const total_price = nights * pricePerNight;
    return { nights, total_price };
  };

  // Here we fetch the room id of our booked room to check its availability
  const roomIsAvailable =
    availableRooms?.some((r: any) => r.id === room.id) ?? true;

  // If the room is not available, we raise the overlapError
  const overlapError = !roomIsAvailable;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: Transition }}
    >
      <DialogTitle>Edit Booking</DialogTitle>

      <DialogContent>
        <TextField
          margin="dense"
          label="Check-in"
          type="date"
          fullWidth
          value={localBooking.check_in}
          // When the user selects a new check‑in date, recalculate
          // the number of nights and total price...
          onChange={(e) => {
            const newCheckIn = e.target.value;
            const { nights, total_price } = computePrice(
              newCheckIn,
              localBooking.check_out,
              room.price,
            );
            // ...then update the local booking state accordingly.
            setLocalBooking((prev: any) => ({
              ...prev,
              check_in: newCheckIn,
              nights,
              total_price,
            }));
          }}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: today },
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
          label="Check-out"
          type="date"
          fullWidth
          value={localBooking.check_out}
          onChange={(e) => {
            // When the user selects a new check‑out date, recalculate
            // the number of nights and total price...
            const newCheckOut = e.target.value;
            const { nights, total_price } = computePrice(
              localBooking.check_in,
              newCheckOut,
              room.price,
            );
            // ...then update the local booking state accordingly.
            setLocalBooking((prev: any) => ({
              ...prev,
              check_out: newCheckOut,
              nights,
              total_price,
            }));
          }}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: nextDayAfterCheckIn },
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
          label="Guests"
          type="number"
          fullWidth
          value={localBooking.guests}
          onChange={(e) => {
            /**
             * 'value' will return the smallest between what the user types
             * and the room capacity. This prevents exceeding the room capacity.
             */
            const value = Math.min(Number(e.target.value), room.capacity);
            setLocalBooking((prev: any) => ({ ...prev, guests: value }));
          }}
          slotProps={{
            htmlInput: { min: 1, max: room.capacity },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#472d30" }}>
          Cancel
        </Button>

        <Button
          onClick={() =>
            /**
             * Pass the fully recalculated booking data (...local booking) to the parent.
             * We explicitly include 'nights' and 'total_price' because the Stripe
             * payment flow depends on these values being accurate and up‑to‑date.
             * */
            onSave({
              ...localBooking,
              // Required for Stripe logic
              nights: localBooking.nights,
              total_price: localBooking.total_price,
            })
          }
          variant="contained"
          /**
           * By disabling the button in case of any errors, we prevent overlapping
           * and invalid date selections.
           */
          disabled={overlapError || dateError}
          sx={{
            backgroundColor: "#472d30",
            "&:hover": { bgcolor: "#e26d5c" },
          }}
        >
          Save
        </Button>
      </DialogActions>

      <Typography
        sx={{ p: 1, px: 3, pb: 2, fontSize: "0.85rem" }}
        color="text.secondary"
      >
        *Your payment process will be updated as well to reflect the latest
        changes.
      </Typography>
    </Dialog>
  );
};

export default EditBookingDialog;
