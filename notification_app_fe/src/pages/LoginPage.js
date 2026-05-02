import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../auth/AuthContext";
import { Log } from "../middleware/logger";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail]   = useState("");
  const [token, setToken]   = useState("");
  const [error, setError]   = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (!email || !token.trim()) { setError("Email and access token are required."); return; }
    Log("frontend", "info", "auth", `Login for ${email}`);
    login(email, token.trim());
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)" }}
      p={2}
    >
      <Card sx={{ maxWidth: 420, width: "100%", borderRadius: 3 }} elevation={12}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 60, height: 60, borderRadius: "50%",
                background: "linear-gradient(135deg, #1a237e, #3949ab)",
                display: "flex", alignItems: "center", justifyContent: "center", mb: 2,
              }}
            >
              <NotificationsIcon sx={{ color: "white", fontSize: 30 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>Notification Inbox</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Sign in with your AffordMed credentials
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>
                ),
              }}
            />
            <TextField
              label="Access Token (JWT)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              fullWidth
              required
              multiline
              minRows={2}
              maxRows={4}
              placeholder="Paste your JWT token here"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                    <VpnKeyIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={false}
              sx={{
                py: 1.5,
                background: "linear-gradient(90deg, #1a237e, #3949ab)",
                fontWeight: 600,
              }}
            >
              Sign In
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" display="block" mt={2} textAlign="center">
            Get your token from the AffordMed evaluation service /auth endpoint
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
