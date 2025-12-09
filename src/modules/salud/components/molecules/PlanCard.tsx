import { Plus, Minus, Check, X } from "lucide-react";
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

// Map empresa names to logo file names
const EMPRESA_LOGOS: Record<string, string> = {
  "Swiss Medical": "swissmedical.webp",
  "Swiss-Medical": "swissmedical.webp",
  "Galeno": "galeno.webp",
  "OSDE": "osde.png",
  "Omint": "omint.webp",
  "Medife": "medife.webp",
  "Sancor Salud": "sancorsalud.webp",
  "Avalian": "avalian.webp",
  "Prevención Salud": "prevencion.webp",
  "Prevencion": "prevencion.webp",
  "Hominis": "hominis.png",
  "Salud Central": "saludcentral.webp",
  "Doctored": "doctored.webp",
  "Premedic": "premedic.webp"
};

// Key clinics to highlight
const KEY_CLINICS = ["Hospital Italiano", "Clínica Favaloro", "Sanatorio Güemes", "Maternidad Suizo"];
export const PlanCard = ({
  plan,
  viewMode,
  isInComparison,
  onToggleComparison,
  onOpenDetails,
  isRecommended = false,
  highlightClinic
}: PlanCardProps) => {
  // Check if plan includes key clinics
  const includedKeyClinics = KEY_CLINICS.filter(keyClinic => plan.clinicas?.some(c => c.entity?.toLowerCase().includes(keyClinic.toLowerCase())));

  // Check if plan is missing the highlighted clinic
  const missingHighlightClinic = highlightClinic && !plan.clinicas?.some(c => c.entity?.toLowerCase().includes(highlightClinic.toLowerCase()));

  // Determine card status
  const isBestValue = isRecommended || plan.rating >= 4.5;
  const hasAllTopClinics = includedKeyClinics.length >= 3;
  const hasWarning = missingHighlightClinic;

  // Get banner type
  const getBannerConfig = () => {
    if (hasWarning) {
      return {
        text: `NO INCLUYE ${highlightClinic?.toUpperCase()} (Ver detalles)`,
        icon: "❌",
        className: "banner-warning"
      };
    }
    if (isBestValue && highlightClinic) {
      return {
        text: `MEJOR VALOR (INCLUYE ${highlightClinic?.toUpperCase()})`,
        icon: "✅",
        className: "banner-best"
      };
    }
    if (hasAllTopClinics) {
      return {
        text: "INCLUYE TODAS LAS CLÍNICAS TOP",
        icon: "🏥",
        className: "banner-info"
      };
    }
    if (isBestValue) {
      return {
        text: "MEJOR VALOR",
        icon: "✅",
        className: "banner-best"
      };
    }
    return null;
  };
  const banner = getBannerConfig();
  return <Card className={`card-commercial bg-card ${viewMode === "list" ? "flex flex-col md:flex-row" : ""} 
        ${isBestValue && !hasWarning ? "card-best-value" : ""} 
        ${hasWarning ? "card-warning" : ""}
        overflow-hidden border-border/50`}>
      {/* Status Banner */}
      {banner && <div className={`py-1.5 px-3 text-xs font-bold text-center ${banner.className}`}>
          {banner.icon} {banner.text}
        </div>}

      <div className="flex-1 flex flex-col">
        {/* Header with Plan Name and Rating */}
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="flex justify-center">
                  {EMPRESA_LOGOS[plan.empresa] ? <img src={`/assets/images/card-header/${EMPRESA_LOGOS[plan.empresa]}`} alt={plan.empresa} className="h-10 w-auto object-contain" /> : <span className="text-sm font-semibold text-foreground">{plan.empresa}</span>}
                  
                </div>
                {(plan as any).nombre && <span className="text-sm font-medium text-muted-foreground">
                    {(plan as any).nombre}
                  </span>}
                
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cartilla: {plan.linea}
              </p>
            </div>
            
          </div>
        </CardHeader>

        <CardContent className="flex-1 py-2 space-y-3">
          {/* Clinical Coverage Section */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">🏥 COBERTURA CLÍNICA</p>
            
          </div>

          {/* Conditions Section */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              📋 CONDICIONES
            </p>
            <ul className="space-y-1">
              {plan.attributes?.slice(0, 2).map((attr, idx) => <li key={`${plan._id}-attr-${idx}`} className="text-xs flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>
                    <span className="font-medium text-foreground">{attr.name}:</span>{" "}
                    <span className="text-muted-foreground">{attr.value_name}</span>
                  </span>
                </li>)}
              <li className="text-xs flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>
                  <span className="font-medium text-primary">Precio:</span>{" "}
                  <span className="font-bold text-primary">${plan.precio?.toLocaleString('es-AR')}/mes</span>
                </span>
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-3 pb-3 border-t border-border/30">
          {/* CTA Button */}
          <Button className="w-full h-10 text-sm font-bold bg-success hover:bg-success/90 text-success-foreground" onClick={() => onOpenDetails(plan)}>
            ✅ Contratar {plan.name}
          </Button>
          
          {/* View providers link */}
          <button onClick={() => onOpenDetails(plan)} className="text-xs text-primary hover:underline font-medium">
            Ver todos los Prestadores
          </button>
        </CardFooter>
      </div>
    </Card>;
};