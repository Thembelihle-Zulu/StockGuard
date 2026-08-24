const API_BASE = "http://127.0.0.1:5000/api/";

function authHeaders() {
  // Login.jsx stores this as a plain string (localStorage.setItem("token", body.token)),
  // not JSON — so it's read back the same way, no JSON.parse.
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Standalone version, no AuthContext/React state — this module can't
// clear in-memory auth state (there isn't any here), so a 401 clears
// localStorage only and does a full page redirect. If AuthContext is
// mounted elsewhere in the app, its own in-memory token/user/role
// won't be cleared by this path — only by AuthContext's own authFetch.
// Mixing this with AuthContext's authFetch in the same app risks the
// two falling out of sync; pick one as the actual source of truth.
export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }

    return res;
  } catch (error) {
    console.error("apiFetch failed:", error);
    throw error;
  }
}
