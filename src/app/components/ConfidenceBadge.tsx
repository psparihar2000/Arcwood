import { Badge } from "./ui/badge";

interface ConfidenceBadgeProps {
  level: "high" | "medium" | "low";
  score: number;
  showScore?: boolean;
}

export function ConfidenceBadge({ level, score, showScore = true }: ConfidenceBadgeProps) {
  const config = {
    high: {
      className: "bg-green-100 text-green-700 border-green-300",
      label: "High",
      icon: "●",
    },
    medium: {
      className: "bg-amber-100 text-amber-700 border-amber-300",
      label: "Medium",
      icon: "●",
    },
    low: {
      className: "bg-red-100 text-red-700 border-red-300",
      label: "Low",
      icon: "●",
    },
  };

  const { className, label, icon } = config[level];

  return (
    <Badge variant="outline" className={`${className} gap-1.5`}>
      <span>{icon}</span>
      <span>{label}</span>
      {showScore && <span className="font-semibold">({score}%)</span>}
    </Badge>
  );
}
