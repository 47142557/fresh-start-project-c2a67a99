import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/layouts/Layout";
import { useToast } from "@/hooks/use-toast";
import { PdfDownloadSection } from "@/modules/salud/components/organisms/PdfDownloadSection";
import { SaveQuoteModal } from "@/modules/salud/components/organisms/SaveQuoteModal";
import { ComparisonHeader } from "@/modules/salud/components/organisms/ComparisonHeader";
import { ComparisonTabs } from "@/modules/salud/components/organisms/ComparisonTabs";
import { HealthPlan } from "@/core/interfaces/plan/planes";
import { Clinica } from "@/core/interfaces/plan/clinicas";
import { useVendorAuth } from "@/modules/vendor/hooks/useVendorAuth";

// --- INTERFACES ---
interface ComparisonPageProps {
  plansToCompare?: HealthPlan[];
  allAvailablePlans?: HealthPlan[];
  onAddPlan?: (planId: string) => void;
  onRemovePlan?: (planId: string) => void;
}

// --- CUSTOM HOOK ---
const useComparisonData = (
  propPlansToCompare?: HealthPlan[],
  propAllAvailablePlans?: HealthPlan[],
  propOnAddPlan?: (planId: string) => void,
  propOnRemovePlan?: (planId: string) => void
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [internalPlansToCompare, setInternalPlansToCompare] = useState<HealthPlan[]>([]);
  const [internalAllPlans, setInternalAllPlans] = useState<HealthPlan[]>([]);
  
  const plansToCompare = (propPlansToCompare && propPlansToCompare.length > 0) 
    ? propPlansToCompare 
    : internalPlansToCompare;
  const allAvailablePlans = (propAllAvailablePlans && propAllAvailablePlans.length > 0) 
    ? propAllAvailablePlans 
    : internalAllPlans;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!propPlansToCompare || !propAllAvailablePlans) {
      const storedComparisonPlans = sessionStorage.getItem('comparisonPlans');
      const storedAllPlans = sessionStorage.getItem('allPlans');
      
      if (storedComparisonPlans && storedAllPlans) {
        try {
          const parsedComparisonPlans = JSON.parse(storedComparisonPlans);
          const parsedAllPlans = JSON.parse(storedAllPlans);
          setInternalPlansToCompare(parsedComparisonPlans);
          setInternalAllPlans(parsedAllPlans);
        } catch (error) {
          console.error('Error parsing sessionStorage:', error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los planes de comparación",
            variant: "destructive"
          });
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [propPlansToCompare, propAllAvailablePlans, navigate, toast]);
  
  const handleAddPlan = useCallback((planId: string) => {
    if (propOnAddPlan) {
      propOnAddPlan(planId);
    } else {
      if (internalPlansToCompare.length < 4) {
        const planToAdd = internalAllPlans.find(p => p._id === planId);
        if (planToAdd && !internalPlansToCompare.find(p => p._id === planId)) {
          const newPlans = [...internalPlansToCompare, planToAdd];
          setInternalPlansToCompare(newPlans);
          sessionStorage.setItem('comparisonPlans', JSON.stringify(newPlans));
        }
      }
    }
  }, [propOnAddPlan, internalPlansToCompare, internalAllPlans]);
  
  const handleRemovePlan = useCallback((planId: string) => {
    if (propOnRemovePlan) {
      propOnRemovePlan(planId);
    } else {
      const newPlans = internalPlansToCompare.filter(p => p._id !== planId);
      setInternalPlansToCompare(newPlans);
      sessionStorage.setItem('comparisonPlans', JSON.stringify(newPlans));
    }
  }, [propOnRemovePlan, internalPlansToCompare]);

  return {
    plansToCompare,
    allAvailablePlans,
    onAddPlan: propOnAddPlan || handleAddPlan,
    onRemovePlan: propOnRemovePlan || handleRemovePlan,
  };
};

