import { BookingWithUser } from "../types/interfaces";
import { getRoomName } from "../utils/getRoomName";

interface Filters {
  search: string;
}

export function useFilteredBookings(
  bookings: BookingWithUser[],
  filters: Filters,
  rooms: any[] | undefined,
) {
  const roomList = rooms ?? [];

  // Filtered data
  // https://www.kindacode.com/article/how-to-create-a-filter-search-list-in-react
  // https://www.cybrosys.com/blog/how-to-build-a-search-bar-to-filter-data-in-react
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  const filtered = bookings.filter((b) =>
    [
      b.id,
      getRoomName(b.room_id, roomList),
      b.first_name,
      b.last_name,
      b.user_email,
      b.check_in,
      b.check_out,
      b.guests,
      b.total_price,
      b.created_at,
      b.charged,
    ]
      // We combine all the booking fields to be able to search anything that is included in the rows
      .join(" ")
      .toLowerCase()
      .includes(filters.search.toLowerCase()),
  );

  return filtered;
}
