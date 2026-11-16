const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function withApiFallback(apiCall, fallbackCall) {
  try {
    return await apiCall();
  } catch {
    return fallbackCall();
  }
}
