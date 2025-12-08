import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HealthPlan } from "@/core/interfaces/plan/planes";
import { cn } from "@/lib/utils";

interface FloatingComparisonCartProps {
  plans: HealthPlan[];
  onRemove: (planId: string) => void;
  onCompare: () => void;
  className?: string;
}

export const FloatingComparisonCart = ({
  plans,
  onRemove,
  onCompare,
  className,
}: FloatingComparisonCartProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (plans.length === 0) return null;

  const canCompare = plans.length >= 2 && plans.length <= 4;

  const handleCompare = () => {
    setOpen(false);
    onCompare();
  };

  return (
    <div className={cn("fixed top-20 right-4 z-50", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="relative h-12 w-12 rounded-full bg-primary shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
              {plans.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-80 p-0 shadow-xl border-border"
        >
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground">
              Planes para comparar
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {plans.length} de 4 planes seleccionados
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="flex items-center gap-3 p-3 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
              >
                {/* Logo */}
                <div className="shrink-0 w-10 h-10 bg-background rounded-md border border-border flex items-center justify-center overflow-hidden">
                  {plan.images && plan.images[0] ? (
                    <img
                      src={`/${plan.images[0].url}`}
                      alt={plan.empresa}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">
                      {plan.empresa?.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {plan.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {plan.empresa}
                  </p>
                </div>

                {/* Price */}
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-success">
                    ${plan.precio?.toLocaleString("es-AR")}
                  </p>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onRemove(plan._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border bg-muted/20">
            <Button
              onClick={handleCompare}
              disabled={!canCompare}
              className="w-full"
              size="sm"
            >
              {canCompare
                ? "Comparar planes"
                : `Seleccioná ${2 - plans.length} más`}
            </Button>
            {!canCompare && plans.length < 2 && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Mínimo 2 planes para comparar
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
