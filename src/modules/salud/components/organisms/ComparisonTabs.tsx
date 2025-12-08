import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthPlan } from "@/core/interfaces/plan/planes";
import { Clinica } from "@/core/interfaces/plan/clinicas";
import { BeneficiosTable } from "./BeneficiosTable";
import { ClinicasContent } from "./ClinicasContent";
import { AddPlanTab } from "./AddPlanTab";

interface ComparisonTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  plans: HealthPlan[];
  plansToAdd: HealthPlan[];
  groupedAttributes: Record<string, string[]>;
  collapsedGroups: Set<string>;
  onToggleGroup: (groupName: string) => void;
  onRemovePlan: (planId: string) => void;
  onAddPlan: (planId: string) => void;
  getPlanAttributeValue: (plan: HealthPlan, attrName: string) => string;
  // Clinicas props
  uniqueClinicas: Clinica[];
  regions: string[];
  activeClinicaTab: string;
  onClinicaTabChange: (value: string) => void;
  getClinicasByRegion: (region: string) => Clinica[];
  planIncludesClinica: (plan: HealthPlan, clinicaId: string) => boolean;
  // Search props
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ComparisonTabs = ({
  activeTab,
  onTabChange,
  plans,
  plansToAdd,
  groupedAttributes,
  collapsedGroups,
  onToggleGroup,
  onRemovePlan,
  onAddPlan,
  getPlanAttributeValue,
  uniqueClinicas,
  regions,
  activeClinicaTab,
  onClinicaTabChange,
  getClinicasByRegion,
  planIncludesClinica,
  searchTerm,
  onSearchChange,
}: ComparisonTabsProps) => (
  <Tabs defaultValue="beneficios" value={activeTab} onValueChange={onTabChange} className="space-y-4">
    <TabsList className="w-full justify-start bg-muted/30 p-1 rounded-xl h-11">
      <TabsTrigger value="beneficios" className="rounded-lg text-sm px-4 py-2">
        Beneficios
      </TabsTrigger>
      <TabsTrigger value="clinicas" className="rounded-lg text-sm px-4 py-2">
        Clínicas
      </TabsTrigger>
      <TabsTrigger value="add" className="rounded-lg flex items-center gap-1.5 text-sm px-4 py-2">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Añadir</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent value="beneficios" className="mt-0 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <BeneficiosTable
          plans={plans}
          groupedAttributes={groupedAttributes}
          collapsedGroups={collapsedGroups}
          onToggleGroup={onToggleGroup}
          onRemovePlan={onRemovePlan}
          getPlanAttributeValue={getPlanAttributeValue}
        />
      </div>
    </TabsContent>

    <TabsContent value="clinicas" className="mt-0 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <ClinicasContent
          plans={plans}
          uniqueClinicas={uniqueClinicas}
          regions={regions}
          activeClinicaTab={activeClinicaTab}
          onClinicaTabChange={onClinicaTabChange}
          onRemovePlan={onRemovePlan}
          getClinicasByRegion={getClinicasByRegion}
          planIncludesClinica={planIncludesClinica}
        />
      </div>
    </TabsContent>

    <TabsContent value="add" className="mt-0">
      <AddPlanTab
        plansToAdd={plansToAdd}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onAddPlan={onAddPlan}
        isMaxReached={plans.length >= 4}
      />
    </TabsContent>
  </Tabs>
);
