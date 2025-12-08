import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthPlan } from "@/core/interfaces/plan/planes";

interface AddPlanCardProps {
  plan: HealthPlan;
  onAddPlan: (planId: string) => void;
  isMaxReached: boolean;
}

export const AddPlanCard = ({ plan, onAddPlan, isMaxReached }: AddPlanCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex justify-between items-start text-sm">
        {plan.name}
        <Badge variant="secondary" className="text-xs">{plan.linea}</Badge>
      </CardTitle>
      <CardDescription className="text-sm font-semibold text-success">
        ${plan.precio?.toLocaleString('es-AR')}
      </CardDescription>
      <CardDescription className="text-xs">{plan.empresa}</CardDescription>
    </CardHeader>
    <CardContent className="pt-2">
      <ul className="text-xs text-muted-foreground space-y-1 mb-3">
        <li>
          <Check className="w-3 h-3 inline mr-1 text-success" /> Cobertura Ambulatoria Básica
        </li>
        <li>
          <Check className="w-3 h-3 inline mr-1 text-success" /> {plan.clinicas?.length || 0} Clínicas en Cartilla
        </li>
      </ul>
      <Button 
        onClick={() => onAddPlan(plan._id)} 
        className="w-full"
        size="sm"
        disabled={isMaxReached}
      >
        <Plus className="w-4 h-4 mr-2" />
        Añadir
      </Button>
      {isMaxReached && (
        <p className="text-xs text-center text-destructive mt-2">Máximo 4 planes</p>
      )}
    </CardContent>
  </Card>
);
