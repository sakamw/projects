import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PlusCircle, List, Search, Download, RefreshCw } from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
}

interface RightPanelProps {
  reports: ReportItem[] | undefined;
  onNewReport: () => void;
  onViewMyReports: () => void;
  profile: {
    firstName?: string;
    lastName?: string;
    stats?: { reportsCreated?: number };
  } | null;
  profileLoading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  isSearching: boolean;
  handleSearch: (q: string) => void;
  searchResults: ReportItem[];
  navigateToReport: (id: string) => void;
}

export function RightPanel({
  reports,
  onNewReport,
  onViewMyReports,
  profile,
  profileLoading,
  searchQuery,
  setSearchQuery,
  isSearching,
  handleSearch,
  searchResults,
  navigateToReport,
}: RightPanelProps) {
  const quickActions = [
    {
      id: "new-report",
      label: "New Report",
      description: "Submit a problem",
      icon: PlusCircle,
      onClick: onNewReport,
    },
    {
      id: "view-reports",
      label: "My Reports",
      description: "View submitted reports",
      icon: List,
      onClick: onViewMyReports,
    },
    {
      id: "search",
      label: "Search",
      description: "Find existing reports",
      icon: Search,
      onClick: () => {},
    },
    {
      id: "export",
      label: "Export Data",
      description: "Download reports",
      icon: Download,
      onClick: () => {
        const dataStr = JSON.stringify(reports || [], null, 2);
        const dataUri =
          "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        const exportFileDefaultName = `reports-${
          new Date().toISOString().split("T")[0]
        }.json`;
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              if (action.id === "search") {
                return (
                  <Dialog key={action.id}>
                    <DialogTrigger>
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                      >
                        <Icon className="h-6 w-6" />
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {action.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Search Reports</DialogTitle>
                        <DialogDescription>
                          Find reports by title, description, or category
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              handleSearch(e.target.value);
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleSearch(searchQuery)}
                            disabled={isSearching}
                          >
                            {isSearching ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {searchResults.length > 0 ? (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">
                                Found {searchResults.length} result(s)
                              </h4>
                              {searchResults.map((report) => (
                                <div
                                  key={report.id}
                                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                                  onClick={() => navigateToReport(report.id)}
                                >
                                  <div className="font-medium text-sm">
                                    {report.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {report.description.substring(0, 100)}...
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {report.category}
                                    </Badge>
                                    <Badge
                                      variant={
                                        report.status === "RESOLVED"
                                          ? "secondary"
                                          : report.status === "IN_PROGRESS"
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {report.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : searchQuery && !isSearching ? (
                            <div className="text-center text-muted-foreground py-8">
                              No reports found matching "{searchQuery}"
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              }
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                  onClick={action.onClick}
                >
                  <Icon className="h-6 w-6" />
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {profileLoading ? (
        <div className="text-center text-muted-foreground py-4">
          Loading profile...
        </div>
      ) : profile ? (
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="text-sm font-medium mb-2">Welcome back!</div>
          <div className="text-sm text-muted-foreground">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {profile.stats?.reportsCreated || 0} reports created
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="text-sm font-medium mb-2">Profile</div>
          <div className="text-sm text-muted-foreground">
            Sign in to view your profile
          </div>
        </div>
      )}
    </div>
  );
}
