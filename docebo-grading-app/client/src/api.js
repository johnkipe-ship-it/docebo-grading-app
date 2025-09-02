/**
 * Helper functions to call the BFF endpoints.
 *
 * All requests are relative to the current origin (proxy configured in
 * package.json or served by the Express server).  These functions
 * automatically parse JSON responses and throw errors for non‑OK
 * responses.
 */

async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || res.statusText);
  }
  return res.json();
}

export async function fetchSubmissions(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const url = `/api/submissions${params ? `?${params}` : ''}`;
  return request(url);
}

export async function fetchSubmission(id) {
  return request(`/api/submissions/${id}`);
}

export async function updateSubmission(id, body) {
  return request(`/api/submissions/${id}`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

// Redirect the user to the login endpoint to start OAuth
export function startLogin() {
  window.location.href = '/login';
}