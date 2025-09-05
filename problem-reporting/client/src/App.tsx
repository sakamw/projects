import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { LandingPage } from "./components/LandingPage";
import UserDashboard from "./pages/dashboard/UserDashboard";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/register" element={<div>Register</div>} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/reports" element={<div>Report List</div>} />
          <Route path="/reports/new" element={<div>Create Report</div>} />
          <Route path="/reports/:id" element={<div>Report Detail</div>} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
