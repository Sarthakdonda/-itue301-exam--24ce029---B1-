export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error?.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
