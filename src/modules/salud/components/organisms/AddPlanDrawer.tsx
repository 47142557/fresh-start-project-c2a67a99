import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search, Plus, ShieldCheck } from "lucide-react";
import { HealthPlan } from "@/core/interfaces/plan/planes";

interface AddPlanDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plansToAdd: HealthPlan[];
  onAddPlan: (planId: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const AddPlanDrawer = ({
  open,
  onOpenChange,
  plansToAdd,
  onAddPlan,
  searchTerm,
  onSearchChange
}: AddPlanDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-slate-50 p-0 flex flex-col">
        
        {/* Header */}
        <SheetHeader className="px-6 py-4 bg-white border-b border-slate-100">
          <SheetTitle className="text-xl font-bold text-slate-800">Añadir Plan</SheetTitle>
          <SheetDescription>Selecciona un plan para comparar.</SheetDescription>
        </SheetHeader>

        {/* Buscador */}
        <div className="p-4 bg-white border-b border-slate-100">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                    placeholder="Buscar por nombre o empresa..." 
                    className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {plansToAdd.length > 0 ? (
                plansToAdd.map(plan => (
                    <div 
                        key={plan._id} 
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => {
                            onAddPlan(plan._id);
                            // Opcional: cerrar al agregar
                            // onOpenChange(false); 
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                                {plan.images && plan.images[0] ? (
                                    <img src={`/${plan.images[0].url}`} alt={plan.empresa} className="h-full w-full object-contain mix-blend-multiply" />
                                ) : (
                                    <ShieldCheck className="text-slate-300" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{plan.name}</h4>
                                <p className="text-xs text-slate-500">{plan.empresa}</p>
                            </div>
                        </div>
                        <button className="h-8 w-8 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center group-hover:bg-teal-600 group-hover:border-teal-600 group-hover:text-white transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-slate-400">
                    <p>No se encontraron planes.</p>
                </div>
            )}
        </div>

      </SheetContent>
    </Sheet>
  );
};