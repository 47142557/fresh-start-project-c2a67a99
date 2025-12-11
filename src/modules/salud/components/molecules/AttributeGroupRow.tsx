import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AttributeGroupRowProps {
  groupName: string;
  attributeCount: number;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const AttributeGroupRow = ({ 
  groupName, 
  attributeCount, 
  isCollapsed, 
  onToggle 
}: AttributeGroupRowProps) => (
  <div 
    className="col-span-full flex items-center gap-2 px-4 py-3 bg-slate-50 border-y border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
    onClick={onToggle}
  >
    {isCollapsed ? (
      <ChevronRight className="w-4 h-4 text-slate-400" />
    ) : (
      <ChevronDown className="w-4 h-4 text-teal-600" />
    )}
    <span className="font-bold text-sm text-slate-700 uppercase tracking-wide">{groupName}</span>
    <Badge variant="secondary" className="text-[10px] bg-white border-slate-200 text-slate-500 ml-2">
      {attributeCount}
    </Badge>
  </div>
);