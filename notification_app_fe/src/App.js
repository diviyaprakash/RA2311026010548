import React from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { NotificationProvider } from "./state/NotificationContext";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import { Log } from "./middleware/logger";

const theme = createTheme({
  typography: { fontFamily: "'Inter', sans-serif" },
  palette: {
    primary: { main: "#1a237e" },
    secondary: { main: "#ffa726" },
  },
});

function AppRoutes() {
  const { auth } = useAuth();
  if (!auth) return <LoginPage />;
  return (
    <NotificationProvider>
      <NotificationsPage />
    </NotificationProvider>
  );
}

export default function App() {
  Log("frontend", "info", "config", "App initialized");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
