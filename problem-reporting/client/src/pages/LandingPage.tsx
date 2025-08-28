import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Card,
  CardContent,
  Paper,
  Chip,
} from "@mui/material";
import {
  Report as ReportIcon,
  Map as MapIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  WaterDrop as WaterIcon,
  ElectricalServices as ElectricityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <MapIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Map-Based Reporting",
      description:
        "Drop a pin on the map and report issues with photos and descriptions.",
    },
    {
      icon: <ReportIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Category & Priority Tags",
      description: "Organize reports by type and urgency for better tracking.",
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Real-time Updates",
      description: "Get notified when your reports are reviewed or resolved.",
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Admin Dashboard",
      description: "Comprehensive management tools for administrators.",
    },
  ];

  const categories = [
    { icon: <WaterIcon />, name: "Water Issues", color: "#2196f3" },
    { icon: <ElectricityIcon />, name: "Electricity", color: "#ff9800" },
    { icon: <SecurityIcon />, name: "Security", color: "#f44336" },
    { icon: <ReportIcon />, name: "Infrastructure", color: "#4caf50" },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h2" gutterBottom fontWeight="bold">
                Community Reporter
              </Typography>
              <Typography variant="h5" paragraph>
                Making communities better, one report at a time
              </Typography>
              <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                Report local issues, track their progress, and help build a
                better community. From broken streetlights to water leaks, your
                voice matters.
              </Typography>
              <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                {user ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ bgcolor: "white", color: "primary.main" }}
                      onClick={() => navigate("/reports")}
                    >
                      View My Reports
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ borderColor: "white", color: "white" }}
                      onClick={() => navigate("/reports")}
                    >
                      Create New Report
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ bgcolor: "white", color: "primary.main" }}
                      onClick={() => navigate("/register")}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ borderColor: "white", color: "white" }}
                      onClick={() => navigate("/login")}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={8}
                sx={{
                  p: 3,
                  bgcolor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Box sx={{ flex: 1, minWidth: 120 }}>
                    <Typography variant="h4" fontWeight="bold">
                      1,247
                    </Typography>
                    <Typography variant="body2">Reports Submitted</Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 120 }}>
                    <Typography variant="h4" fontWeight="bold">
                      892
                    </Typography>
                    <Typography variant="body2">Issues Resolved</Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 120 }}>
                    <Typography variant="h4" fontWeight="bold">
                      156
                    </Typography>
                    <Typography variant="body2">Active Users</Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 120 }}>
                    <Typography variant="h4" fontWeight="bold">
                      72%
                    </Typography>
                    <Typography variant="body2">Resolution Rate</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          How It Works
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          paragraph
        >
          Simple, effective community problem reporting in three easy steps
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{ mt: 4 }}
          flexWrap="wrap"
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 16px)",
                  md: "1 1 calc(25% - 24px)",
                },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Stack>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Report Categories
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            paragraph
          >
            Choose from various categories to help us route your report to the
            right team
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            sx={{ mt: 4 }}
            justifyContent="center"
            flexWrap="wrap"
          >
            {categories.map((category, index) => (
              <Box key={index}>
                <Chip
                  icon={category.icon}
                  label={category.name}
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: "auto",
                    "& .MuiChip-label": {
                      px: 2,
                      py: 1,
                      fontSize: "1rem",
                    },
                    borderColor: category.color,
                    color: category.color,
                    "&:hover": {
                      bgcolor: `${category.color}15`,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Join our community of active citizens working together to improve
            our neighborhoods.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(user ? "/reports" : "/register")}
            sx={{ mt: 2 }}
          >
            {user ? "Start Reporting" : "Join Community Reporter"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;
