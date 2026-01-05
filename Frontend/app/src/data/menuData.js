const API_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";

// --- CACHE ---
let MENU_CACHE = null; // store fetched menu

// Fetch from backend and store into cache
export async function fetchMenu() {
  try {
    const res = await axios.get(`${API_URL}/menu`, {
      withCredentials: true,
    });
    MENU_CACHE = res.data; // save menu received (array/grouped)
    return MENU_CACHE;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return []; // always return array
  }
}

// Return cached menu, or fetch if not fetched yet
export async function getMenu() {
  if (MENU_CACHE) return MENU_CACHE;
  return await fetchMenu();
}