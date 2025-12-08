import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Grid3x3, Plus, Heart, Shield, Users, Building2, Stethoscope, Baby } from "lucide-react";
import { type HealthPlan } from "@/core/interfaces/plan/planes";
import { type Clinica } from "@/core/interfaces/plan/clinicas";
import { Helmet } from "react-helmet-async";
import Layout from "@/layouts/Layout";
import FormQuote from "@/modules/salud/components/FormQuote";
import { FloatingQuoteButton } from "@/modules/salud/components/FloatingQuoteButton";
import { FloatingComparisonCart } from "@/modules/salud/components/FloatingComparisonCart";
import { PlanDetailsModal } from "@/modules/salud/components/PlanDetailsModal";
import { QuoteRecoveryModal } from "@/modules/salud/components";
import { QuickNavBar, QuickNavItem } from "@/modules/salud/components/organisms/QuickNavBar";
import { ResultsHeroBanner } from "@/modules/salud/components/organisms/ResultsHeroBanner";
import { FeaturesSection, Feature } from "@/modules/salud/components/organisms/FeaturesSection";
import { ResultsMainContent } from "@/modules/salud/components/organisms/ResultsMainContent";
import { MobileFilterDrawer } from "@/modules/salud/components/organisms/MobileFilterDrawer";
import { HeroSlide } from "@/modules/salud/components/molecules/HeroSlideContent";
import { useToast } from "@/hooks/use-toast";
import { useCotizacion } from "@/hooks/useCotizacion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// --- CONSTANTS ---
const HERO_SLIDES: HeroSlide[] = [
  { title: "Encontrá el plan perfecto para vos", subtitle: "Compará planes de las mejores prepagas" },
  { title: "Filtrá por precio y cobertura", subtitle: "Ajustá el rango de precios a tu presupuesto" },
  { title: "Buscá por clínica", subtitle: "Encontrá planes que incluyan tu clínica favorita" },
  { title: "Compará hasta 4 planes", subtitle: "Analizá beneficios lado a lado" },
  { title: "Cotización sin compromiso", subtitle: "Recibí asesoramiento personalizado" },
];

const FEATURES: Feature[] = [
  {
    icon: Search,
    title: "Búsqueda inteligente",
    description: "Filtrá por precio, cobertura, clínicas y más",
  },
  {
    icon: Grid3x3,
    title: "Comparación fácil",
    description: "Compará hasta 4 planes lado a lado",
  },
  {
    icon: Plus,
    title: "Cotización gratuita",
    description: "Solicitá tu cotización sin compromiso",
  },
];

