import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Lock, 
  FileText, 
  Star, 
  Calendar, 
  Users, 
  MapPin,
  Phone,
  Mail,
  Download,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getQuoteByToken, recordQuoteView, PublicQuote } from "@/services/quotes.service";
import { supabase } from "@/integrations/supabase/client";

export const PublicQuotePage = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresCode, setRequiresCode] = useState(false);
  const [accessCode, setAccessCode] = useState(searchParams.get("code") || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (token) {
      loadQuote();
    }
  }, [token]);

  const loadQuote = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const { quote: fetchedQuote, error: fetchError } = await getQuoteByToken(token);

      if (fetchError || !fetchedQuote) {
        setError("Esta cotización no existe o ya no está disponible.");
        return;
      }

      // Try to record view with optional code from URL
      // Server-side validation handles access code check
      const providedCode = searchParams.get("code");
      const viewRecorded = await recordQuoteView(
        fetchedQuote.id,
        providedCode || undefined,
        navigator.userAgent,
        document.referrer
      );

      if (viewRecorded) {
        // Access granted - view was recorded successfully
        setQuote(fetchedQuote);
      } else {
        // Access denied - likely needs access code
        setRequiresCode(true);
      }
    } catch (err) {
      console.error("Error loading quote:", err);
      setError("Ocurrió un error al cargar la cotización.");
    } finally {
      setIsLoading(false);
    }
  };

  // recordView moved to loadQuote - server validates access code

  const verifyAccessCode = async () => {
    if (!token || !accessCode || !quote) return;

    setIsVerifying(true);

    try {
      // Use server-side validation via record_quote_view
      const viewRecorded = await recordQuoteView(
        quote.id,
        accessCode,
        navigator.userAgent,
        document.referrer
      );

      if (viewRecorded) {
        setRequiresCode(false);
        toast({
          title: "Acceso concedido",
          description: "Código verificado correctamente.",
        });
      } else {
        toast({
          title: "Código incorrecto",
          description: "El código de acceso no es válido.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      toast({
        title: "Error",
        description: "Ocurrió un error al verificar el código.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!quote?.pdf_html) {
      toast({
        title: "PDF no disponible",
        description: "Esta cotización no tiene un PDF asociado.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const functionUrl = `${SUPABASE_URL}/functions/v1/generate-pdf`;

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify({ htmlContent: quote.pdf_html }),
      });

      if (!response.ok) {
        throw new Error("Error generating PDF");
      }

      const pdfData = await response.arrayBuffer();
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cotizacion-${quote.quote_name || quote.id.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "PDF descargado",
        description: "El archivo se ha descargado correctamente.",
      });
    } catch (err) {
      console.error("Error downloading PDF:", err);
      toast({
        title: "Error",
        description: "No se pudo descargar el PDF.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Parse form_data to get plans
  const getPlansFromFormData = () => {
    if (!quote?.form_data) return [];
    const formData = quote.form_data as { plans?: Array<{ id: string; name: string; empresa: string; precio: number }> };
    return formData.plans || [];
  };

  const plans = getPlansFromFormData();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Helmet>
          <title>Cotización no encontrada | Mejor Plan</title>
        </Helmet>
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Cotización no disponible</h1>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access code required
  if (requiresCode) {
    return (
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
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && verifyAccessCode()}
              />
            </div>
            <Button
              onClick={verifyAccessCode}
              disabled={!accessCode || isVerifying}
              className="w-full"
            >
              {isVerifying ? "Verificando..." : "Ver cotización"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quote display
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{quote?.quote_name || "Cotización"} | Mejor Plan</title>
      </Helmet>

      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <FileText className="h-3 w-3 mr-1" />
            Cotización de Salud
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {quote?.quote_name || "Cotización de Planes"}
          </h1>
        </div>

        {/* Custom Message */}
        {quote?.custom_message && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm italic">{quote.custom_message}</p>
            </CardContent>
          </Card>
        )}

        {/* Request Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Fecha:</span>
            <span className="font-medium">
              {new Date(quote?.created_at || "").toLocaleDateString("es-AR")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Grupo:</span>
            <span className="font-medium capitalize">{quote?.family_group}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium">
              {quote?.request_type === "particular" ? "Particular" : "Cambio O.S."}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Zona:</span>
            <span className="font-medium">{quote?.residence_zone}</span>
          </div>
        </div>

        {/* Plans */}
        <h2 className="text-lg font-semibold mb-4">Planes comparados</h2>
        <div className="grid gap-4 mb-8">
          {plans.map((plan, idx) => (
            <Card key={plan.id || idx} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.empresa}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${plan.precio?.toLocaleString("es-AR")}
                    </div>
                    <p className="text-xs text-muted-foreground">por mes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {quote?.pdf_html && (
            <Button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Descargando..." : "Descargar PDF"}
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground border-t pt-8">
          <p>Esta cotización es informativa. Los precios pueden variar.</p>
          <p className="mt-2">
            <a href="/" className="text-primary hover:underline">
              Mejor Plan
            </a>{" "}
            - Compará planes de salud
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicQuotePage;
