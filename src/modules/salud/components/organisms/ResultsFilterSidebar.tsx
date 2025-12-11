import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Star, X, Filter } from "lucide-react";

interface ResultsFilterSidebarProps {
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
  providers: string[];
  selectedProviders: string[];
  onToggleProvider: (provider: string) => void;
  minRating: number[];
  onMinRatingChange: (value: number[]) => void;
  onClearFilters: () => void;
  // 🔥 LÍMITES DINÁMICOS
  minLimit: number;
  maxLimit: number;
}

export const ResultsFilterSidebar = ({
  priceRange,
  onPriceRangeChange,
  providers,
  selectedProviders,
  onToggleProvider,
  minRating,
  onMinRatingChange,
  onClearFilters,
  minLimit,
  maxLimit
}: ResultsFilterSidebarProps) => {

  // Helper para formatear moneda (Pesos Argentinos)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-8">
      
      {/* --- HEADER FILTROS --- */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800">
            <Filter size={20} className="text-teal-600" />
            <h2 className="text-lg font-bold">Filtros</h2>
        </div>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 px-2"
        >
            <X size={14} className="mr-1" /> Limpiar
        </Button>
      </div>
    
      {/* --- RANGO DE PRECIO --- */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <Label className="text-sm font-bold text-slate-700">Presupuesto Mensual</Label>
        </div>
        
        <Slider
          min={minLimit}
          max={maxLimit}
          step={1000} // Paso de $1.000 para mayor precisión
          minStepsBetweenThumbs={1}
          value={priceRange}
          onValueChange={onPriceRangeChange}
          className="py-4 cursor-pointer"
        />

        <div className="flex justify-between items-center mt-2">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 tabular-nums">
            {formatCurrency(priceRange[0])}
          </div>
          <span className="text-slate-300">-</span>
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 tabular-nums">
            {formatCurrency(priceRange[1])}
          </div>
        </div>
      </div>

      {/* --- PROVEEDORES (PREPAGAS) --- */}
      <div>
        <Label className="text-sm font-bold text-slate-700 mb-4 block">Prepagas</Label>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {providers.map((provider) => (
            <div key={provider} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox 
                id={provider} 
                checked={selectedProviders.includes(provider)} 
                onCheckedChange={() => onToggleProvider(provider)}
                className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
              />
              <label 
                htmlFor={provider} 
                className="text-sm text-slate-600 group-hover:text-teal-700 font-medium cursor-pointer transition-colors leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {provider}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* --- RATING MÍNIMO --- */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <Label className="text-sm font-bold text-slate-700">Calificación Mínima</Label>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                {minRating[0]} <Star size={10} fill="currentColor" />
            </div>
        </div>
        
        <Slider
            min={1}
            max={5}
            step={1}
            value={minRating}
            onValueChange={onMinRatingChange}
            className="py-2 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium px-1">
            <span>1★</span>
            <span>5★</span>
        </div>
      </div>

    </div>
  );
};