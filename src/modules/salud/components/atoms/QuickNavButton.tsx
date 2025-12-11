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
    className="shrink-0 gap-2 rounded-full border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all shadow-sm h-9 px-4"
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
);