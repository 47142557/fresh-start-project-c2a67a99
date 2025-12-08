import { LucideIcon } from "lucide-react";
import { FeatureIcon } from "../atoms/FeatureIcon";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="space-y-3 text-center">
    <FeatureIcon icon={icon} />
    <h3 className="font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);
