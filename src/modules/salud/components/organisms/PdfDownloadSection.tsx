import { useState, useMemo } from "react";
import {
  FileDown,
  Filter,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { HealthPlan } from "@/core/interfaces/plan/planes";
import { generatePdfHtml } from "./PdfComparisonTemplate";
import { supabase } from "@/integrations/supabase/client";

interface PdfDownloadSectionProps {
  plans: HealthPlan[];
  groupedAttributes: Record<string, string[]>;
  canEditPrices?: boolean; // Feature flag for price editing
}

export const PdfDownloadSection = ({
  plans,
  groupedAttributes,
  canEditPrices = false,
}: PdfDownloadSectionProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [pricesOpen, setPricesOpen] = useState(false);

  // Region/Barrio filters
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedBarrios, setSelectedBarrios] = useState<string[]>([]);

  // Edited prices state
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});

  // Extract unique regions and barrios
  const { regions, barrios } = useMemo(() => {
    const regionSet = new Set<string>();
    const barrioSet = new Set<string>();

    plans.forEach((plan) => {
      plan.clinicas?.forEach((clinica) => {
        clinica.ubicacion?.forEach((ub) => {
          if (ub.region) regionSet.add(ub.region);
          if (ub.barrio) barrioSet.add(ub.barrio);
        });
      });
    });

    return {
      regions: Array.from(regionSet).sort(),
      barrios: Array.from(barrioSet).sort(),
    };
  }, [plans]);

  // Filter barrios based on selected regions
  const filteredBarrios = useMemo(() => {
    if (selectedRegions.length === 0) return barrios;

    const barrioSet = new Set<string>();
    plans.forEach((plan) => {
      plan.clinicas?.forEach((clinica) => {
        clinica.ubicacion?.forEach((ub) => {
          if (ub.region && selectedRegions.includes(ub.region) && ub.barrio) {
            barrioSet.add(ub.barrio);
          }
        });
      });
    });

    return Array.from(barrioSet).sort();
  }, [plans, selectedRegions, barrios]);

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
    // Clear barrios that are no longer valid
    setSelectedBarrios([]);
  };

  const toggleBarrio = (barrio: string) => {
    setSelectedBarrios((prev) =>
      prev.includes(barrio)
        ? prev.filter((b) => b !== barrio)
        : [...prev, barrio]
    );
  };

  const updatePrice = (planId: string, price: number) => {
    setEditedPrices((prev) => ({
      ...prev,
      [planId]: price,
    }));
  };

  const getDisplayPrice = (plan: HealthPlan): number => {
    return editedPrices[plan._id] ?? plan.precio;
  };

