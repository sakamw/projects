import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  User,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  Edit
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  joinDate: Date;
  role: "user" | "admin" | "moderator";
  stats: {
    reportsCreated: number;
    reportsResolved: number;
    helpfulVotes: number;
    reputation: number;
  };
  badges?: Array<{
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
  }>;
  level?: {
    current: number;
    max: number;
    progress: number;
  };
}

interface ProfileSummaryProps {
  profile: UserProfile;
  onEdit?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

export function ProfileSummary({
  profile,
  onEdit,
  onSettings,
  onLogout,
  className,
  showActions = true,
  compact = false,
}: ProfileSummaryProps) {
  const getRoleBadgeVariant = (role: UserProfile["role"]) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      default:
        return "secondary";
    }
  };

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            {profile.level && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {profile.level.current}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <CardTitle className="text-lg">{profile.name}</CardTitle>
              <Badge variant={getRoleBadgeVariant(profile.role)}>
                {profile.role}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {profile.email}
            </p>
            {profile.location && (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {profile.location}
              </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Joined {formatJoinDate(profile.joinDate)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!compact && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile.stats.reportsCreated}
                </div>
                <div className="text-xs text-muted-foreground">Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {profile.stats.reportsResolved}
                </div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {profile.stats.helpfulVotes}
                </div>
                <div className="text-xs text-muted-foreground">Helpful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {profile.stats.reputation}
                </div>
                <div className="text-xs text-muted-foreground">Reputation</div>
              </div>
            </div>

            {/* Level Progress */}
            {profile.level && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level {profile.level.current}</span>
                  <span>{profile.level.progress}%</span>
                </div>
                <Progress value={profile.level.progress} className="h-2" />
              </div>
            )}

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.slice(0, 4).map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded-full"
                    >
                      <badge.icon className={cn("h-3 w-3", badge.color)} />
                      <span>{badge.name}</span>
                    </div>
                  ))}
                  {profile.badges.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.badges.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-2 border-t">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onSettings && (
              <Button variant="outline" size="sm" onClick={onSettings}>
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            )}
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
