import { KEYS, seedLocalDb } from "./seed";
import { apiRequest, withApiFallback } from "./api-client";
import { readJson, writeJson, sleep } from "./storage";

seedLocalDb();

export async function listGuides() {
  return withApiFallback(
    () => apiRequest("/guides"),
    async () => {
      await sleep();
      return readJson(KEYS.guides, []);
    }
  );
}

export async function upsertGuide(guide) {
  return withApiFallback(
    () =>
      guide.id && !String(guide.id).startsWith("g-")
        ? apiRequest(`/guides/${guide.id}`, { method: "PUT", body: JSON.stringify(guide) })
        : apiRequest("/guides", { method: "POST", body: JSON.stringify(guide) }),
    async () => {
      await sleep();
      const guides = readJson(KEYS.guides, []);
      const idx = guides.findIndex((g) => g.id === guide.id);
      if (idx >= 0) guides[idx] = { ...guides[idx], ...guide };
      else guides.push(guide);
      writeJson(KEYS.guides, guides);

      if (guide?.email) {
        const users = readJson(KEYS.users, []);
        if (!users.some((u) => u.email === guide.email)) {
          writeJson(KEYS.users, [
            ...users,
            {
              id: guide.id,
              name: guide.name,
              email: guide.email,
              password: "guide123",
              role: "guide",
            },
          ]);
        }
      }
      return guide;
    }
  );
}

export async function setGuideAvailability(guideId, available) {
  return withApiFallback(
    () => apiRequest(`/guides/${guideId}`, { method: "PUT", body: JSON.stringify({ available: Boolean(available) }) }),
    async () => {
      await sleep();
      const guides = readJson(KEYS.guides, []);
      const idx = guides.findIndex((g) => g.id === guideId);
      if (idx < 0) throw new Error("Guide not found");
      guides[idx] = { ...guides[idx], available: Boolean(available) };
      writeJson(KEYS.guides, guides);
      return guides[idx];
    }
  );
}

export async function listAssignmentsForGuide(guideId) {
  return withApiFallback(
    () => apiRequest(`/guide-assignments?guideId=${encodeURIComponent(guideId)}`),
    async () => {
      await sleep();
      return readJson(KEYS.assignments, []).filter((a) => a.guideId === guideId);
    }
  );
}

export async function createAssignment(assignment) {
  return withApiFallback(
    () => apiRequest("/guide-assignments", { method: "POST", body: JSON.stringify(assignment) }),
    async () => {
      await sleep();
      const list = readJson(KEYS.assignments, []);
      const a = { id: `as_${Date.now()}`, createdAt: new Date().toISOString(), ...assignment };
      list.unshift(a);
      writeJson(KEYS.assignments, list);
      return a;
    }
  );
}
