import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ui/toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import Index from "./pages/Index";
import UserDashboard from "./pages/dashboard/UserDashboard";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ActivateAccount from "./pages/auth/ActivateAccount";
import ActivationInstructions from "./pages/auth/ActivationInstructions";
import CreateReport from "./pages/reports/CreateReport";
import ReportsList from "./pages/reports/ReportsList";
import ReportDetail from "./pages/reports/ReportDetail";
import CommentsPage from "./pages/comments/CommentsPage";
import VotesPage from "./pages/votes/VotesPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import SettingsPage from "./pages/settings/SettingsPage";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground">
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/activate-instructions"
                element={<ActivationInstructions />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/activate/:id/:token"
                element={<ActivateAccount />}
              />
              <Route
                path="/reset-password/:id/:token"
                element={<ResetPassword />}
              />
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route
                  path="/reports"
                  element={<ReportsList showAllReports={true} />}
                />
                <Route
                  path="/reports/mine"
                  element={<ReportsList showAllReports={false} />}
                />
                <Route path="/reports/new" element={<CreateReport />} />
                <Route path="/reports/:id" element={<ReportDetail />} />
                <Route path="/comments" element={<CommentsPage />} />
                <Route path="/votes" element={<VotesPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
