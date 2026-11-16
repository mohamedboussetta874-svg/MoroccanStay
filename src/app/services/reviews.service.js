import { KEYS, seedLocalDb } from "./seed";
import { apiRequest, withApiFallback } from "./api-client";
import { readJson, writeJson, sleep } from "./storage";

seedLocalDb();

export async function listApprovedReviews(hotelId) {
  return withApiFallback(
    () => apiRequest(`/reviews/approved${hotelId ? `?hotelId=${encodeURIComponent(hotelId)}` : ""}`),
    async () => {
      await sleep(200);
      const all = readJson(KEYS.reviewsApproved, []);
      return hotelId ? all.filter((r) => String(r.hotelId) === String(hotelId)) : all;
    }
  );
}

export async function listPendingReviews() {
  return withApiFallback(
    () => apiRequest("/reviews/pending"),
    async () => {
      await sleep(200);
      return readJson(KEYS.reviewsPending, []);
    }
  );
}

export async function submitReviewPending(review) {
  return withApiFallback(
    () => apiRequest("/reviews", { method: "POST", body: JSON.stringify(review) }),
    async () => {
      await sleep();
      const pending = readJson(KEYS.reviewsPending, []);
      const r = { id: `r_${Date.now()}`, status: "pending", createdAt: new Date().toISOString(), ...review };
      pending.unshift(r);
      writeJson(KEYS.reviewsPending, pending);
      return r;
    }
  );
}

export async function approveReview(id) {
  return withApiFallback(
    async () => {
      await apiRequest(`/reviews/${id}/approve`, { method: "PATCH" });
      return true;
    },
    async () => {
      await sleep();
      const pending = readJson(KEYS.reviewsPending, []);
      const idx = pending.findIndex((r) => r.id === id);
      if (idx < 0) throw new Error("Review not found");
      const [r] = pending.splice(idx, 1);
      writeJson(KEYS.reviewsPending, pending);
      const approved = readJson(KEYS.reviewsApproved, []);
      approved.unshift({ ...r, status: "approved", approvedAt: new Date().toISOString(), pending: false });
      writeJson(KEYS.reviewsApproved, approved);
      return true;
    }
  );
}

export async function rejectReview(id) {
  return withApiFallback(
    async () => {
      await apiRequest(`/reviews/${id}`, { method: "DELETE" });
      return true;
    },
    async () => {
      await sleep();
      const pending = readJson(KEYS.reviewsPending, []).filter((r) => r.id !== id);
      writeJson(KEYS.reviewsPending, pending);
      return true;
    }
  );
}
