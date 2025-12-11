import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface FloatingQuoteButtonProps {
  onClick: () => void;
}

export const FloatingQuoteButton = ({ onClick }: FloatingQuoteButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed top-24 right-4 z-40 shadow-xl hover:shadow-2xl transition-all bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 px-6 font-bold animate-in slide-in-from-right-20"
    >
      <Calculator className="mr-2 h-5 w-5" />
      Cotizar
    </Button>
  );
};