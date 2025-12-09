import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight } from "lucide-react";

interface StickyQuoteCTAProps {
  onClick: () => void;
}

export const StickyQuoteCTA = ({ onClick }: StickyQuoteCTAProps) => {
  return (
    <div className="sticky top-16 z-40 w-full bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <Button
          onClick={onClick}
          variant="ghost"
          size="lg"
          className="w-full h-14 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-base md:text-lg font-bold tracking-wide gap-3"
        >
          <Calculator className="h-5 w-5 md:h-6 md:w-6" />
          <span>Cotizá tu plan de salud ahora</span>
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6 animate-pulse" />
        </Button>
      </div>
    </div>
  );
};
