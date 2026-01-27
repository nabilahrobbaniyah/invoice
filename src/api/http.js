const BASE_URL = "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // WAJIB untuk cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  const data = await res.json();
  return data;
}
