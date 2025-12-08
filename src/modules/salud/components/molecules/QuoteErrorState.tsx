import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { StatusIcon } from "../atoms/StatusIcon";

interface QuoteErrorStateProps {
  message: string;
}

export const QuoteErrorState = ({ message }: QuoteErrorStateProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Helmet>
      <title>Cotización no encontrada | Mejor Plan</title>
    </Helmet>
    <Card className="w-full max-w-md text-center">
      <CardContent className="p-8">
        <StatusIcon icon={XCircle} variant="destructive" size="lg" />
        <h1 className="text-xl font-bold mb-2">Cotización no disponible</h1>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  </div>
);
