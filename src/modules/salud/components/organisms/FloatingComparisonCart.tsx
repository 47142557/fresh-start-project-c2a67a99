import { useState } from "react";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HealthPlan } from "@/core/interfaces/plan/planes";

interface FloatingComparisonCartProps {
  plans: HealthPlan[];
  onRemove: (planId: string) => void;
  onCompare: () => void;
}

export const FloatingComparisonCart = ({ plans, onRemove, onCompare }: FloatingComparisonCartProps) => {
  const [open, setOpen] = useState(false);

  if (plans.length === 0) return null;

  const canCompare = plans.length >= 2;

  return (
    <div className="fixed top-24 right-4 z-40 animate-in slide-in-from-right-10 fade-in duration-300">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="relative h-14 w-14 rounded-full bg-slate-900 shadow-xl hover:bg-slate-800 hover:scale-105 transition-all border-2 border-white"
          >
            <ShoppingCart className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
              {plans.length}
            </span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent align="end" className="w-80 p-0 shadow-2xl border-0 rounded-2xl overflow-hidden bg-white">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Comparador</h3>
            <p className="text-xs text-slate-500">{plans.length} de 4 planes seleccionados</p>
          </div>

          {/* Lista */}
          <div className="max-h-64 overflow-y-auto">
            {plans.map((plan) => (
              <div key={plan._id} className="flex items-center gap-3 p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                {/* Logo */}
                <div className="shrink-0 w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1">
                  {plan.images && plan.images[0] ? (
                    <img src={`/${plan.images[0].url}`} alt={plan.empresa} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">{plan.empresa.substring(0,2)}</span>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{plan.name}</p>
                  <p className="text-xs text-slate-400 truncate">{plan.empresa}</p>
                </div>
                {/* Delete */}
                <button 
                    onClick={() => onRemove(plan._id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-white border-t border-slate-100">
            <Button
              onClick={() => { setOpen(false); onCompare(); }}
              disabled={!canCompare}
              className={`w-full font-bold rounded-xl h-11 ${canCompare ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-100' : 'bg-slate-100 text-slate-400'}`}
            >
              {canCompare ? (
                  <>Comparar Ahora <ArrowRight size={16} className="ml-2" /></>
              ) : (
                  `Agrega ${2 - plans.length} más`
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};