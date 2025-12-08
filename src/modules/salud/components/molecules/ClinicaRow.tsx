import { HealthPlan } from "@/core/interfaces/plan/planes";
import { Clinica } from "@/core/interfaces/plan/clinicas";
import { ClinicaCheck } from "../atoms/ClinicaCheck";

interface ClinicaRowProps {
  clinica: Clinica;
  plans: HealthPlan[];
  index: number;
  planIncludesClinica: (plan: HealthPlan, clinicaId: string) => boolean;
}

export const ClinicaRow = ({ clinica, plans, index, planIncludesClinica }: ClinicaRowProps) => (
  <tr className={index % 2 === 0 ? "bg-background border-b border-border" : "bg-muted/20 border-b border-border"}>
    <th scope="row" className="px-3 py-1.5 sticky-col text-left">
      <div>
        <p className="font-medium text-xs">{clinica.entity}</p>
        {clinica.ubicacion?.[0] && (
          <p className="text-xs text-muted-foreground">
            {clinica.ubicacion[0].barrio} - {clinica.ubicacion[0].region}
          </p>
        )}
      </div>
    </th>
    {plans.map(plan => (
      <ClinicaCheck 
        key={`${plan._id}-${clinica.item_id}`} 
        included={planIncludesClinica(plan, clinica.item_id)} 
      />
    ))}
  </tr>
);
