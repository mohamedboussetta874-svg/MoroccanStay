import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as hotelsApi from "../services/hotels.service";
import * as bookingsApi from "../services/bookings.service";
import * as guidesApi from "../services/guides.service";
import * as reviewsApi from "../services/reviews.service";
import * as paymentsApi from "../services/payments.service";
import { seedLocalDb } from "../services/seed";

export const AppDataContext = createContext(undefined);

export function AppDataProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [hotels, setHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]);
  const [guides, setGuides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      seedLocalDb();
      const [allH, g, b, pr] = await Promise.all([
        hotelsApi.listHotels({ includePending: true }),
        guidesApi.listGuides(),
        bookingsApi.listBookings(),
        reviewsApi.listPendingReviews(),
      ]);
      setAllHotels(allH);
      setHotels(allH.filter((h) => !h.status || h.status === "active" || h.status === "approved"));
      setGuides(g);
      setBookings(b);
      setPendingReviews(pr);
    } catch (e) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const checkAvailability = useCallback(async (input) => {
    setError(null);
    return bookingsApi.checkAvailability(input);
  }, []);

  const createBooking = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const b = await bookingsApi.createBooking(payload);
      setBookings((p) => [b, ...p]);
      return b;
    } catch (e) {
      setError(e?.message || "Failed to create booking");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookingStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const b = await bookingsApi.updateBookingStatus(id, status);
      setBookings((p) => p.map((x) => (x.id === b.id ? b : x)));
      return b;
    } catch (e) {
      setError(e?.message || "Failed to update booking");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertHotel = useCallback(async (hotel) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await hotelsApi.upsertHotel(hotel);
      const h = await hotelsApi.listHotels({ includePending: true });
      setAllHotels(h);
      setHotels(h.filter((x) => !x.status || x.status === "active" || x.status === "approved"));
      return saved;
    } catch (e) {
      setError(e?.message || "Failed to save hotel");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeHotel = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await hotelsApi.deleteHotel(id);
      setHotels((p) => p.filter((h) => String(h.id) !== String(id)));
      setAllHotels((p) => p.filter((h) => String(h.id) !== String(id)));
      return true;
    } catch (e) {
      setError(e?.message || "Failed to delete hotel");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveHotel = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await hotelsApi.approveHotel(id);
      const h = await hotelsApi.listHotels({ includePending: true });
      setAllHotels(h);
      setHotels(h.filter((x) => !x.status || x.status === "active" || x.status === "approved"));
      return saved;
    } catch (e) {
      setError(e?.message || "Failed to approve hotel");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertGuide = useCallback(async (guide) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await guidesApi.upsertGuide(guide);
      const g = await guidesApi.listGuides();
      setGuides(g);
      return saved;
    } catch (e) {
      setError(e?.message || "Failed to save guide");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const setGuideAvailability = useCallback(async (guideId, available) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await guidesApi.setGuideAvailability(guideId, available);
      setGuides((p) => p.map((g) => (g.id === guideId ? updated : g)));
      return updated;
    } catch (e) {
      setError(e?.message || "Failed to update availability");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAssignment = useCallback(async (assignment) => {
    setLoading(true);
    setError(null);
    try {
      return await guidesApi.createAssignment(assignment);
    } catch (e) {
      setError(e?.message || "Failed to create assignment");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const listAssignmentsForGuide = useCallback(async (guideId) => {
    setError(null);
    return guidesApi.listAssignmentsForGuide(guideId);
  }, []);

  const submitReviewPending = useCallback(async (review) => {
    setLoading(true);
    setError(null);
    try {
      const r = await reviewsApi.submitReviewPending(review);
      setPendingReviews((p) => [r, ...p]);
      return r;
    } catch (e) {
      setError(e?.message || "Failed to submit review");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const listApprovedReviews = useCallback(async (hotelId) => {
    setError(null);
    return reviewsApi.listApprovedReviews(hotelId);
  }, []);

  const approveReview = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await reviewsApi.approveReview(id);
      setPendingReviews((p) => p.filter((r) => r.id !== id));
      return true;
    } catch (e) {
      setError(e?.message || "Failed to approve review");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectReview = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await reviewsApi.rejectReview(id);
      setPendingReviews((p) => p.filter((r) => r.id !== id));
      return true;
    } catch (e) {
      setError(e?.message || "Failed to reject review");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (input) => {
    setLoading(true);
    setError(null);
    try {
      return await paymentsApi.createPayment(input);
    } catch (e) {
      setError(e?.message || "Payment failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      loading,
      error,
      hotels,
      allHotels,
      guides,
      bookings,
      pendingReviews,
      refreshAll,
      checkAvailability,
      createBooking,
      updateBookingStatus,
      upsertHotel,
      removeHotel,
      approveHotel,
      upsertGuide,
      setGuideAvailability,
      createAssignment,
      listAssignmentsForGuide,
      submitReviewPending,
      listApprovedReviews,
      approveReview,
      rejectReview,
      createPayment,
    }),
    [
      loading,
      error,
      hotels,
      allHotels,
      guides,
      bookings,
      pendingReviews,
      refreshAll,
      checkAvailability,
      createBooking,
      updateBookingStatus,
      upsertHotel,
      removeHotel,
      approveHotel,
      upsertGuide,
      setGuideAvailability,
      createAssignment,
      listAssignmentsForGuide,
      submitReviewPending,
      listApprovedReviews,
      approveReview,
      rejectReview,
      createPayment,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
