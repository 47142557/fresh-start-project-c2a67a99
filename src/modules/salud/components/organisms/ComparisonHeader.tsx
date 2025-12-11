import { ArrowLeft, Save, Share2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ComparisonHeaderProps {
  plansCount: number;
  isVendor: boolean;
  onSaveClick: () => void;
}

export const ComparisonHeader = ({ plansCount, isVendor, onSaveClick }: ComparisonHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
        
        {/* Izquierda: Volver */}
        <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigate('/resultados')}
        >
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-slate-100 text-slate-400 group-hover:text-slate-600 transition-colors">
                <ArrowLeft size={20} />
            </div>
            <div>
                <h1 className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Volver al listado</h1>
                <p className="text-[10px] text-slate-400 hidden sm:block">Comparando {plansCount} planes</p>
            </div>
        </div>

        {/* Derecha: Acciones */}
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-teal-600 hidden sm:flex gap-2">
                <Share2 size={16} /> Compartir
            </Button>
            
            {isVendor && (
              <Button 
                onClick={onSaveClick}
                disabled={plansCount === 0}
                className="bg-slate-900 text-white hover:bg-slate-800 gap-2 shadow-md"
                size="sm"
              >
                <Save size={16} /> <span className="hidden sm:inline">Guardar</span>
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};