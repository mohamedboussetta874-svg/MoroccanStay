import { KEYS, seedLocalDb } from "./seed";
import { apiRequest, withApiFallback } from "./api-client";
import { readJson, writeJson, sleep } from "./storage";

seedLocalDb();

export async function createPayment({ bookingId, amount, method = "card", meta }) {
  return withApiFallback(
    () => apiRequest("/payments", { method: "POST", body: JSON.stringify({ bookingId, amount, method, meta }) }),
    async () => {
      await sleep(700);
      const payments = readJson(KEYS.payments, []);
      const payment = {
        id: `p_${Date.now()}`,
        bookingId,
        amount,
        method,
        meta: meta || {},
        status: "paid",
        createdAt: new Date().toISOString(),
      };
      payments.unshift(payment);
      writeJson(KEYS.payments, payments);
      return payment;
    }
  );
}
