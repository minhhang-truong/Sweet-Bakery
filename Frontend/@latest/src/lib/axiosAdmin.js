import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // required for cookie-based auth
});

let hasShownAlert = false;

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && !hasShownAlert) {
      hasShownAlert = true;

      // 1. Save the page user is working on
      const currentPage =
        window.location.pathname + window.location.search;

      localStorage.setItem("postLoginRedirect", currentPage);

      // 2. Inform user
      alert("Your session has expired. Please sign in again.");

      // 3. Redirect to login
      window.location.href = "/manager/signin";
    }
    return Promise.reject(err);
  }
);

export default api;
