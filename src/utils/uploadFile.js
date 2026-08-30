const API_BASE = "http://127.0.0.1:5000/api/";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
}

const UPLOAD_BASE = "http://127.0.0.1:5000/api/uploads";

export async function uploadFile(file, subfolder) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("file", file);
  formData.append("subfolder", subfolder);

  const response = await fetch(UPLOAD_BASE, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Upload failed");
  }

  const data = await response.json();
  return data.url;
}
