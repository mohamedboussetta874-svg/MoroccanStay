const MS_PREFIX = "ms_";

export function msKey(name) {
  return name.startsWith(MS_PREFIX) ? name : `${MS_PREFIX}${name}`;
}

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key) {
  localStorage.removeItem(key);
}

export function sleep(ms = 350) {
  return new Promise((r) => setTimeout(r, ms));
}

