import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { registerLogout } from "../lib/authBridge";

const KEY = "auth:user:v1";
const AuthCtx = createContext(null);
const API_URL = import.meta.env.VITE_BACKEND_URL;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
}
function save(user) {
  if (!user) localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);

  useEffect(() => { save(user); }, [user]);

  const api = useMemo(() => ({
    user,
    isAuthed: !!user,

    login(user) {
      // mock: nếu chưa có name, suy từ email
      setUser(user);
      user.name = user.fullname.split(" ")[0];
    },
    async logout() {
      if(user.role === 1){
        await axios.post(`${API_URL}/auth/logout`,{}, { withCredentials: true });
      }
      else if(user.role === 2){
        await axios.post(`${API_URL}/employee/auth/logout`, {}, { withCredentials: true });
      }
      else{
        await axios.post(`${API_URL}/manager/auth/logout`, {}, { withCredentials: true });
      }
      setUser(null);
    },

    updateUser(patch) {
      setUser(prev => ({ ...prev, ...patch }));
    },

    async updateProfile(patch) {
      if (!user) return;
      try {
        const res = await axios.put(`${API_URL}/auth/${user.id}`, patch, {
          withCredentials: true
        });
        setUser(prev => ({ ...prev, ...res.data }));
        alert("Profile updated successfully!");
      } catch (err) {
        console.error("Update failed:", err.response?.data || err.message);
        alert("Failed to update profile.");
      }
    },
  }), [user]);

  useEffect(() => {
    registerLogout(api.logout);
  }, [api.logout]);

  return <AuthCtx.Provider value={api}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
