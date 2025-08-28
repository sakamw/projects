import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  Container,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Report as ReportIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications } = useNotification();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] =
    useState<null | HTMLElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleCloseUserMenu();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleCloseUserMenu();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <ReportIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Community Reporter
          </Typography>

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                color="inherit"
                onClick={() => navigate("/reports")}
                sx={{
                  backgroundColor: isActive("/reports")
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                }}
              >
                My Reports
              </Button>

              {user.role === "admin" && (
                <Button
                  color="inherit"
                  onClick={() => navigate("/admin")}
                  sx={{
                    backgroundColor: isActive("/admin")
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  }}
                >
                  Admin Dashboard
                </Button>
              )}

              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleOpenNotifications}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => handleNavigation("/profile")}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>

              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElNotifications}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotifications}
              >
                {notifications.length === 0 ? (
                  <MenuItem>
                    <Typography textAlign="center">No notifications</Typography>
                  </MenuItem>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={handleCloseNotifications}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={notification.read ? "normal" : "bold"}
                        >
                          {notification.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{
                  backgroundColor: isActive("/login")
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/register")}
                sx={{
                  backgroundColor: isActive("/register")
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Community Reporter. Built for better communities.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
