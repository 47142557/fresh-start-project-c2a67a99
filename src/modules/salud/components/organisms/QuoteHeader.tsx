import { FileText, Calendar, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InfoItem } from "../atoms/InfoItem";

interface QuoteHeaderProps {
  quoteName: string | undefined;
  createdAt: string | undefined;
  familyGroup: string | undefined;
  requestType: string | undefined;
  residenceZone: string | undefined;
  customMessage?: string | null;
}

export const QuoteHeader = ({
  quoteName,
  createdAt,
  familyGroup,
  requestType,
  residenceZone,
  customMessage,
}: QuoteHeaderProps) => (
  <>
    {/* Header */}
    <div className="text-center mb-8">
      <Badge variant="secondary" className="mb-4">
        <FileText className="h-3 w-3 mr-1" />
        Cotización de Salud
      </Badge>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        {quoteName || "Cotización de Planes"}
      </h1>
    </div>

    {/* Custom Message */}
    {customMessage && (
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm italic">{customMessage}</p>
        </CardContent>
      </Card>
    )}

    {/* Request Info */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <InfoItem
        icon={Calendar}
        label="Fecha"
        value={new Date(createdAt || "").toLocaleDateString("es-AR")}
      />
      <InfoItem
        icon={Users}
        label="Grupo"
        value={familyGroup || ""}
      />
      <InfoItem
        icon={FileText}
        label="Tipo"
        value={requestType === "particular" ? "Particular" : "Cambio O.S."}
      />
      <InfoItem
        icon={MapPin}
        label="Zona"
        value={residenceZone || ""}
      />
    </div>
  </>
);
