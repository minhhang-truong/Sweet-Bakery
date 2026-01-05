import axios from "axios";
import { forceLogout } from "./authBridge";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

let hasShownAlert = false;

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && !hasShownAlert) {
      hasShownAlert = true;

      const currentPage =
        window.location.pathname + window.location.search;

      localStorage.setItem("postLoginRedirect", currentPage);

      alert("Your session has expired. Please sign in again.");

      await forceLogout();

      window.location.href = "/employee/signin";
    }
    return Promise.reject(err);
  }
);

export default api;
