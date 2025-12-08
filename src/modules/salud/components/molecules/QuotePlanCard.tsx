import { Card, CardContent } from "@/components/ui/card";

interface QuotePlanCardProps {
  name: string;
  empresa: string;
  precio: number;
}

export const QuotePlanCard = ({ name, empresa, precio }: QuotePlanCardProps) => (
  <Card className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{empresa}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            ${precio?.toLocaleString("es-AR")}
          </div>
          <p className="text-xs text-muted-foreground">por mes</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
