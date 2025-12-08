import { LucideIcon } from "lucide-react";

interface FeatureIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const FeatureIcon = ({ icon: Icon, size = "md" }: FeatureIconProps) => (
  <div className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center mx-auto`}>
    <Icon className={`${iconSizeClasses[size]} text-primary`} />
  </div>
);
