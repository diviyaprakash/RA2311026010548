import { useState } from "react";
import {
  Container, TextField, Button, Typography,
  Box, Alert, CircularProgress
} from "@mui/material";
import { authenticate } from "../auth/authService.js";
import { useNotificationContext } from "../state/NotificationContext.js";
import { setAuthToken } from "../middleware/logger.js";
import logger from "../middleware/logger.js";

export function LoginPage() {
  const { login } = useNotificationContext();
  const [form, setForm] = useState({
    email: "", name: "", rollNo: "", accessCode: "", clientID: "", clientSecret: "", userId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    logger.info("page", "LoginPage: user attempting authentication");
    try {
      const data = await authenticate(form);
      setAuthToken(data.access_token);
      login(form.userId || form.rollNo);
      logger.info("page", "LoginPage: authentication successful, navigating to notifications");
    } catch (err) {
      setError(err.message);
      logger.error("page", `LoginPage: authentication failed - ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
        Sign In
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {["email", "name", "rollNo", "accessCode", "clientID", "clientSecret", "userId"].map((field) => (
        <TextField
          key={field}
          fullWidth
          label={field}
          name={field}
          value={form[field]}
          onChange={handleChange}
          type={field === "clientSecret" ? "password" : "text"}
          sx={{ mb: 2 }}
          size="small"
        />
      ))}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? <CircularProgress size={22} /> : "Login"}
      </Button>
    </Container>
  );
}
