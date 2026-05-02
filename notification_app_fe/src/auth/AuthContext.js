import React, { createContext, useContext, useState } from "react";
import { setAuthToken } from "../middleware/logger";
import { Log } from "../middleware/logger";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // { email, token }

  function login(email, token) {
    setAuthToken(token);
    Log("frontend", "info", "auth", `User ${email} logged in`);
    setAuth({ email, token });
  }

  function logout() {
    Log("frontend", "info", "auth", "User logged out");
    setAuthToken(null);
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
