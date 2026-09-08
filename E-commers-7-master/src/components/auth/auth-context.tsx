"use client";

import { createContext, useContext } from "react";

type AuthContextValue = {
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextValue>({ isLoggedIn: false });

export function AuthProvider({
  isLoggedIn,
  children,
}: {
  isLoggedIn: boolean;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={{ isLoggedIn }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
