import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QuoteActionsProps {
  hasPdf: boolean;
  isDownloading: boolean;
  onDownload: () => void;
}

export const QuoteActions = ({ hasPdf, isDownloading, onDownload }: QuoteActionsProps) => {
  if (!hasPdf) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        onClick={onDownload}
        disabled={isDownloading}
        size="lg"
        className="flex-1 sm:flex-none"
      >
        <Download className="h-4 w-4 mr-2" />
        {isDownloading ? "Descargando..." : "Descargar PDF"}
      </Button>
    </div>
  );
};
