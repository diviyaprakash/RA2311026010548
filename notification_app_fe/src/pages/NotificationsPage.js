import React, { useEffect, useState, useCallback } from "react";
import {
  Box, AppBar, Toolbar, Typography, IconButton, Tabs, Tab,
  ToggleButton, ToggleButtonGroup, Pagination, CircularProgress,
  Alert, Badge, Tooltip, Chip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarIcon from "@mui/icons-material/Star";
import InboxIcon from "@mui/icons-material/Inbox";

import { useAuth } from "../auth/AuthContext";
import { useNotifications } from "../state/NotificationContext";
import { fetchNotifications, markAsRead } from "../api/notificationApi";
import { getPriorityInbox } from "../utils/priorityInbox";
import NotificationCard from "../components/NotificationCard";
import { Log } from "../middleware/logger";

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const { auth, logout }      = useAuth();
  const { state, dispatch }   = useNotifications();
  const { notifications, loading, error } = state;

  const [tab, setTab]         = useState(0);
  const [filter, setFilter]   = useState("All");
  const [page, setPage]       = useState(1);

  const load = useCallback(async () => {
    dispatch({ type: "LOADING" });
    Log("frontend", "info", "page", "NotificationsPage mounted – loading notifications");
    try {
      const data = await fetchNotifications(auth.token);
      dispatch({ type: "LOADED", payload: data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  }, [auth.token, dispatch]);

  useEffect(() => { load(); }, [load]);

  async function handleMarkRead(id) {
    await markAsRead(auth.token, id);
    dispatch({ type: "MARK_READ", payload: id });
  }

  // ── Filtered list for "All" tab ─────────────────────────────────────────
  const filtered = filter === "All"
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const pageCount  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Priority inbox list ─────────────────────────────────────────────────
  const priorityList = getPriorityInbox(notifications);

  function handleFilter(_, val) {
    if (val !== null) {
      Log("frontend", "debug", "component", `Filter changed to ${val}`);
      setFilter(val);
      setPage(1);
    }
  }

  return (
    <Box minHeight="100vh" bgcolor="#f5f6fa">
      {/* AppBar */}
      <AppBar position="sticky" sx={{ background: "linear-gradient(90deg,#1a237e,#3949ab)" }}>
        <Toolbar>
          <InboxIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700} flexGrow={1}>
            Notification Inbox
          </Typography>
          <Chip
            label={`${unreadCount} unread`}
            color="warning"
            size="small"
            sx={{ mr: 2, fontWeight: 600 }}
          />
          <Tooltip title="Refresh">
            <IconButton color="inherit" onClick={load}><RefreshIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={logout}><LogoutIcon /></IconButton>
          </Tooltip>
        </Toolbar>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ px: 2 }}
        >
          <Tab
            label={
              <Badge badgeContent={unreadCount} color="error" max={99}>
                <Box pr={1}>All Notifications</Box>
              </Badge>
            }
          />
          <Tab icon={<StarIcon fontSize="small" />} iconPosition="start" label="Priority Inbox" />
        </Tabs>
      </AppBar>

      {/* Content */}
      <Box maxWidth={720} mx="auto" p={{ xs: 2, sm: 3 }}>

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            {/* ── Tab 0: All Notifications ─────────────────────────── */}
            {tab === 0 && (
              <>
                {/* Filter bar */}
                <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    Filter by type:
                  </Typography>
                  <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={handleFilter}
                    size="small"
                  >
                    {["All", "Placement", "Result", "Event"].map((t) => (
                      <ToggleButton key={t} value={t} sx={{ textTransform: "none" }}>
                        {t}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <Typography variant="caption" color="text.secondary" ml="auto">
                    {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>

                {paginated.length === 0 ? (
                  <Box textAlign="center" py={6}>
                    <InboxIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                    <Typography color="text.secondary" mt={1}>No notifications found</Typography>
                  </Box>
                ) : (
                  paginated.map((n) => (
                    <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
                  ))
                )}

                {pageCount > 1 && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                      count={pageCount}
                      page={page}
                      onChange={(_, v) => setPage(v)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}

            {/* ── Tab 1: Priority Inbox ─────────────────────────────── */}
            {tab === 1 && (
              <>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <StarIcon color="warning" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Top 10 Priority Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary" ml={1}>
                    (Placement &gt; Result &gt; Event, then newest first)
                  </Typography>
                </Box>

                {priorityList.length === 0 ? (
                  <Box textAlign="center" py={6}>
                    <StarIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                    <Typography color="text.secondary" mt={1}>No notifications yet</Typography>
                  </Box>
                ) : (
                  priorityList.map((n, i) => (
                    <Box key={n.id} display="flex" alignItems="flex-start" gap={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ pt: 2, minWidth: 20, fontWeight: 700 }}
                      >
                        {i + 1}.
                      </Typography>
                      <Box flexGrow={1}>
                        <NotificationCard notification={n} onMarkRead={handleMarkRead} />
                      </Box>
                    </Box>
                  ))
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
