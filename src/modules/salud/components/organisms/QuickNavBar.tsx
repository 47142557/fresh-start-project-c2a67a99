import { LucideIcon } from "lucide-react";
import { QuickNavButton } from "../atoms/QuickNavButton";

interface QuickNavItem {
  icon: LucideIcon;
  label: string;
  action: () => void;
}

interface QuickNavBarProps {
  items: QuickNavItem[];
}

export const QuickNavBar = ({ items }: QuickNavBarProps) => (
  <div className="bg-card border-b border-border shadow-sm">
    <div className="container mx-auto px-4">
      <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
        {items.map((item, index) => (
          <QuickNavButton
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={item.action}
          />
        ))}
      </div>
    </div>
  </div>
);

export type { QuickNavItem };
