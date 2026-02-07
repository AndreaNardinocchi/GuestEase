/**
 * Create Booking (Admin)
 * Sends a POST request to the admin backend to create a booking.
 */
export const adminCreateBookingApi = async (bookingData: {
  room_id: string;
  user_email: string;
  check_in: string;
  check_out: string;
  guests: number;
}) => {
  const res = await fetch("http://localhost:3000/admin/create-booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create booking");
  }

  return data;
};
