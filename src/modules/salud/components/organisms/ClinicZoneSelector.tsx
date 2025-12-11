import { useState } from "react";
import { MapPin, Building2, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartillaModal } from "./CartillaModal";

// 1. Definimos las zonas aquí para que el componente pueda usarlas
const ZONES = {
  "amba": { label: "AMBA (Bs As)", clinics: ["Sanatorio Otamendi", "IADT", "Finochietto", "Mater Dei"] },
  "cordoba": { label: "Córdoba", clinics: ["Sanatorio Allende", "Hospital Privado", "Reina Fabiola"] },
  "mendoza": { label: "Mendoza", clinics: ["Hospital Español", "Clínica de Cuyo", "Santa Isabel"] },
  "santa-fe": { label: "Santa Fe", clinics: ["Sanatorio Santa Fe", "Grupo Santa Fe", "Diagnóstico Médico"] },
};

export const ClinicZoneSelector = () => {
  // 2. Definimos los estados (Esto soluciona el error "No se encuentra el nombre...")
  const [activeZone, setActiveZone] = useState<keyof typeof ZONES>("amba");
  const [modalOpen, setModalOpen] = useState(false); 

  return (
    <>
      {/* EL MODAL (Controlado por modalOpen) */}
      <CartillaModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        zoneName={ZONES[activeZone].label}
        providerName="Sancor Salud" 
      />

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Azul Oscuro */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <h3 className="text-xl font-bold flex items-center justify-center gap-2">
            <MapPin className="text-orange-500" /> ¿Dónde te atendés?
          </h3>
          <p className="text-slate-400 text-sm mt-1">Te mostramos la cartilla real de tu zona</p>
        </div>
        
        {/* Tabs de Zona */}
        <div className="flex overflow-x-auto p-2 bg-slate-50 border-b border-slate-200 gap-2 no-scrollbar">
          {Object.entries(ZONES).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveZone(key as keyof typeof ZONES)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeZone === key 
                  ? "bg-teal-600 text-white shadow-md" 
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              {data.label}
            </button>
          ))}
        </div>

        {/* Lista de Clínicas (Preview) */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ZONES[activeZone].clinics.map((clinic, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                  <Building2 size={16} />
                </div>
                <span className="font-semibold text-slate-700 text-sm">{clinic}</span>
                <Check size={14} className="ml-auto text-green-500" />
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
              <p className="text-xs text-slate-400 mb-3">Y más de 500 prestadores en {ZONES[activeZone].label}</p>
              
              {/* BOTÓN QUE ABRE EL MODAL */}
              <Button 
                variant="outline" 
                className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 gap-2"
                onClick={() => setModalOpen(true)} 
              >
                  <FileText size={16} /> Ver Cartilla Destacada y Guardia
              </Button>
          </div>
        </div>
      </div>
    </>
  );
};