// --- MAIN COMPONENT ---
const ResultadosPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  useEffect(() => {
    if (cotizacionData.length > 0) {
      console.log('✅ Datos de Cotización recibidos en ResultadosPage:', cotizacionData);
      console.log(`Número total de planes: ${cotizacionData.length}`);
    } else if (!isLoading) {
      console.warn('⚠️ No se recibieron planes de salud, o la lista está vacía.');
    }
  }, [cotizacionData, isLoading]);

  const healthPlans = cotizacionData;
  const loading = isLoading;

  // Calculate price limits
  const { minPrice, maxPrice } = useMemo(() => {
    const numericPrices = healthPlans
      .filter(plan => plan.precio !== null && plan.precio !== undefined)
      .map(plan => Number(plan.precio))
      .filter(price => !isNaN(price) && price >= 0);

    return {
      maxPrice: numericPrices.length > 0 ? Math.ceil(Math.max(...numericPrices) / 1000) * 1000 : 10000000,
      minPrice: numericPrices.length > 0 ? Math.floor(Math.min(...numericPrices) / 1000) * 1000 : 0,
    };
  }, [healthPlans]);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [minRating, setMinRating] = useState([0]);
  const [formQuoteOpen, setFormQuoteOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
  const [selectedClinicas, setSelectedClinicas] = useState<Clinica[]>([]);
  const [openClinicSearch, setOpenClinicSearch] = useState(false);
  const [comparisonPlans, setComparisonPlans] = useState<string[]>([]);

  // Update price range when data loads
  useEffect(() => {
    if (minPrice > 0 || maxPrice < 10000000) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  // Derived data
  const providers = useMemo(() => 
    Array.from(new Set(healthPlans.map(p => p.empresa))), 
    [healthPlans]
  );

  const allClinicas = useMemo(() => 
    healthPlans.reduce((acc: Clinica[], plan) => {
      if (plan.clinicas) {
        plan.clinicas.forEach(clinica => {
          if (!acc.find(c => c.item_id === clinica.item_id)) {
            acc.push(clinica);
          }
        });
      }
      return acc;
    }, []),
    [healthPlans]
  );

  const filteredPlans = useMemo(() => 
    healthPlans.filter(plan => {
      const matchesPrice = plan.precio >= priceRange[0] && plan.precio <= priceRange[1];
      const matchesProvider = selectedProviders.length === 0 || selectedProviders.includes(plan.empresa);
      const matchesRating = plan.rating >= minRating[0];
      const matchesClinica = selectedClinicas.length === 0 || 
        selectedClinicas.some(selectedClinica => 
          plan.clinicas?.some(planClinica => planClinica.item_id === selectedClinica.item_id)
        );
      
      return matchesPrice && matchesProvider && matchesRating && matchesClinica;
    }),
    [healthPlans, priceRange, selectedProviders, minRating, selectedClinicas]
  );

  const sortedPlans = useMemo(() => 
    [...filteredPlans].sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.precio - b.precio;
        case "price-desc": return b.precio - a.precio;
        case "name-asc": return a.empresa.localeCompare(b.empresa);
        default: return 0;
      }
    }),
    [filteredPlans, sortBy]
  );

  const comparisonPlansList = useMemo(() => 
    healthPlans.filter(plan => comparisonPlans.includes(plan._id)),
    [healthPlans, comparisonPlans]
  );

  // Quick navigation items
  const quickNavItems: QuickNavItem[] = useMemo(() => [
    { icon: Heart, label: "Todos los planes", action: () => setSelectedProviders([]) },
    { icon: Shield, label: "Más económicos", action: () => setSortBy("price-asc") },
    { icon: Users, label: "Mejor valorados", action: () => setMinRating([4]) },
    { icon: Building2, label: "Planes básicos", action: () => setPriceRange([0, 100000]) },
    { icon: Stethoscope, label: "Cobertura premium", action: () => setPriceRange([500000, 5000000]) },
    { icon: Baby, label: "Planes familiares", action: () => setFormQuoteOpen(true) },
  ], []);

  // Handlers
  const toggleProvider = useCallback((provider: string) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  }, []);

  const toggleClinica = useCallback((clinica: Clinica) => {
    setSelectedClinicas(prev => {
      const exists = prev.find(c => c.item_id === clinica.item_id);
      if (exists) {
        return prev.filter(c => c.item_id !== clinica.item_id);
      }
      return [...prev, clinica];
    });
  }, []);

  const removeClinica = useCallback((clinicaId: string) => {
    setSelectedClinicas(prev => prev.filter(c => c.item_id !== clinicaId));
  }, []);

  const toggleComparison = useCallback((planId: string) => {
    setComparisonPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  }, []);

  const handleCompare = useCallback(() => {
    sessionStorage.setItem('comparisonPlans', JSON.stringify(comparisonPlansList));
    sessionStorage.setItem('allPlans', JSON.stringify(healthPlans));
    navigate('/comparar');
  }, [comparisonPlansList, healthPlans, navigate]);

  const openDetailsModal = useCallback((plan: HealthPlan) => {
    setSelectedPlan(plan);
    setDetailsModalOpen(true);
  }, []);

  const clearFilters = useCallback(() => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedProviders([]);
    setMinRating([0]);
    setSelectedClinicas([]);
  }, [minPrice, maxPrice]);

  const handleWhatsAppClick = useCallback(() => {
    window.open('https://wa.me/5491100000000', '_blank');
  }, []);

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

      <FloatingComparisonCart 
        plans={comparisonPlansList}
        onRemove={toggleComparison}
        onCompare={handleCompare}
      />

      <ResultsHeroBanner
        slides={HERO_SLIDES}
        plansCount={healthPlans.length}
        providersCount={providers.length}
        onWhatsAppClick={handleWhatsAppClick}
      />

      <QuickNavBar items={quickNavItems} />

      <MobileFilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        providers={providers}
        selectedProviders={selectedProviders}
        onToggleProvider={toggleProvider}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        onClearFilters={clearFilters}
        minLimit={minPrice}
        maxLimit={maxPrice}
      />

      <ResultsMainContent
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        providers={providers}
        selectedProviders={selectedProviders}
        onToggleProvider={toggleProvider}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        onClearFilters={clearFilters}
        minLimit={minPrice}
        maxLimit={maxPrice}
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
        plans={sortedPlans}
        loading={loading}
        comparisonPlans={comparisonPlans}
        onToggleComparison={toggleComparison}
        onOpenDetails={openDetailsModal}
      />

      <FeaturesSection features={FEATURES} />

      <PlanDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        plan={selectedPlan}
        isInComparison={selectedPlan ? comparisonPlans.includes(selectedPlan._id) : false}
        onToggleComparison={toggleComparison}
        onRequestQuote={() => setFormQuoteOpen(true)}
      />

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
