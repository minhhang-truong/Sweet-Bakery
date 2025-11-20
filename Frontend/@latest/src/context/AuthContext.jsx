import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from 'axios';

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

    login({ id, email, name}) {
      // mock: nếu chưa có name, suy từ email
      const displayName = name.split(" ")[0];
      setUser({ id, email, name: displayName});
    },
    logout() {
      setUser(null);
      localStorage.removeItem("token");
    },

    async updateProfile(patch) {
      if (!user) return;
      try {
        const res = await axios.put(`${API_URL}/auth/${user.id}`, patch, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUser(prev => ({ ...prev, ...res.data }));
        alert("Profile updated successfully!");
      } catch (err) {
        console.error("Update failed:", err.response?.data || err.message);
        alert("Failed to update profile.");
      }
    },
  }), [user]);

  return <AuthCtx.Provider value={api}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
