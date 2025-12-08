import React from "react";
import { Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthPlan } from "@/core/interfaces/plan/planes";

interface PlanHeaderProps {
  plan: HealthPlan;
  onRemovePlan: (planId: string) => void;
  compact?: boolean;
}

export const PlanHeader = React.memo(({ plan, onRemovePlan, compact = false }: PlanHeaderProps) => (
  <div className={`relative flex flex-col items-center justify-center ${compact ? 'p-2' : 'p-3'} h-full border-b border-border bg-muted/30`}>
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => onRemovePlan(plan._id)}
      className="absolute top-1 right-1 h-5 w-5 text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="w-3 h-3" />
    </Button>
    <div className="flex items-center gap-1.5 mb-0.5">
      <div className={`${compact ? 'text-sm' : 'text-base'} font-bold text-primary truncate max-w-full`}>
        {plan.name}
      </div>
      <div className="flex items-center text-yellow-500 text-xs shrink-0">
        <Star className="w-3 h-3 fill-yellow-500" />
        <span className="ml-0.5">{plan.rating}</span>
      </div>
    </div>
    <div className="text-xs text-muted-foreground">{plan.empresa}</div>
    <div className={`${compact ? 'text-sm' : 'text-base'} font-bold text-success mt-0.5`}>
      ${plan.precio?.toLocaleString('es-AR')}
    </div>
  </div>
));

PlanHeader.displayName = "PlanHeader";
