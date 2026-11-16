import { hotels as initialHotels } from "../data/hotels";
import { readJson, writeJson, msKey } from "./storage";

export const KEYS = {
  hotels: msKey("hotels"),
  guides: msKey("guides"),
  bookings: msKey("bookings"),
  payments: msKey("payments"),
  reviewsApproved: msKey("reviews_approved"),
  reviewsPending: msKey("pending_reviews"),
  assignments: msKey("guide_assignments"),
  users: msKey("users"),
  session: msKey("session"),
};

const defaultGuides = [
  {
    id: "g1",
    name: "Hassan Benjelloun",
    city: "Marrakech",
    email: "hassan.guide@moroccanstay.com",
    rating: 4.9,
    rate: 120,
    languages: "French, English",
    available: true,
  },
  {
    id: "g2",
    name: "Khadija Amrani",
    city: "Fès",
    email: "khadija.guide@moroccanstay.com",
    rating: 4.8,
    rate: 95,
    languages: "French, Arabic",
    available: true,
  },
  {
    id: "g3",
    name: "Younes Filali",
    city: "Chefchaouen",
    email: "younes.guide@moroccanstay.com",
    rating: 4.7,
    rate: 110,
    languages: "English, Spanish",
    available: false,
  },
  {
    id: "g4",
    name: "Nadia Laarbi",
    city: "Casablanca",
    email: "nadia.guide@moroccanstay.com",
    rating: 4.9,
    rate: 100,
    languages: "French, Arabic",
    available: true,
  },
];

function ensure(key, value) {
  const existing = readJson(key, null);
  if (existing == null) writeJson(key, value);
}

export function seedLocalDb() {
  ensure(KEYS.hotels, initialHotels);
  ensure(KEYS.guides, defaultGuides);
  ensure(KEYS.bookings, []);
  ensure(KEYS.payments, []);
  ensure(KEYS.reviewsApproved, []);
  ensure(KEYS.reviewsPending, readJson("ms_pending_reviews", [])); // backward compat
  ensure(KEYS.assignments, []);
  ensure(KEYS.users, []);

  // Ensure demo guide accounts exist (do not overwrite existing users)
  const users = readJson(KEYS.users, []);
  const toAdd = defaultGuides
    .filter((g) => g.email && !users.some((u) => u.email === g.email))
    .map((g) => ({
      id: g.id,
      name: g.name,
      email: g.email,
      password: "guide123",
      role: "guide",
    }));
  if (toAdd.length) writeJson(KEYS.users, [...users, ...toAdd]);
}

