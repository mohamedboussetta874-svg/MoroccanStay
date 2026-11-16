import { KEYS, seedLocalDb } from "./seed";
import { apiRequest, withApiFallback } from "./api-client";
import { readJson, writeJson, sleep } from "./storage";

seedLocalDb();

function overlaps(aStart, aEnd, bStart, bEnd) {
  const a1 = new Date(aStart).getTime();
  const a2 = new Date(aEnd).getTime();
  const b1 = new Date(bStart).getTime();
  const b2 = new Date(bEnd).getTime();
  if (!Number.isFinite(a1) || !Number.isFinite(a2) || !Number.isFinite(b1) || !Number.isFinite(b2)) return false;
  return a1 < b2 && b1 < a2; // [start,end)
}

export async function listBookings() {
  return withApiFallback(
    () => apiRequest("/bookings"),
    async () => {
      await sleep();
      return readJson(KEYS.bookings, []);
    }
  );
}

export async function listBookingsForUser(userId) {
  return withApiFallback(
    () => apiRequest(`/bookings?userId=${encodeURIComponent(userId)}`),
    async () => {
      await sleep();
      return readJson(KEYS.bookings, []).filter((b) => b.userId === userId);
    }
  );
}

export async function checkAvailability({ hotelId, roomId, checkIn, checkOut }) {
  return withApiFallback(
    () =>
      apiRequest("/bookings/check-availability", {
        method: "POST",
        body: JSON.stringify({ hotelId, roomId, checkIn, checkOut }),
      }),
    async () => {
      await sleep(200);
      const bookings = readJson(KEYS.bookings, []);
      const active = bookings.filter(
        (b) =>
          String(b.hotelId) === String(hotelId) &&
          String(b.roomId) === String(roomId) &&
          b.status !== "cancelled"
      );
      const conflict = active.some((b) => overlaps(checkIn, checkOut, b.checkIn, b.checkOut));
      return { available: !conflict };
    }
  );
}

export async function createBooking(payload) {
  return withApiFallback(
    () => apiRequest("/bookings", { method: "POST", body: JSON.stringify(payload) }),
    async () => {
      await sleep();
      const bookings = readJson(KEYS.bookings, []);
      const booking = {
        id: `b_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "pending",
        ...payload,
      };
      bookings.unshift(booking);
      writeJson(KEYS.bookings, bookings);
      return booking;
    }
  );
}

export async function updateBookingStatus(id, status) {
  return withApiFallback(
    () => apiRequest(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    async () => {
      await sleep();
      const bookings = readJson(KEYS.bookings, []);
      const idx = bookings.findIndex((b) => b.id === id);
      if (idx < 0) throw new Error("Booking not found");
      bookings[idx] = { ...bookings[idx], status, updatedAt: new Date().toISOString() };
      writeJson(KEYS.bookings, bookings);
      return bookings[idx];
    }
  );
}

export async function cancelBooking(id) {
  return updateBookingStatus(id, "cancelled");
}
