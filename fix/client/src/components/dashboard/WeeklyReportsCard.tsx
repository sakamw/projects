import { ChartCard } from "../ChartCard";

interface WeeklyReportsCardProps {
  description: string;
  chartData: Array<{ label: string; value: number; color?: string }>;
  onViewDetails: () => void;
  onExport: () => void;
}

export function WeeklyReportsCard({
  description,
  chartData,
  onViewDetails,
  onExport,
}: WeeklyReportsCardProps) {
  return (
    <ChartCard
      title="Weekly Reports"
      description={description}
      type="bar"
      data={chartData}
      period="This week"
      actions={[
        { label: "View Details", onClick: onViewDetails },
        { label: "Export", onClick: onExport },
      ]}
    />
  );
}
