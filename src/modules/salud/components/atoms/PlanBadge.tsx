import { Badge } from "@/components/ui/badge";

interface PlanBadgeProps {
  value: string;
  className?: string;
}

export const PlanBadge = ({ value, className = "" }: PlanBadgeProps) => (
  <Badge 
    variant={value === 'N/A' || value === 'No' ? 'secondary' : 'default'}
    className={`text-xs font-normal ${className}`}
  >
    {value}
  </Badge>
);
