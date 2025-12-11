import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getQuoteByToken, recordQuoteView, PublicQuote } from "@/services/quotes.service";

// Componentes
import { QuoteHeader } from "@/modules/salud/components/organisms/QuoteHeader";
import { QuotePlanCard } from "@/modules/salud/components/molecules/QuotePlanCard";
import { QuoteLoadingSkeleton } from "@/modules/salud/components/molecules/QuoteLoadingSkeleton";
import { QuoteAccessForm } from "@/modules/salud/components/molecules/QuoteAccessForm";
import { QuoteFooter } from "@/modules/salud/components/organisms/QuoteFooter";
import { MessageCircle } from "lucide-react";

// --- MAIN COMPONENT ---
export const PublicQuotePage = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresCode, setRequiresCode] = useState(false);
  const [accessCode, setAccessCode] = useState(searchParams.get("code") || "");

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const load = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const { quote: data, error } = await getQuoteByToken(token);
            if (error || !data) {
                // Manejar error
            } else {
                // Intentar registrar vista (Tracking)
                const viewed = await recordQuoteView(data.id, searchParams.get("code") || undefined);
                if (viewed) setQuote(data);
                else {
                    setQuote(data);
                    setRequiresCode(true); // Pedir código si es privado
                }
            }
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };
    load();
  }, [token, searchParams]);

  // --- RENDER ---
  if (isLoading) return <QuoteLoadingSkeleton />;
  
  if (requiresCode) return <QuoteAccessForm accessCode={accessCode} onAccessCodeChange={setAccessCode} onSubmit={() => {}} isVerifying={false} />;

  if (!quote) return <div className="min-h-screen flex items-center justify-center">Cotización no encontrada</div>;

  // Extraer planes del JSON
  const plans = (quote.form_data as any).plans || [];

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-20">
        <Helmet>
            <title>{quote.quote_name || "Tu Cotización"} | Vitalia</title>
        </Helmet>

        {/* 1. HEADER CON DATOS */}
        <QuoteHeader 
            quoteName={quote.quote_name}
            createdAt={quote.created_at}
            familyGroup={(quote.form_data as any).family_group}
            requestType={(quote.form_data as any).request_type}
            residenceZone={(quote.form_data as any).residence_zone}
            customMessage={quote.custom_message}
            advisorName="Hernán Pérez" // Esto debería venir de la DB del vendedor
            advisorPhone="11 1234-5678"
        />

        <main className="container mx-auto px-4 max-w-4xl">
            
            {/* Título de Sección */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Análisis de Planes Sugeridos</h2>
                <p className="text-slate-500">Seleccionamos las mejores opciones para tu perfil.</p>
            </div>

            {/* 2. LISTA DE PLANES (CARDS) */}
            <div className="space-y-6">
                {plans.map((plan: any, idx: number) => (
                    <QuotePlanCard 
                        key={plan.id || idx}
                        name={plan.name}
                        empresa={plan.empresa}
                        precio={plan.precio}
                        isRecommended={idx === 0} // Asumimos que el primero es el recomendado
                    />
                ))}
            </div>

            {/* 3. CAJA DE ACCIÓN FINAL (CTA) */}
            <div className="mt-12 bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">¿Tenés dudas o querés avanzar?</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Estoy disponible para responder tus consultas y ayudarte con el alta del plan que elijas.
                </p>
                <button 
                    onClick={() => window.open("https://wa.me/...", "_blank")}
                    className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-green-100 transition-transform hover:scale-105"
                >
                    <MessageCircle size={24} />
                    Hablar con mi Asesor
                </button>
            </div>

        </main>

        <QuoteFooter />
    </div>
  );
};