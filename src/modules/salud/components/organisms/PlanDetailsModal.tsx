import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  X, 
  CheckCircle2, // Icono redondo relleno
  ShieldCheck, 
  Building2, 
  Banknote, 
  Globe, 
  Star, 
  FileText, 
  AlertCircle,
  Info
} from "lucide-react";
import type { HealthPlan } from "@/core/interfaces/plan/planes";

interface PlanDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: HealthPlan | null;
  isInComparison: boolean;
  onToggleComparison: (planId: string) => void;
  onRequestQuote: () => void;
}

export const PlanDetailsModal = ({
  open,
  onOpenChange,
  plan,
  isInComparison,
  onToggleComparison,
  onRequestQuote,
}: PlanDetailsModalProps) => {
  
  if (!plan) return null;

  // --- HELPERS ---
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

  const cleanPlanName = plan.name.replace(new RegExp(`^${plan.empresa.replace(/[- ]/g, '[- ]?')}[- ]?`, 'i'), '').trim();
  const priceOriginal = (plan as any).priceOriginal || Math.round(plan.precio * 1.15);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 bg-slate-50 overflow-hidden rounded-3xl border-0 outline-none flex flex-col">
        
        {/* Accesibilidad */}
        <DialogTitle className="sr-only">Detalle del Plan {cleanPlanName}</DialogTitle>
        <DialogDescription className="sr-only">Detalles completos de cobertura y precios.</DialogDescription>

        {/* --- 1. HEADER (Blanco y limpio) --- */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-4">
                {/* Logo Box */}
                <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center p-1">
                    {plan.images && plan.images[0] ? (
                        <img src={`/${plan.images[0].url}`} alt={plan.empresa} className="h-full w-full object-contain mix-blend-multiply" />
                    ) : (
                        <ShieldCheck className="text-red-500" size={24} />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{cleanPlanName}</h2>
                    <div className="flex items-center gap-2 text-xs font-medium">
                        <span className="text-slate-500">{plan.empresa}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-teal-600">Línea {plan.linea}</span>
                    </div>
                </div>
            </div>
            {/* Botón Cerrar Redondo */}
            <button 
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* --- 2. BODY SCROLLABLE (Fondo Gris Suave) --- */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* === COLUMNA IZQUIERDA (Sticky visual) === */}
                <div className="lg:col-span-1 space-y-4">
                    
                    {/* TARJETA PRECIO */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center lg:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Cuota Mensual</p>
                        <div className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{formatCurrency(plan.precio)}</div>
                        <p className="text-sm text-red-300 line-through decoration-red-300 mb-6 font-medium">{formatCurrency(priceOriginal)}</p>
                        
                        <Button 
                            onClick={onRequestQuote}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-100 text-base transition-all active:scale-95 mb-3"
                        >
                            Solicitar Cotización
                        </Button>
                        <p className="text-[10px] text-center text-slate-400">Sin compromiso de contratación</p>
                    </div>

                    {/* TARJETA INFO RÁPIDA */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                        {/* Copagos */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Banknote size={20} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Copagos</p>
                                <p className="text-sm font-bold text-slate-700">{plan.copagos ? 'Con Copagos' : 'Bajos (Consulta $260)'}</p>
                            </div>
                        </div>
                        {/* Cobertura */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><Globe size={20} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Cobertura</p>
                                <p className="text-sm font-bold text-slate-700">Nacional + Países Limítrofes</p>
                            </div>
                        </div>
                        {/* Calificación */}
                         <div className="flex items-start gap-3">
                            <div className="p-2 bg-yellow-50 text-yellow-500 rounded-lg shrink-0"><Star size={20} fill="currentColor" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Calificación</p>
                                <div className="flex text-yellow-400 text-xs mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < Math.floor(plan.rating) ? "currentColor" : "none"} className={i < Math.floor(plan.rating) ? "" : "text-slate-200"} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* LINK PDF */}
                    {plan.folletos?.[0] && (
                        <button 
                            onClick={() => window.open(plan.folletos![0], '_blank')}
                            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <FileText size={18} /> Descargar Cartilla PDF
                        </button>
                    )}
                </div>

                {/* === COLUMNA DERECHA (Detalles) === */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 1. COBERTURA DESTACADA */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="text-teal-600" size={22} /> Cobertura Destacada
                        </h3>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                {plan.attributes && plan.attributes.length > 0 ? (
                                    plan.attributes.map((attr, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            {/* Icono Check Verde Relleno (Estilo Imagen) */}
                                            <CheckCircle2 className="text-green-500 fill-green-500 text-white shrink-0" size={22} />
                                            <div>
                                                <span className="block text-sm font-bold text-slate-800">{attr.name}</span>
                                                <span className="text-xs text-slate-500 font-medium">{attr.value_name}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Ver detalle en PDF adjunto.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 2. CLÍNICAS DISPONIBLES */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Building2 className="text-teal-600" size={22} /> Clínicas Disponibles <span className="text-slate-400 font-normal text-sm">({plan.clinicas?.length || 0})</span>
                        </h3>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex flex-wrap gap-2">
                                {plan.clinicas && plan.clinicas.length > 0 ? (
                                    <>
                                        {plan.clinicas.slice(0, 12).map((clinica, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-transparent hover:border-slate-300 cursor-default transition-colors">
                                                {clinica.entity}
                                            </span>
                                        ))}
                                        {plan.clinicas.length > 12 && (
                                            <span className="px-3 py-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg text-xs font-semibold">
                                                +{plan.clinicas.length - 12} más
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Consultar cartilla completa.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 3. CONSIDERACIONES (Caja Roja) */}
                    <section>
                        <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                            <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                                <AlertCircle size={18} /> Consideraciones (No cubierto / Topes)
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-red-700/80 font-medium">
                                <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> Cirugía Estética (Baja complejidad)</li>
                                <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> Implantes dentales</li>
                                <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> Lentes de contacto</li>
                                <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> Ecografía 5D</li>
                            </ul>
                        </div>
                    </section>

                </div>
            </div>
        </div>

    </DialogContent>
    </Dialog>
  );
};