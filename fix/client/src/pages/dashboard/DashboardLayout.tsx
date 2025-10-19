import { Link, Outlet, useNavigate } from "react-router-dom";
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                title={item.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            to="/settings"
            title="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}







