// apps/web/src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends httpOnly cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Silent token refresh interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Silently refresh the access token
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        // Retry the original request
        return api(originalRequest);
      } catch {
        // Refresh failed — redirect to login
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
