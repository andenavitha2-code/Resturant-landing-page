import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as api from "../lib/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.currentUser());
  const login = useCallback(async (email, password, remember) => setUser(await api.logIn({ email, password, remember })), []);
  const signup = useCallback(async (name, email, password, remember) => setUser(await api.signUp({ name, email, password, remember })), []);
  const logout = useCallback(() => { api.logOut(); setUser(null); }, []);
  const value = useMemo(() => ({ user, login, signup, logout }), [user, login, signup, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used inside <AuthProvider>");
  return c;
}
