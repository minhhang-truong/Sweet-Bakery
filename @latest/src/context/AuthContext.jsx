import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "auth:user:v1";
const AuthCtx = createContext(null);

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

    login({ email, name }) {
      // mock: nếu chưa có name, suy từ email
      const displayName = name || email.split("@")[0];
      setUser({ email, name: displayName, phone: "", address: "" });
    },
    logout() { setUser(null); },

    updateProfile(patch) { setUser(prev => ({ ...prev, ...patch })); }
  }), [user]);

  return <AuthCtx.Provider value={api}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
