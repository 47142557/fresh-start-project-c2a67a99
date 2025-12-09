import { Plus, Minus, Check, X, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { HealthPlan } from "@/core/interfaces/plan/planes";

interface PlanCardProps {
  plan: HealthPlan;
  viewMode: "grid" | "list";
  isInComparison: boolean;
  onToggleComparison: (planId: string) => void;
  onOpenDetails: (plan: HealthPlan) => void;
  isRecommended?: boolean;
  highlightClinic?: string;
}

// Key clinics to highlight
const KEY_CLINICS = [
  "Hospital Alemán",
  "Hospital Italiano",
  "Sanatorio Otamendi",
  "Fleni",
  "Hospital Británico",
  "Fundación Favaloro",
];

export const PlanCard = ({
  plan,
  viewMode,
  isInComparison,
  onToggleComparison,
  onOpenDetails,
  isRecommended = false,
  highlightClinic,
}: PlanCardProps) => {
  // Check if plan includes key clinics
  const includedKeyClinics = KEY_CLINICS.filter(keyClinic => 
    plan.clinicas?.some(c => c.entity?.toLowerCase().includes(keyClinic.toLowerCase()))
  );
  
  // Check if plan is missing the highlighted clinic
  const missingHighlightClinic = highlightClinic && 
    !plan.clinicas?.some(c => c.entity?.toLowerCase().includes(highlightClinic.toLowerCase()));

  // Determine card status
  const isBestValue = isRecommended || plan.rating >= 4.5;
  const hasWarning = missingHighlightClinic;

  return (
    <Card 
      className={`card-commercial ${viewMode === "list" ? "flex flex-col md:flex-row" : ""} 
        ${isBestValue ? "card-best-value" : ""} 
        ${hasWarning ? "card-warning" : ""}
        overflow-hidden border-border/50`}
    >
      {/* Status Banner */}
      {(isBestValue || hasWarning) && (
        <div className={`absolute top-0 left-0 right-0 py-1.5 px-3 text-xs font-bold text-center z-10
          ${isBestValue && !hasWarning ? "banner-best" : ""}
          ${hasWarning ? "banner-warning" : ""}`}
        >
          {hasWarning ? (
            <>❌ NO INCLUYE {highlightClinic?.toUpperCase()}</>
          ) : (
            <>✅ MEJOR VALOR</>
          )}
        </div>
      )}

      {/* Logo Container */}
      {plan.images && plan.images[0] && (
        <div className={`${viewMode === "list" ? "md:w-28 md:min-w-28" : "w-full h-24"} 
          ${isBestValue || hasWarning ? "mt-8" : ""}
          bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center border-b border-border/30 p-4`}
        >
          <img
            src={`/${plan.images[0].url}`}
            alt={plan.empresa}
            className="max-h-6 max-w-full object-contain"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <CardHeader className="pb-1 pt-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-bold truncate text-foreground">{plan.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{plan.empresa}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button 
                variant={isInComparison ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleComparison(plan._id)}
                className={`flex items-center gap-1 h-7 px-2 ${isInComparison ? "bg-primary" : ""}`}
                title={isInComparison ? "Remover de comparación" : "Agregar a comparación"}
              >
                {isInComparison ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                <span className="text-xs">{isInComparison ? "Quitar" : "Comparar"}</span>
              </Button>
              <Badge className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-cta-highlight text-cta-highlight-foreground font-bold">
                <span>⭐</span>
                <span>{plan.rating}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 py-2 space-y-2">
          {/* Plan Line Badge */}
          <Badge variant="secondary" className="text-[10px] font-medium px-1.5 py-0">
            {plan.linea}
          </Badge>

          {/* Key Clinics Section */}
          {includedKeyClinics.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-foreground flex items-center gap-1">
                🏥 CLÍNICAS CLAVE
              </p>
              <div className="flex flex-wrap gap-0.5">
                {KEY_CLINICS.slice(0, 4).map((clinic) => {
                  const included = includedKeyClinics.includes(clinic);
                  return (
                    <span 
                      key={clinic}
                      className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0 rounded-full
                        ${included 
                          ? "bg-success/10 text-success" 
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {included ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                      {clinic.split(" ")[1] || clinic}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Key Benefits */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-foreground flex items-center gap-1">
              💲 CONDICIONES
            </p>
            <ul className="space-y-0.5">
              {plan.attributes?.slice(0, 3).map((attr, idx) => (
                <li key={`${plan._id}-attr-${idx}`} className="text-[10px] flex items-start gap-1.5">
                  <Check className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                  <span className="flex-1">
                    <span className="font-semibold text-foreground">{attr.name}:</span>{" "}
                    <span className="text-muted-foreground">{attr.value_name}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/30 bg-muted/20">
          {/* Price Section */}
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="text-2xl font-extrabold text-primary">
                ${plan.precio?.toLocaleString('es-AR')}
              </div>
              <div className="text-[10px] text-muted-foreground">por mes</div>
            </div>
            <Button 
              variant="outline"
              size="icon"
              className="shrink-0 h-8 w-8 border-cta-highlight text-cta-highlight-foreground bg-cta-highlight hover:bg-cta-highlight/90"
              title="Consultar por WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 h-8 text-sm font-bold bg-gradient-accent hover:opacity-90 text-accent-foreground shadow-accent"
              onClick={() => onOpenDetails(plan)}
            >
              ✅ Contratar
            </Button>
            <button 
              onClick={() => onOpenDetails(plan)}
              className="text-[10px] text-primary hover:underline font-medium whitespace-nowrap"
            >
              Ver Prestadores →
            </button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};
