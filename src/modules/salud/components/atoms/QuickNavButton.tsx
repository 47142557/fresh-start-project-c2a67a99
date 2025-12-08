import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickNavButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export const QuickNavButton = ({ icon: Icon, label, onClick }: QuickNavButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    className="shrink-0 gap-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
);
