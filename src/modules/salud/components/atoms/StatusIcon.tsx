import { LucideIcon } from "lucide-react";

interface StatusIconProps {
  icon: LucideIcon;
  variant?: "default" | "primary" | "destructive";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const variantClasses = {
  default: "text-muted-foreground",
  primary: "text-primary",
  destructive: "text-destructive",
};

export const StatusIcon = ({ icon: Icon, variant = "default", size = "md" }: StatusIconProps) => (
  <Icon className={`${sizeClasses[size]} ${variantClasses[variant]} mx-auto mb-4`} />
);
