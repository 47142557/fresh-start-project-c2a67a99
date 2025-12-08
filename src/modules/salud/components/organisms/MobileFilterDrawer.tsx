import { Clinica } from "@/core/interfaces/plan/clinicas";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ResultsFilterSidebar } from "../ResultsFilterSidebar";

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
    <SheetContent side="left" className="w-[80%] sm:w-[350px]">
      <SheetHeader>
        <SheetTitle>Filtros</SheetTitle>
      </SheetHeader>
      <div className="mt-6">
        <ResultsFilterSidebar
          priceRange={priceRange}
          onPriceRangeChange={onPriceRangeChange}
          providers={providers}
          selectedProviders={selectedProviders}
          onToggleProvider={onToggleProvider}
          minRating={minRating}
          onMinRatingChange={onMinRatingChange}
          onClearFilters={onClearFilters}
          minLimit={minLimit}
          maxLimit={maxLimit}
        />
      </div>
    </SheetContent>
  </Sheet>
);
