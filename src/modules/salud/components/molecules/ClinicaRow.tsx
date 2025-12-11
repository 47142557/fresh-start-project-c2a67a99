import { HealthPlan } from "@/core/interfaces/plan/planes";
import { Clinica } from "@/core/interfaces/plan/clinicas";
import { ClinicaCheck } from "../atoms/ClinicaCheck";
import { MapPin } from "lucide-react";

interface ClinicaRowProps {
  clinica: Clinica;
  plans: HealthPlan[];
  planIncludesClinica: (plan: HealthPlan, clinicaId: string) => boolean;
}

export const ClinicaRow = ({ clinica, plans, planIncludesClinica }: ClinicaRowProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
    {/* Columna 1: Info Clínica */}
    <div className="col-span-1 p-3 flex flex-col justify-center">
      <p className="font-bold text-sm text-slate-700 group-hover:text-teal-700 transition-colors">{clinica.entity}</p>
      {clinica.ubicacion?.[0] && (
        <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
            <MapPin size={10} />
            <span>{clinica.ubicacion[0].barrio}</span>
        </div>
      )}
    </div>

    {/* Columnas 2-4: Checks */}
    {plans.map(plan => (
      <div key={`${plan._id}-${clinica.item_id}`} className="col-span-1">
        <ClinicaCheck included={planIncludesClinica(plan, clinica.item_id)} />
      </div>
    ))}

    {/* Relleno */}
    {Array.from({ length: 3 - plans.length }).map((_, i) => (
       <div key={`empty-${i}`} className="col-span-1 border-l border-slate-50 hidden md:block" />
    ))}
  </div>
);