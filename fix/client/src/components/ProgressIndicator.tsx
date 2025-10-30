import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { CheckCircle, Clock, AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  current?: boolean;
  blocked?: boolean;
  estimatedTime?: string;
}

interface ProgressIndicatorProps {
  title: string;
  description?: string;
  type: "steps" | "circular" | "linear" | "goals";
  steps?: ProgressStep[];
  progress?: {
    current: number;
    target: number;
    unit?: string;
    color?: "primary" | "success" | "warning" | "danger";
  };
  goals?: Array<{
    id: string;
    title: string;
    current: number;
    target: number;
    unit: string;
    icon?: LucideIcon;
    color?: string;
  }>;
  className?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressIndicator({
  title,
  description,
  type,
  steps,
  progress,
  goals,
  className,
  showPercentage = true,
  size = "md",
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const getProgressColor = (color?: string) => {
    switch (color) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  const renderStepsProgress = () => {
    if (!steps) return null;

    const completedSteps = steps.filter((step) => step.completed).length;
    const progressPercentage = (completedSteps / steps.length) * 100;

    return (
      <div className="space-y-4">
        {showPercentage && (
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        )}
        <Progress value={progressPercentage} className={sizeClasses[size]} />

        <div className="space-y-3 relative">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-start space-x-3 relative">
              <div className="flex-shrink-0 mt-0.5 relative z-10">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : step.current ? (
                  <Clock className="h-5 w-5 text-primary" />
                ) : step.blocked ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground bg-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.completed && "text-muted-foreground line-through",
                      step.current && "text-primary",
                      step.blocked && "text-red-600"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.estimatedTime && (
                    <Badge variant="outline" className="text-xs">
                      {step.estimatedTime}
                    </Badge>
                  )}
                </div>
                {step.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCircularProgress = () => {
    if (!progress) return null;

    const percentage = (progress.current / progress.target) * 100;
    const strokeWidth = size === "sm" ? 4 : size === "md" ? 6 : 8;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg className="h-20 w-20 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={getProgressColor(progress.color)}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(percentage)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {progress.current}/{progress.target} {progress.unit}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    );
  };

  const renderGoalsProgress = () => {
    if (!goals) return null;

    return (
      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          const Icon = goal.icon;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">{goal.title}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target} {goal.unit}
                </div>
              </div>
              <Progress
                value={percentage}
                className={cn(sizeClasses[size], getProgressColor())}
              />
              {percentage >= 100 && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Goal completed!
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case "steps":
        return renderStepsProgress();
      case "circular":
        return renderCircularProgress();
      case "goals":
        return renderGoalsProgress();
      case "linear":
      default: {
        if (!progress) return null;
        const percentage = (progress.current / progress.target) * 100;

        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{title}</span>
              <span className="font-medium">
                {progress.current}/{progress.target} {progress.unit}
              </span>
            </div>
            <Progress value={percentage} className={sizeClasses[size]} />
            {showPercentage && (
              <div className="text-xs text-muted-foreground text-center">
                {Math.round(percentage)}% complete
              </div>
            )}
          </div>
        );
      }
    }
  };

  return (
    <Card className={cn("border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
