import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Grid3x3, Plus, Heart, Shield, Users, Building2, Stethoscope, Baby } from "lucide-react";
import { type HealthPlan } from "@/core/interfaces/plan/planes";
import {  type Clinica  } from "@/core/interfaces/plan/clinicas";
import { Helmet } from "react-helmet-async";
import Layout from "@/layouts/Layout";
import FormQuote from "@/modules/salud/components/FormQuote";
import { FloatingQuoteButton } from "@/modules/salud/components/FloatingQuoteButton";
import { ComparisonBar } from "@/modules/salud/components/ComparisonBar";
import { ResultsFilterSidebar } from "@/modules/salud/components/ResultsFilterSidebar";
import { ResultsHeaderBar } from "@/modules/salud/components/ResultsHeaderBar";
import { ResultsGrid } from "@/modules/salud/components/ResultsGrid";
import { PlanDetailsModal } from "@/modules/salud/components/PlanDetailsModal";
import { QuoteRecoveryModal } from "@/modules/salud/components";
import { useToast } from "@/hooks/use-toast";
import { useCotizacion } from "@/hooks/useCotizacion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Interfaces are now imported from health.service.ts

const ResultadosPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Cotización hook for form persistence and data fetching
  const {
    formData: cotizacionFormData,
    savedFormData,
    showRecoveryModal,
    setShowRecoveryModal,
    handleRecoverForm,
    handleStartNew,
    cotizacionData,
    isLoading
  } = useCotizacion();


  // 🔥 INICIO: Bloque de depuración
useEffect(() => {
    if (cotizacionData.length > 0) {
        console.log('✅ Datos de Cotización recibidos en ResultadosPage:', cotizacionData);
        console.log(`Número total de planes: ${cotizacionData.length}`);
    } else if (!isLoading) {
         // Se ejecuta si no hay datos y ya terminó de cargar
         console.warn('⚠️ No se recibieron planes de salud, o la lista está vacía.');
    }
}, [cotizacionData, isLoading]);
// FIN: Bloque de depuración
 // Use cotizacionData from hook instead of local state
  const healthPlans = cotizacionData;
  const loading = isLoading;
// 1. Limpiamos y convertimos todos los precios a números válidos
const numericPrices = healthPlans
    // Filtramos solo los planes que tienen un precio válido
    .filter(plan => plan.precio !== null && plan.precio !== undefined)
    // Convertimos la propiedad 'precio' a número
    .map(plan => Number(plan.precio))
    // Nos aseguramos de que no incluya valores NaN (Not a Number)
    .filter(price => !isNaN(price) && price >= 0); 

