import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { ResultsFilterSidebar } from "./ResultsFilterSidebar";

interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
  providers: string[];
  selectedProviders: string[];
  onToggleProvider: (provider: string) => void;
  minRating: number[];
  onMinRatingChange: (value: number[]) => void;
  onClearFilters: () => void;
  minLimit: number;
  maxLimit: number;
}

export const MobileFilterDrawer = ({
  open,
  onOpenChange,
  priceRange,
  onPriceRangeChange,
  providers,
  selectedProviders,
  onToggleProvider,
  minRating,
  onMinRatingChange,
  onClearFilters,
  minLimit,
  maxLimit,
}: MobileFilterDrawerProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    {/* 
      1. bg-slate-50: Fondo gris suave para contrastar con la sidebar blanca.
      2. p-4: Padding para que la tarjeta respire.
      3. overflow-y-auto: Para que se pueda scrollear si el celular es pequeño.
    */}
    <SheetContent side="left" className="w-[85%] sm:w-[380px] p-4 bg-slate-50 overflow-y-auto border-r-0">
      
      {/* Header oculto para accesibilidad (Screen Readers), ya que la Sidebar tiene su propio título visual */}
      <SheetHeader className="sr-only">
        <SheetTitle>Filtros de Búsqueda</SheetTitle>
        <SheetDescription>
          Ajusta el rango de precios, prestadores y calificación para encontrar tu plan ideal.
        </SheetDescription>
      </SheetHeader>

      {/* Contenedor con margen superior para no chocar con la barra de estado o botón cerrar */}
      <div className="mt-6 pb-10">
        <ResultsFilterSidebar
          priceRange={priceRange}
          onPriceRangeChange={onPriceRangeChange}
          providers={providers}
          selectedProviders={selectedProviders}
          onToggleProvider={onToggleProvider}
          minRating={minRating}
          onMinRatingChange={onMinRatingChange}
          onClearFilters={() => {
            onClearFilters();
            // Opcional: Cerrar el drawer al limpiar si lo prefieres
            // onOpenChange(false); 
          }}
          minLimit={minLimit}
          maxLimit={maxLimit}
        />
      </div>
    </SheetContent>
  </Sheet>
);