import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ui/toast";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import { LandingPage } from "./components/LandingPage";
import UserDashboard from "./pages/dashboard/UserDashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ActivateAccount from "./pages/auth/ActivateAccount";
import ActivationInstructions from "./pages/auth/ActivationInstructions";

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <main className="w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/activate-instructions"
              element={<ActivationInstructions />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/activate/:id/:token" element={<ActivateAccount />} />
            <Route
              path="/reset-password/:id/:token"
              element={<ResetPassword />}
            />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/reports" element={<div>Report List</div>} />
            <Route path="/reports/new" element={<div>Create Report</div>} />
            <Route path="/reports/:id" element={<div>Report Detail</div>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
