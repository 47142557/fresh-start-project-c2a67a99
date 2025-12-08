import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComparisonHeaderProps {
  plansCount: number;
  isVendor: boolean;
  onSaveClick: () => void;
}

export const ComparisonHeader = ({ plansCount, isVendor, onSaveClick }: ComparisonHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/10 border-b border-border">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/resultados')}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Comparación de Planes
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Compará beneficios, cartilla y coberturas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isVendor && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveClick}
                disabled={plansCount === 0}
              >
                <Save className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Guardar</span>
              </Button>
            )}
            <Badge variant="secondary" className="text-xs">{plansCount} planes</Badge>
            <Badge variant="outline" className="text-xs">Máx. 4</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
