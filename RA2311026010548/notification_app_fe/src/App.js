import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { NotificationProvider, useNotificationContext } from "./state/NotificationContext.js";
import { NotificationsPage } from "./pages/NotificationsPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { initTokenFromStorage } from "./middleware/logger.js";
import { useEffect } from "react";

const theme = createTheme({
  palette: { mode: "light", primary: { main: "#1565c0" } },
  typography: { fontFamily: "'Segoe UI', sans-serif" },
});

function AppContent() {
  const { userId } = useNotificationContext();

  useEffect(() => {
    initTokenFromStorage();
  }, []);

  return userId ? <NotificationsPage /> : <LoginPage />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}