const handleDownloadPdf = async () => {
    if (plans.length === 0) {
        toast({
            title: "Sin planes",
            description: "No hay planes seleccionados para generar el PDF.",
            variant: "destructive",
        });
        return;
    }

    setIsGenerating(true);

    try {
        // 1. Generar HTML content
        const htmlContent = generatePdfHtml({
            plans,
            selectedRegions,
            selectedBarrios,
            editedPrices,
            groupedAttributes,
        });

        // 2. Obtener URL y Token para fetch nativo
        // Asumiendo que VITE_SUPABASE_URL está correctamente definido en tu entorno
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const functionUrl = `${SUPABASE_URL}/functions/v1/generate-pdf`;
        
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        
        // 3. ⚠️ INVOCACIÓN USANDO FETCH NATIVO (LA PARTE FALTANTE Y CORREGIDA)
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                // Indica al servidor que quieres una respuesta binaria
                'Accept': 'application/pdf', 
            },
            body: JSON.stringify({ htmlContent }),
        });

        if (!response.ok) {
            // Manejar errores HTTP (4xx o 5xx)
            const errorText = await response.text();
            console.error("Error del Servidor HTTP:", response.status, errorText);
            throw new Error(`Error ${response.status} al generar el PDF: ${errorText.substring(0, 50)}...`);
        }

        // 4. Leer el cuerpo de la respuesta como ArrayBuffer (datos binarios)
        const pdfData = await response.arrayBuffer(); 
        
        // 5. Verificar y descargar
        if (pdfData instanceof ArrayBuffer && pdfData.byteLength > 0) {
            // 5a. Crear un Blob directamente desde el ArrayBuffer
            const blob = new Blob([pdfData], { type: "application/pdf" });

            // 5b. Crear y disparar la descarga
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `comparacion-planes-${new Date().toISOString().split("T")[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast({
                title: "PDF generado",
                description: "El archivo se ha descargado correctamente.",
            });
        } else {
            // Si no es un ArrayBuffer, algo salió mal.
            throw new Error("Respuesta del servidor no es un PDF binario válido.");
        }
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
            title: "Error",
            description:
                error instanceof Error
                    ? error.message
                    : "No se pudo generar el PDF. Intente nuevamente.",
            variant: "destructive",
        });
    } finally {
        setIsGenerating(false);
    }
};

  return (
    <Card className="mt-6 border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileDown className="h-5 w-5 text-primary" />
          Descargar Comparación en PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Region/Barrio Filters */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto bg-muted/30 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Filtros de Clínicas para PDF</span>
                {(selectedRegions.length > 0 || selectedBarrios.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedRegions.length + selectedBarrios.length} filtros
                  </Badge>
                )}
              </div>
              {filtersOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            {/* Regions */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Regiones / Provincias
              </Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-background rounded-md border border-border">
                {regions.length > 0 ? (
                  regions.map((region) => (
                    <label
                      key={region}
                      className="flex items-center gap-1.5 text-xs cursor-pointer hover:text-primary transition-colors"
                    >
                      <Checkbox
                        checked={selectedRegions.includes(region)}
                        onCheckedChange={() => toggleRegion(region)}
                        className="h-3.5 w-3.5"
                      />
                      {region}
                    </label>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No hay regiones disponibles
                  </span>
                )}
              </div>
            </div>

            {/* Barrios */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Barrios / Localidades
              </Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-background rounded-md border border-border">
                {filteredBarrios.length > 0 ? (
                  filteredBarrios.map((barrio) => (
                    <label
                      key={barrio}
                      className="flex items-center gap-1.5 text-xs cursor-pointer hover:text-primary transition-colors"
                    >
                      <Checkbox
                        checked={selectedBarrios.includes(barrio)}
                        onCheckedChange={() => toggleBarrio(barrio)}
                        className="h-3.5 w-3.5"
                      />
                      {barrio}
                    </label>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {selectedRegions.length > 0
                      ? "No hay barrios en las regiones seleccionadas"
                      : "No hay barrios disponibles"}
                  </span>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Price Editing (Hidden by default, controlled by canEditPrices) */}
        {canEditPrices && (
          <Collapsible open={pricesOpen} onOpenChange={setPricesOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto bg-muted/30 hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Editar Precios (Avanzado)</span>
                </div>
                {pricesOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className="flex items-center gap-3 p-2 bg-background rounded-md border border-border"
                  >
                    {/* Logo */}
                    <div className="shrink-0 w-8 h-8 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {plan.images && plan.images[0] ? (
                        <img
                          src={`/${plan.images[0].url}`}
                          alt={plan.empresa}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {plan.empresa?.charAt(0)}
                        </span>
                      )}
                    </div>
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Original: ${plan.precio?.toLocaleString("es-AR")}
                      </p>
                    </div>
                    {/* Price Input */}
                    <div className="shrink-0 w-32">
                      <Input
                        type="number"
                        value={getDisplayPrice(plan)}
                        onChange={(e) =>
                          updatePrice(plan._id, Number(e.target.value))
                        }
                        className="text-right h-8 text-sm"
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Download Button */}
        <Button
          onClick={handleDownloadPdf}
          disabled={isGenerating || plans.length === 0}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generando PDF...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              Descargar PDF de Comparación
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