// 2. Calculamos los extremos
const maxPrice = numericPrices.length > 0 ? Math.ceil(Math.max(...numericPrices) / 1000) * 1000 : 10000000;
const minPrice = numericPrices.length > 0 ? Math.floor(Math.min(...numericPrices) / 1000) * 1000 : 0;
// -----------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [minRating, setMinRating] = useState([0]);
  const [formQuoteOpen, setFormQuoteOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);

  const [selectedClinicas, setSelectedClinicas] = useState<Clinica[]>([]);
  const [openClinicSearch, setOpenClinicSearch] = useState(false);
  const [comparisonPlans, setComparisonPlans] = useState<string[]>([]);

 
  const providers = Array.from(new Set(healthPlans.map(p => p.empresa)));
  
  // Extract all unique clinics from all plans
  const allClinicas = healthPlans.reduce((acc: Clinica[], plan) => {
    if (plan.clinicas) {
      plan.clinicas.forEach(clinica => {
        if (!acc.find(c => c.item_id === clinica.item_id)) {
          acc.push(clinica);
        }
      });
    }
    return acc;
  }, []);

  const filteredPlans = healthPlans.filter(plan => {


    const matchesPrice = plan.precio >= priceRange[0] && plan.precio <= priceRange[1];
    const matchesProvider = selectedProviders.length === 0 || selectedProviders.includes(plan.empresa);
    const matchesRating = plan.rating >= minRating[0];
    const matchesClinica = selectedClinicas.length === 0 || 
      selectedClinicas.some(selectedClinica => 
        plan.clinicas?.some(planClinica => planClinica.item_id === selectedClinica.item_id)
      );
    
    return matchesPrice && matchesProvider && matchesRating && matchesClinica;
  });

  // Sort filtered plans
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.precio - b.precio;
      case "price-desc":
        return b.precio - a.precio;
      case "name-asc":
        return a.empresa.localeCompare(b.empresa);
      default:
        return 0;
    }
  });

  const toggleProvider = (provider: string) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  const toggleClinica = (clinica: Clinica) => {
    setSelectedClinicas(prev => {
      const exists = prev.find(c => c.item_id === clinica.item_id);
      if (exists) {
        return prev.filter(c => c.item_id !== clinica.item_id);
      }
      return [...prev, clinica];
    });
  };

  const removeClinica = (clinicaId: string) => {
    setSelectedClinicas(prev => prev.filter(c => c.item_id !== clinicaId));
  };

  const toggleComparison = (planId: string) => {
    setComparisonPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const comparisonPlansList = healthPlans.filter(plan => 
    comparisonPlans.includes(plan._id)
  );

  const handleCompare = () => {
    // Store comparison data in sessionStorage to pass to comparison page
    sessionStorage.setItem('comparisonPlans', JSON.stringify(comparisonPlansList));
    sessionStorage.setItem('allPlans', JSON.stringify(healthPlans));
    navigate('/comparar');
  };

  const openDetailsModal = (plan: HealthPlan) => {
    setSelectedPlan(plan);
    setDetailsModalOpen(true);
  };

  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedProviders([]);
    setMinRating([0]);
    setSelectedClinicas([]);
  };

  return (
    <Layout>
      <Helmet>
        <title>Planes de Salud Disponibles | Comparador de Prepagas Argentina</title>
        <meta name="description" content={`Explorá ${healthPlans.length} planes de salud de las mejores prepagas de Argentina. Filtrá por precio, cobertura y clínicas. Compará y elegí el mejor plan para vos.`} />
        <meta name="keywords" content="planes de salud precios, prepagas argentina, comparar planes médicos, cobertura médica, clínicas prepagas" />
        <link rel="canonical" href="https://tudominio.com/resultados" />
        <meta property="og:title" content="Planes de Salud Disponibles - Comparador de Prepagas" />
        <meta property="og:description" content="Encontrá y compará los mejores planes de salud de Argentina con filtros por precio y cobertura." />
        <meta property="og:url" content="https://tudominio.com/resultados" />
      </Helmet>
      <FloatingQuoteButton onClick={() => setFormQuoteOpen(true)} />
      
      <Dialog open={formQuoteOpen} onOpenChange={setFormQuoteOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="w-full h-full">
            <FormQuote />
          </div>
        </DialogContent>
      </Dialog>

      <ComparisonBar 
        plans={comparisonPlansList}
        onRemove={toggleComparison}
        onCompare={handleCompare}
        isComparisonModalOpen={false}
      />
      
      {/* Compact Hero Banner - E-commerce Style */}
      <div className="relative bg-gradient-to-r from-primary via-primary/90 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-primary-foreground">
                Encontrá el plan perfecto para vos
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Compará {healthPlans.length} planes de {providers.length} prepagas
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                {healthPlans.length} planes
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                {providers.length} prepagas
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Bar - E-commerce Style */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedProviders([])}
            >
              <Heart className="h-4 w-4" />
              Todos los planes
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSortBy("price-asc")}
            >
              <Shield className="h-4 w-4" />
              Más económicos
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setMinRating([4])}
            >
              <Users className="h-4 w-4" />
              Mejor valorados
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setPriceRange([0, 100000])}
            >
              <Building2 className="h-4 w-4" />
              Planes básicos
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setPriceRange([500000, 5000000])}
            >
              <Stethoscope className="h-4 w-4" />
              Cobertura premium
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setFormQuoteOpen(true)}
            >
              <Baby className="h-4 w-4" />
              Planes familiares
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar de Filtros - Desktop */}
          <aside className="hidden lg:block bg-card border border-border rounded-xl p-6 h-fit lg:sticky lg:top-6 shadow-sm">
            <ResultsFilterSidebar
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              providers={providers}
              selectedProviders={selectedProviders}
              onToggleProvider={toggleProvider}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              onClearFilters={clearFilters}
              // 🔥 NUEVAS PROPS DE LÍMITES
              minLimit={minPrice} 
              maxLimit={maxPrice} 
              // 🔥 FIN NUEVAS PROPS
            />
          </aside>

          {/* Mobile Filter Drawer */}
          <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
            <SheetContent side="left" className="w-[80%] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ResultsFilterSidebar
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  providers={providers}
                  selectedProviders={selectedProviders}
                  onToggleProvider={toggleProvider}
                  minRating={minRating}
                  onMinRatingChange={setMinRating}
                  onClearFilters={clearFilters}
                  // 🔥 NUEVAS PROPS DE LÍMITES
                  minLimit={minPrice} 
                  maxLimit={maxPrice} 
                  // 🔥 FIN NUEVAS PROPS
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Contenido Principal */}
          <main className="flex-1 space-y-6">
            <ResultsHeaderBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              filteredPlansCount={filteredPlans.length}
              onOpenFilters={() => setFilterDrawerOpen(true)}
              allClinicas={allClinicas}
              selectedClinicas={selectedClinicas}
              onToggleClinica={toggleClinica}
              onRemoveClinica={removeClinica}
              openClinicSearch={openClinicSearch}
              onOpenClinicSearchChange={setOpenClinicSearch}
            />

            <ResultsGrid
              plans={sortedPlans}
              loading={loading}
              viewMode={viewMode}
              comparisonPlans={comparisonPlans}
              onToggleComparison={toggleComparison}
              onOpenDetails={openDetailsModal}
            />
          </main>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="bg-muted/30 border-t border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Búsqueda inteligente</h3>
              <p className="text-sm text-muted-foreground">Filtrá por precio, cobertura, clínicas y más</p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Grid3x3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Comparación fácil</h3>
              <p className="text-sm text-muted-foreground">Compará hasta 4 planes lado a lado</p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Cotización gratuita</h3>
              <p className="text-sm text-muted-foreground">Solicitá tu cotización sin compromiso</p>
            </div>
          </div>
        </div>
      </div>

      <PlanDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        plan={selectedPlan}
        isInComparison={selectedPlan ? comparisonPlans.includes(selectedPlan._id) : false}
        onToggleComparison={toggleComparison}
        onRequestQuote={() => setFormQuoteOpen(true)}
      />

      {/* Quote Recovery Modal */}
      <QuoteRecoveryModal
        open={showRecoveryModal}
        onOpenChange={setShowRecoveryModal}
        savedFormData={savedFormData}
        onRecover={handleRecoverForm}
        onStartNew={handleStartNew}
      />
    </Layout>
  );
};

export default ResultadosPage;
