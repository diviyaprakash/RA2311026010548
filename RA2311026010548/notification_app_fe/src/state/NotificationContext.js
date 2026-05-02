import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  const login = (id) => {
    setUserId(id);
    localStorage.setItem("userId", id);
  };

  const logout = () => {
    setUserId("");
    localStorage.removeItem("userId");
    localStorage.removeItem("access_token");
  };

  return (
    <NotificationContext.Provider value={{ userId, login, logout }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