// --- MAIN COMPONENT ---
export const ComparisonPage = ({
  plansToCompare: propPlansToCompare,
  allAvailablePlans: propAllAvailablePlans,
  onAddPlan: propOnAddPlan,
  onRemovePlan: propOnRemovePlan,
}: ComparisonPageProps) => {
  const { toast } = useToast();
  const { user, isVendor } = useVendorAuth();
  
  const [activeTab, setActiveTab] = useState("beneficios"); 
  const [activeClinicaTab, setActiveClinicaTab] = useState("todas"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});

  const { plansToCompare, allAvailablePlans, onAddPlan, onRemovePlan } = useComparisonData(
    propPlansToCompare,
    propAllAvailablePlans,
    propOnAddPlan,
    propOnRemovePlan
  );

  const toggleGroupCollapse = useCallback((groupName: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  }, []);
  
  // --- DATA LOGIC ---
  const plansToAdd = useMemo(() => {
    const comparingIds = new Set(plansToCompare.map(p => p._id));
    return allAvailablePlans
      .filter(plan => !comparingIds.has(plan._id))
      .filter(plan => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (plan.name?.toLowerCase() || '').includes(searchLower) ||
          (plan.linea?.toLowerCase() || '').includes(searchLower) ||
          (plan.empresa?.toLowerCase() || '').includes(searchLower)
        );
      });
  }, [allAvailablePlans, plansToCompare, searchTerm]);
  
  const groupedAttributes = useMemo(() => {
    const uniqueAttrs = new Map<string, {
      groupName: string;
      groupOrder: number | null;
      attrName: string;
      attrOrder: number | null;
    }>();
    
    plansToCompare.forEach(plan => {
      plan.attributes?.forEach(attr => {
        const groupName = attr.attribute_group_name || 'Otros Beneficios';
        const key = `${groupName}::${attr.name}`;
        
        if (!uniqueAttrs.has(key)) {
          uniqueAttrs.set(key, {
            groupName,
            groupOrder: attr.attribute_group_order ?? null,
            attrName: attr.name,
            attrOrder: attr.attribute_name_order ?? null
          });
        }
      });
    });

    const sortedAttrs = Array.from(uniqueAttrs.values()).sort((a, b) => {
      if (a.groupOrder != null && b.groupOrder != null) {
        if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
      } else if (a.groupOrder != null) return -1;
      else if (b.groupOrder != null) return 1;
      else if (a.groupName !== b.groupName) {
        return a.groupName.localeCompare(b.groupName);
      }
      
      if (a.attrOrder != null && b.attrOrder != null) {
        return a.attrOrder - b.attrOrder;
      } else if (a.attrOrder != null) return -1;
      else if (b.attrOrder != null) return 1;
      return a.attrName.localeCompare(b.attrName);
    });

    const finalGroups: Record<string, string[]> = {};
    sortedAttrs.forEach(attr => {
      if (!finalGroups[attr.groupName]) {
        finalGroups[attr.groupName] = [];
      }
      finalGroups[attr.groupName].push(attr.attrName);
    });

    return finalGroups;
  }, [plansToCompare]);

  const getPlanAttributeValue = useCallback((plan: HealthPlan, attrName: string): string => {
    const attr = plan.attributes?.find(a => a.name === attrName);
    return attr ? attr.value_name : 'N/A';
  }, []);
  
  const uniqueClinicas = useMemo(() => {
    const clinicaMap = new Map<string, Clinica>();
    plansToCompare.forEach(plan => {
      plan.clinicas?.forEach(clinica => {
        if (!clinicaMap.has(clinica.item_id)) {
          clinicaMap.set(clinica.item_id, clinica);
        }
      });
    });
    return Array.from(clinicaMap.values()).sort((a, b) => (a.entity || '').localeCompare(b.entity || ''));
  }, [plansToCompare]);
  
  const regions = useMemo(() => {
    const regionSet = new Set<string>();
    uniqueClinicas.forEach(clinica => {
      clinica.ubicacion?.forEach(ub => {
        if (ub.region) {
          regionSet.add(ub.region);
        }
      });
    });
    return Array.from(regionSet).sort();
  }, [uniqueClinicas]);

  const getClinicasByRegion = useCallback((region: string): Clinica[] => {
    return uniqueClinicas.filter(clinica => 
      clinica.ubicacion?.some(ub => ub.region === region)
    );
  }, [uniqueClinicas]);

  const planIncludesClinica = useCallback((plan: HealthPlan, clinicaId: string): boolean => {
    return plan.clinicas?.some(clinica => clinica.item_id === clinicaId) ?? false;
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>{`Comparar Planes de Salud | ${plansToCompare.length} Planes Seleccionados`}</title>
        <meta name="description" content={`Compará lado a lado ${plansToCompare.length} planes de salud. Analizá beneficios, coberturas, cartilla médica y precios para tomar la mejor decisión.`} />
        <meta name="keywords" content="comparar planes de salud, comparador prepagas, beneficios planes médicos, cartilla médica" />
        <link rel="canonical" href="https://tudominio.com/comparar" />
        <meta property="og:title" content={`Comparación de ${plansToCompare.length} Planes de Salud`} />
        <meta property="og:description" content="Compará beneficios, coberturas y clínicas de múltiples planes de salud en una sola vista." />
        <meta property="og:url" content="https://tudominio.com/comparar" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <ComparisonHeader 
        plansCount={plansToCompare.length}
        isVendor={isVendor}
        onSaveClick={() => setSaveModalOpen(true)}
      />

      <div className="flex-1 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <ComparisonTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            plans={plansToCompare}
            plansToAdd={plansToAdd}
            groupedAttributes={groupedAttributes}
            collapsedGroups={collapsedGroups}
            onToggleGroup={toggleGroupCollapse}
            onRemovePlan={onRemovePlan}
            onAddPlan={onAddPlan}
            getPlanAttributeValue={getPlanAttributeValue}
            uniqueClinicas={uniqueClinicas}
            regions={regions}
            activeClinicaTab={activeClinicaTab}
            onClinicaTabChange={setActiveClinicaTab}
            getClinicasByRegion={getClinicasByRegion}
            planIncludesClinica={planIncludesClinica}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <PdfDownloadSection 
            plans={plansToCompare}
            groupedAttributes={groupedAttributes}
            canEditPrices={isVendor}
          />
        </div>
      </div>

      {isVendor && user && (
        <SaveQuoteModal
          open={saveModalOpen}
          onOpenChange={setSaveModalOpen}
          plans={plansToCompare}
          editedPrices={editedPrices}
          userId={user.id}
          onSaved={() => {
            toast({
              title: "Cotización guardada",
              description: "Puedes verla en tu dashboard de cotizaciones.",
            });
          }}
        />
      )}
    </Layout>
  );
};

export default ComparisonPage;
