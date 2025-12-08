import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface QuoteAccessFormProps {
  accessCode: string;
  onAccessCodeChange: (code: string) => void;
  onSubmit: () => void;
  isVerifying: boolean;
}

export const QuoteAccessForm = ({
  accessCode,
  onAccessCodeChange,
  onSubmit,
  isVerifying,
}: QuoteAccessFormProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Helmet>
      <title>Acceso a Cotización | Mejor Plan</title>
    </Helmet>
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Lock className="h-12 w-12 text-primary mx-auto mb-2" />
        <CardTitle>Cotización protegida</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Esta cotización requiere un código de acceso para verla.
        </p>
        <div className="space-y-2">
          <Label htmlFor="code">Código de acceso</Label>
          <Input
            id="code"
            placeholder="Ingresa el código"
            value={accessCode}
            onChange={(e) => onAccessCodeChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
        </div>
        <Button
          onClick={onSubmit}
          disabled={!accessCode || isVerifying}
          className="w-full"
        >
          {isVerifying ? "Verificando..." : "Ver cotización"}
        </Button>
      </CardContent>
    </Card>
  </div>
);
