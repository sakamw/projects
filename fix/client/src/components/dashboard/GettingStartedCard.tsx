import { ProgressIndicator } from "../ProgressIndicator";

interface GettingStartedCardProps {
  steps: Array<{
    id: string;
    label: string;
    description?: string;
    completed?: boolean;
    current?: boolean;
  }>;
}

export function GettingStartedCard({ steps }: GettingStartedCardProps) {
  return (
    <ProgressIndicator
      title="Getting Started"
      description="Complete these steps to maximize your experience"
      type="steps"
      steps={steps}
      size="md"
    />
  );
}
