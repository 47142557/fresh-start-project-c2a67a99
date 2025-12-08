import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { getQuoteByToken, recordQuoteView, PublicQuote } from "@/services/quotes.service";
import { QuoteLoadingSkeleton } from "@/modules/salud/components/molecules/QuoteLoadingSkeleton";
import { QuoteErrorState } from "@/modules/salud/components/molecules/QuoteErrorState";
import { QuoteAccessForm } from "@/modules/salud/components/molecules/QuoteAccessForm";
import { QuoteHeader } from "@/modules/salud/components/organisms/QuoteHeader";
import { QuotePlansList } from "@/modules/salud/components/organisms/QuotePlansList";
import { QuoteActions } from "@/modules/salud/components/organisms/QuoteActions";
import { QuoteFooter } from "@/modules/salud/components/organisms/QuoteFooter";

// --- TYPES ---
interface Plan {
  id: string;
  name: string;
  empresa: string;
  precio: number;
}

// --- CUSTOM HOOK ---
const usePublicQuote = (token: string | undefined) => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresCode, setRequiresCode] = useState(false);
  const [accessCode, setAccessCode] = useState(searchParams.get("code") || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const loadQuote = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const { quote: fetchedQuote, error: fetchError } = await getQuoteByToken(token);

      if (fetchError || !fetchedQuote) {
        setError("Esta cotización no existe o ya no está disponible.");
        return;
      }

      const providedCode = searchParams.get("code");
      const viewRecorded = await recordQuoteView(
        fetchedQuote.id,
        providedCode || undefined,
        navigator.userAgent,
        document.referrer
      );

      if (viewRecorded) {
        setQuote(fetchedQuote);
      } else {
        setQuote(fetchedQuote);
        setRequiresCode(true);
      }
    } catch (err) {
      console.error("Error loading quote:", err);
      setError("Ocurrió un error al cargar la cotización.");
    } finally {
      setIsLoading(false);
    }
  }, [token, searchParams]);

  useEffect(() => {
    if (token) {
      loadQuote();
    }
  }, [token, loadQuote]);

  const verifyAccessCode = useCallback(async () => {
    if (!token || !accessCode || !quote) return;

    setIsVerifying(true);

    try {
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
  }, [token, accessCode, quote, toast]);

  const handleDownloadPdf = useCallback(async () => {
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
  }, [quote, toast]);

  const getPlansFromFormData = useCallback((): Plan[] => {
    if (!quote?.form_data) return [];
    const formData = quote.form_data as { plans?: Plan[] };
    return formData.plans || [];
  }, [quote]);

  return {
    quote,
    isLoading,
    error,
    requiresCode,
    accessCode,
    setAccessCode,
    isVerifying,
    isDownloading,
    verifyAccessCode,
    handleDownloadPdf,
    plans: getPlansFromFormData(),
  };
};

// --- MAIN COMPONENT ---
export const PublicQuotePage = () => {
  const { token } = useParams<{ token: string }>();

  const {
    quote,
    isLoading,
    error,
    requiresCode,
    accessCode,
    setAccessCode,
    isVerifying,
    isDownloading,
    verifyAccessCode,
    handleDownloadPdf,
    plans,
  } = usePublicQuote(token);

  if (isLoading) {
    return <QuoteLoadingSkeleton />;
  }

  if (error) {
    return <QuoteErrorState message={error} />;
  }

  if (requiresCode) {
    return (
      <QuoteAccessForm
        accessCode={accessCode}
        onAccessCodeChange={setAccessCode}
        onSubmit={verifyAccessCode}
        isVerifying={isVerifying}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{quote?.quote_name || "Cotización"} | Mejor Plan</title>
      </Helmet>

      <div className="container max-w-4xl mx-auto py-8 px-4">
        <QuoteHeader
          quoteName={quote?.quote_name}
          createdAt={quote?.created_at}
          familyGroup={quote?.family_group}
          requestType={quote?.request_type}
          residenceZone={quote?.residence_zone}
          customMessage={quote?.custom_message}
        />

        <QuotePlansList plans={plans} />

        <QuoteActions
          hasPdf={!!quote?.pdf_html}
          isDownloading={isDownloading}
          onDownload={handleDownloadPdf}
        />

        <QuoteFooter />
      </div>
    </div>
  );
};

export default PublicQuotePage;
