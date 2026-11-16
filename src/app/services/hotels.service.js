import { KEYS, seedLocalDb } from "./seed";
import { apiRequest, withApiFallback } from "./api-client";
import { readJson, writeJson, sleep } from "./storage";

seedLocalDb();

const isApproved = (hotel) => !hotel.status || hotel.status === "active" || hotel.status === "approved";

export async function listHotels({ includePending = false } = {}) {
  return withApiFallback(
    () => apiRequest(`/hotels${includePending ? "?includePending=1" : ""}`),
    async () => {
      await sleep();
      const hotels = readJson(KEYS.hotels, []);
      return includePending ? hotels : hotels.filter(isApproved);
    }
  );
}

export async function getHotelById(id) {
  return withApiFallback(
    () => apiRequest(`/hotels/${id}`),
    async () => {
      await sleep();
      return readJson(KEYS.hotels, []).find((h) => String(h.id) === String(id) && isApproved(h)) || null;
    }
  );
}

export async function approveHotel(id) {
  return withApiFallback(
    () => apiRequest(`/hotels/${id}`, { method: "PUT", body: JSON.stringify({ status: "active" }) }),
    async () => {
      await sleep();
      const hotels = readJson(KEYS.hotels, []);
      const idx = hotels.findIndex((h) => String(h.id) === String(id));
      if (idx < 0) throw new Error("Hotel not found");
      hotels[idx] = { ...hotels[idx], status: "active", approvedAt: new Date().toISOString() };
      writeJson(KEYS.hotels, hotels);
      return hotels[idx];
    }
  );
}

export async function upsertHotel(hotel) {
  return withApiFallback(
    () =>
      hotel.id && !String(hotel.id).startsWith("h-")
        ? apiRequest(`/hotels/${hotel.id}`, { method: "PUT", body: JSON.stringify(hotel) })
        : apiRequest("/hotels", { method: "POST", body: JSON.stringify(hotel) }),
    async () => {
      await sleep();
      const hotels = readJson(KEYS.hotels, []);
      const idx = hotels.findIndex((h) => String(h.id) === String(hotel.id));
      if (idx >= 0) hotels[idx] = { ...hotels[idx], ...hotel };
      else hotels.push(hotel);
      writeJson(KEYS.hotels, hotels);
      return hotel;
    }
  );
}

export async function deleteHotel(id) {
  return withApiFallback(
    async () => {
      await apiRequest(`/hotels/${id}`, { method: "DELETE" });
      return true;
    },
    async () => {
      await sleep();
      const hotels = readJson(KEYS.hotels, []).filter((h) => String(h.id) !== String(id));
      writeJson(KEYS.hotels, hotels);
      return true;
    }
  );
}
