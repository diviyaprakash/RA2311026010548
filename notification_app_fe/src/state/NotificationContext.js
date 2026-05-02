import React, { createContext, useContext, useReducer } from "react";

const NotificationContext = createContext(null);

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "LOADED":
      return { ...state, loading: false, notifications: action.payload };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    case "MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };
    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
