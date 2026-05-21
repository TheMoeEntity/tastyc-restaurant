const BASE_URL = "http://localhost:4000";

interface FetchOptions extends RequestInit {
  data?: unknown;
}

// ── Refresh-token mutex ───────────────────────────────────────
// Prevents multiple concurrent 401 responses from each trying to
// refresh the token independently (race condition).
let isRefreshing = false;
let refreshQueue: Array<(ok: boolean) => void> = [];

function drainQueue(ok: boolean) {
  refreshQueue.forEach((resolve) => resolve(ok));
  refreshQueue = [];
}

async function silentRefresh(): Promise<boolean> {
  if (isRefreshing) {
    // Another request is already refreshing — wait for its result
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    console.log("Silent refresh status:", res.status);
    const body = await res.json();
    console.log("Silent refresh body:", body);
    const ok = res.ok;
    drainQueue(ok);
    return ok;
  } catch {
    drainQueue(false);
    return false;
  } finally {
    isRefreshing = false;
  }
}

// ── Core fetch wrapper ────────────────────────────────────────
// ── Auth endpoints that should never trigger silent refresh ───
const NO_REFRESH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  // "/api/auth/me"
];

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
  _isRetry = false,
): Promise<T> {
  const { data, ...rest } = options;
  const isFormData = data instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...rest.headers,
    },
    body: isFormData ? data : data ? JSON.stringify(data) : rest.body,
  });

  // ── Silent refresh on 401 ─────────────────────────────────
  if (res.status === 401 && !_isRetry) {
    const json = await res.json();

    // Never refresh for auth endpoints — surface the real error
    if (NO_REFRESH_PATHS.some((p) => path.startsWith(p))) {
      throw new Error(json.message || "Request failed with status 401");
    }

    const refreshed = await silentRefresh();

    if (refreshed) {
      return apiFetch<T>(path, options, true);
    }

    if (typeof window !== "undefined") {
      const currentPath = encodeURIComponent(window.location.pathname);
      // Don't redirect if already on auth pages — prevents loops
      if (currentPath.startsWith("/auth/")) {
        throw new Error("Session expired. Please log in again.");
      }
      const hadSession = document.cookie.includes("tastyc_user_id=");
      const reason = hadSession ? "expired" : "required";

      window.location.href = `/auth/login?reason=${reason}&redirect=${currentPath}`;
    }

    throw new Error("Please log in to continue");
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json;
}

export default apiFetch;
