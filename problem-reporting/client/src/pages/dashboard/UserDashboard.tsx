import { Link } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Files,
  List,
  MessageSquare,
  ThumbsUp,
  LineChart,
  Settings,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useReportsStore } from "../../stores/reports";

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: Home, active: true },
  { label: "Report Issue", to: "/reports/new", icon: PlusCircle },
  { label: "My Reports", to: "/reports/mine", icon: Files },
  { label: "All Reports", to: "/reports", icon: List },
  { label: "Comments", to: "/comments", icon: MessageSquare },
  { label: "Votes", to: "/votes", icon: ThumbsUp },
  { label: "Analytics", to: "/analytics", icon: LineChart },
];

const UserDashboard = () => {
  const { filters, realtimeEnabled } = useReportsStore();
  const {
    data: reports,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reports", filters],
    queryFn: () =>
      api.fetchReports({
        category: filters.category,
        status: filters.status,
        sort: filters.sort,
      }),
    refetchInterval: realtimeEnabled ? 5000 : false,
  });
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
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                  item.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
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
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-base font-semibold">Dashboard</h1>
          <div className="relative ml-auto flex-1 md:grow-0">
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm md:w-[200px] lg:w-[336px]"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <img
              src="/placeholder-user.jpg"
              width={36}
              height={36}
              alt="Avatar"
              className="h-9 w-9 rounded-full object-cover"
            />
          </Button>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Track, create, and manage problem reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Report
                </Button>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <List className="h-4 w-4" />
                  View All
                </Button>
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>
              <div className="mt-4">
                {isLoading && (
                  <div className="text-sm text-muted-foreground">
                    Loading reports...
                  </div>
                )}
                {error && (
                  <div className="text-sm text-red-500">
                    Failed to load reports
                  </div>
                )}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Open Reports</CardTitle>
                    <CardDescription className="text-2xl font-bold">
                      {reports?.filter((r) => r.status === "OPEN").length ?? 0}
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Resolved</CardTitle>
                    <CardDescription className="text-2xl font-bold">
                      {reports?.filter((r) => r.status === "RESOLVED").length ??
                        0}
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">My Votes</CardTitle>
                    <CardDescription className="text-2xl font-bold">
                      {reports?.reduce(
                        (acc, r) => acc + (r._count?.votes ?? 0),
                        0
                      ) ?? 0}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
