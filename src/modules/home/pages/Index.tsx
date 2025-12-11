import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/layouts/Layout";

// Importamos los Organismos
import { HeroSection } from "../components/organisms/HeroSection";
import { LogosGrid } from "../components/organisms/LogosGrid";
import { HowItWorks } from "../components/organisms/HowItWorks";
import { FAQ } from "../components/organisms/FAQ";
import { Testimonials } from "../components/organisms/Testimonials"; // Asumo que mantienes este o lo actualizas similar

// Importamos el Cotizador (que está en modules/salud)
import { FormQuote } from "@/modules/salud/components/organisms/FormQuote";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <Layout>
      <Helmet>
        <title>Vitalia | Comparador de Salud N°1 de Argentina</title>
        <meta name="description" content="Encontrá tu plan de salud ideal. Compará precios y coberturas de las mejores prepagas." />
      </Helmet>

      {/* MODAL COTIZADOR GLOBAL */}
      <FormQuote 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
      />

      {/* 1. HERO (Video + Cotizador) */}
      <HeroSection onQuoteClick={() => setFormOpen(true)} />

      {/* 2. LOGOS (Prueba Social) */}
      <LogosGrid />

      {/* 3. CÓMO FUNCIONA */}
      <HowItWorks />

      {/* 4. TESTIMONIOS (Si lo tienes) */}
      <Testimonials />

      {/* 5. FAQ */}
      <FAQ />

      {/* 6. CTA FINAL */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black mb-6">¿Listo para mejorar tu cobertura?</h2>
            <p className="text-slate-300 text-lg mb-10">
                Unite a las miles de personas que ya eligieron cuidar su salud y su bolsillo con Vitalia.
            </p>
            <Button 
                onClick={() => setFormOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-16 px-10 rounded-full text-xl shadow-2xl shadow-orange-500/20 transition-transform hover:scale-105"
            >
                Cotizar Gratis Ahora <ArrowRight className="ml-2" />
            </Button>
        </div>
      </section>

    </Layout>
  );
};

export default Index;