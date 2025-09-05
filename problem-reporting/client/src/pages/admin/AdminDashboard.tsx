import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { api, type ApiReport } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Check,
  CircleAlert,
  Clock,
  Filter,
  Gauge,
  Inbox,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  X,
} from "lucide-react";

type Status = "open" | "in_progress" | "resolved" | "rejected";

const statusToVariant: Record<
  Status,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  open: "secondary",
  in_progress: "outline",
  resolved: "default",
  rejected: "destructive",
};

function useReports(filters: {
  q?: string;
  status?: string;
  category?: string;
  sort?: string;
}) {
  return useQuery({
    queryKey: ["admin-reports", filters],
    queryFn: () => api.fetchReports(filters as Record<string, string>),
  });
}

const AdminDashboard = () => {
  const [sidebarOpen] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>("recent");

  const { data, isLoading, error } = useReports({ q, status, category, sort });

  const totals = useMemo(() => {
    const list = data || [];
    const total = list.length;
    const open = list.filter((r) => r.status === "open").length;
    const inProgress = list.filter((r) => r.status === "in_progress").length;
    const resolved = list.filter((r) => r.status === "resolved").length;
    return { total, open, inProgress, resolved };
  }, [data]);

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <aside className="hidden w-64 border-r bg-card/30 p-4 md:block">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="text-lg font-semibold">
              Admin
            </Link>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-1">
            <Link
              className="block rounded-md px-3 py-2 hover:bg-accent"
              to="/admin"
            >
              Dashboard
            </Link>
            <Link
              className="block rounded-md px-3 py-2 hover:bg-accent"
              to="/reports"
            >
              Reports
            </Link>
            <Link
              className="block rounded-md px-3 py-2 hover:bg-accent"
              to="/users"
            >
              Users
            </Link>
            <Link
              className="block rounded-md px-3 py-2 hover:bg-accent"
              to="/settings"
            >
              Settings
            </Link>
          </nav>
        </aside>
      )}

      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-2 p-4">
            <h1 className="mr-auto text-xl font-semibold">Admin Dashboard</h1>
            <Button variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" /> New Category
            </Button>
            <Button className="gap-2">
              <Gauge className="h-4 w-4" /> System Health
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Inbox className="h-4 w-4" /> Total Reports
                </CardTitle>
                <CardDescription>All time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totals.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" /> Open
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totals.open}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <BarChart3 className="h-4 w-4" /> In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totals.inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Check className="h-4 w-4" /> Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totals.resolved}</div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </CardTitle>
                <CardDescription>Search and refine reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search title or description"
                      className="pl-9"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                  </div>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Status"
                  >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                  >
                    <option value="">All Categories</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="infrastructure">Infrastructure</option>
                  </Select>
                  <Select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Reports
                </CardTitle>
                <CardDescription>
                  Manage, triage and act on reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 p-4 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading
                    reports…
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 p-4 text-destructive">
                    <CircleAlert className="h-4 w-4" />{" "}
                    {(error as Error).message}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-0">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(data as ApiReport[] | undefined)?.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            <div className="font-medium">{r.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {r.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                statusToVariant[(r.status as Status) || "open"]
                              }
                            >
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{r.category || "-"}</TableCell>
                          <TableCell>{r._count?.votes ?? 0}</TableCell>
                          <TableCell>
                            {r.createdAt
                              ? new Date(r.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/reports/${r.id}`}
                                className="text-primary hover:underline"
                              >
                                View
                              </Link>
                              <Dialog>
                                <DialogTrigger>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                  >
                                    <Check className="h-3 w-3" /> Approve
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Approve report</DialogTitle>
                                    <DialogDescription>
                                      Confirm approval of "{r.title}".
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="secondary">Cancel</Button>
                                    <Button>Approve</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                  >
                                    <X className="h-3 w-3" /> Reject
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject report</DialogTitle>
                                    <DialogDescription>
                                      Please confirm rejection.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="secondary">Cancel</Button>
                                    <Button variant="destructive">
                                      Reject
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="More"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      Showing {data?.length ?? 0} reports
                    </TableCaption>
                  </Table>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
