import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Building2, Stethoscope, Baby, Ambulance, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartillaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zoneName: string; // ej: "AMBA"
  providerName: string; // ej: "Sancor Salud"
}

// Datos Mock (En el futuro pueden venir de tu DB)
const TOP_PROVIDERS = {
  sanatorios: ["Sanatorio Otamendi", "Sanatorio de la Trinidad", "Hospital Italiano", "Sanatorio Finochietto", "Clínica Bazterrica"],
  guardia: ["Hospital Alemán", "Clínica del Sol", "Sanatorio Mater Dei", "IADT"],
  pediatria: ["Hospital de Niños", "Sanatorio de los Arcos (Pediatría)", "Clínica San Lucas"]
};

export const CartillaModal = ({ open, onOpenChange, zoneName, providerName }: CartillaModalProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSpecificSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulación de envío
    setTimeout(() => {
        setIsSearching(false);
        onOpenChange(false);
        toast({
            title: "Consulta enviada",
            description: `Te confirmaremos por WhatsApp si ${searchTerm} atiende por ${providerName}.`,
            className: "bg-teal-50 border-teal-200 text-teal-900"
        });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-50 p-0 gap-0 rounded-3xl overflow-hidden border-0">
        
        {/* Header Visual */}
        <div className="bg-slate-900 p-6 text-white">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="text-teal-400" /> Cartilla Destacada {zoneName}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                    Principales prestadores de {providerName}.
                </DialogDescription>
            </DialogHeader>
            
            {/* Buscador "Gancho" */}
            <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-medium text-orange-300 mb-2 flex items-center gap-2">
                    <Search size={14} /> ¿Buscás un médico específico?
                </p>
                <form onSubmit={handleSpecificSearch} className="flex gap-2">
                    <Input 
                        placeholder="Ej: Dr. Juan Pérez o Cardiólogo en Palermo..." 
                        className="bg-white text-slate-900 border-0 focus-visible:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                    />
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                        {isSearching ? "..." : "Consultar"}
                    </Button>
                </form>
                <p className="text-[10px] text-slate-400 mt-2">
                    *Te confirmamos la cobertura exacta por WhatsApp para evitar errores.
                </p>
            </div>
        </div>

        {/* Body con Tabs */}
        <div className="p-6">
            <Tabs defaultValue="sanatorios" className="w-full">
                <TabsList className="w-full bg-slate-200/50 p-1 rounded-xl mb-6">
                    <TabsTrigger value="sanatorios" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm font-bold text-xs sm:text-sm">
                        <Building2 size={14} className="mr-2 hidden sm:inline" /> Sanatorios
                    </TabsTrigger>
                    <TabsTrigger value="guardia" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm font-bold text-xs sm:text-sm">
                        <Ambulance size={14} className="mr-2 hidden sm:inline" /> Guardia
                    </TabsTrigger>
                    <TabsTrigger value="pediatria" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm font-bold text-xs sm:text-sm">
                        <Baby size={14} className="mr-2 hidden sm:inline" /> Pediatría
                    </TabsTrigger>
                </TabsList>

                {/* Contenido de las Tabs */}
                {Object.entries(TOP_PROVIDERS).map(([key, list]) => (
                    <TabsContent key={key} value={key} className="space-y-3 mt-0 animate-in fade-in slide-in-from-bottom-4">
                        {list.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-teal-200 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors">
                                        <MapPin size={14} />
                                    </div>
                                    <span className="font-semibold text-slate-700 text-sm">{item}</span>
                                </div>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                    Cubierto
                                </span>
                            </div>
                        ))}
                    </TabsContent>
                ))}
            </Tabs>

            {/* Footer del Modal */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-4">
                    Esta es una selección destacada. La cartilla completa tiene +5.000 prestadores.
                </p>
                <Button 
                    variant="outline" 
                    className="w-full border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-200 hover:bg-teal-50"
                    onClick={() => window.open("https://wa.me/5491100000000?text=Hola,%20quiero%20ver%20la%20cartilla%20completa%20de%20" + providerName, "_blank")}
                >
                    Solicitar Cartilla Completa PDF por WhatsApp <ArrowRight size={16} className="ml-2" />
                </Button>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};