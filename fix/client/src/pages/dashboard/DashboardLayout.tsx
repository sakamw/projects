import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Files,
  List,
  MessageSquare,
  ThumbsUp,
  LineChart,
  Settings,
  LogOut,
} from "lucide-react";
import { api } from "../../lib/api";
import { cn } from "../../utils/cn";

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Report Issue", to: "/reports/new", icon: PlusCircle },
  { label: "My Reports", to: "/reports/mine", icon: Files },
  { label: "All Reports", to: "/reports", icon: List },
  { label: "Comments", to: "/comments", icon: MessageSquare },
  { label: "Votes", to: "/votes", icon: ThumbsUp },
  { label: "Analytics", to: "/analytics", icon: LineChart },
];

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logoutApi();
      // Clear any local storage or state if needed
      localStorage.removeItem("token");
      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect to login even if logout API fails
      navigate("/");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      {/* Futuristic background layers */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="aurora absolute inset-0 opacity-40" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r border-white/10 bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/20 sm:flex">
        <nav className="flex flex-col items-center gap-4 px-3 sm:py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  cn(
                    "group relative inline-flex h-10 w-10 items-center justify-center rounded-xl md:h-9 md:w-9 ring-1 ring-inset transition-colors",
                    isActive
                      ? "text-primary bg-primary/10 ring-primary/40 shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_0_24px_hsl(var(--primary)/0.25)]"
                      : "text-muted-foreground hover:text-primary bg-white/5 hover:bg-primary/10 ring-white/10"
                  )
                }
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_24px_theme(colors.primary/0.15)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-3 sm:py-5">
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) =>
              cn(
                "group relative inline-flex h-10 w-10 items-center justify-center rounded-xl md:h-9 md:w-9 ring-1 ring-inset transition-colors",
                isActive
                  ? "text-primary bg-primary/10 ring-primary/40 shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_0_24px_hsl(var(--primary)/0.25)]"
                  : "text-muted-foreground hover:text-primary bg-white/5 hover:bg-primary/10 ring-white/10"
              )
            }
          >
            <Settings className="h-5 w-5" />
          </NavLink>
          <button
            onClick={handleLogout}
            title="Logout"
            className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-primary md:h-9 md:w-9 ring-1 ring-inset ring-white/10 bg-white/5 hover:bg-primary/10"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-6 sm:pl-16">
        <div className="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}











