import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AttributeGroupRowProps {
  groupName: string;
  attributeCount: number;
  isCollapsed: boolean;
  colSpan: number;
  onToggle: () => void;
}

export const AttributeGroupRow = ({ 
  groupName, 
  attributeCount, 
  isCollapsed, 
  colSpan, 
  onToggle 
}: AttributeGroupRowProps) => (
  <tr 
    className="bg-primary/10 border-t border-t-primary/30 cursor-pointer hover:bg-primary/15 transition-colors group-row"
    onClick={onToggle}
  >
    <td colSpan={colSpan} className="px-3 py-2 font-semibold text-sm text-primary">
      <div className="flex items-center gap-2">
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span className="uppercase tracking-wide">{groupName}</span>
        <Badge variant="secondary" className="text-xs ml-2">
          {attributeCount}
        </Badge>
      </div>
    </td>
  </tr>
);
