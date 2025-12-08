import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollableTabs } from "@/modules/salud/components/ScrollableTabs";
import { HealthPlan } from "@/core/interfaces/plan/planes";
import { Clinica } from "@/core/interfaces/plan/clinicas";
import { ClinicasTable } from "./ClinicasTable";
import { ComparisonStyles } from "./ComparisonStyles";

interface ClinicasContentProps {
  plans: HealthPlan[];
  uniqueClinicas: Clinica[];
  regions: string[];
  activeClinicaTab: string;
  onClinicaTabChange: (value: string) => void;
  onRemovePlan: (planId: string) => void;
  getClinicasByRegion: (region: string) => Clinica[];
  planIncludesClinica: (plan: HealthPlan, clinicaId: string) => boolean;
}

export const ClinicasContent = ({
  plans,
  uniqueClinicas,
  regions,
  activeClinicaTab,
  onClinicaTabChange,
  onRemovePlan,
  getClinicasByRegion,
  planIncludesClinica,
}: ClinicasContentProps) => {
  const clinicasToShow = activeClinicaTab === "todas" 
    ? uniqueClinicas 
    : getClinicasByRegion(activeClinicaTab);

  return (
    <div className="flex flex-col h-full max-w-full overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: ComparisonStyles }} />
      
      <Tabs 
        defaultValue="todas" 
        value={activeClinicaTab} 
        onValueChange={onClinicaTabChange} 
        className="flex flex-col flex-1 max-w-full"
      >
        <div className="px-4 pt-4 border-b bg-background max-w-full">
          <ScrollableTabs className="pb-2">
            <TabsList className="inline-flex h-9 items-center justify-start gap-1 bg-muted p-1 w-auto">
              <TabsTrigger value="todas" className="shrink-0 text-xs px-3">
                Todas ({uniqueClinicas.length})
              </TabsTrigger>
              {regions.map(region => (
                <TabsTrigger key={region} value={region} className="shrink-0 text-xs px-3">
                  {region} ({getClinicasByRegion(region).length})
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollableTabs>
        </div>
        
        <TabsContent value={activeClinicaTab} className="tabs-content-container m-0 mt-4">
          <ClinicasTable
            plans={plans}
            clinicas={clinicasToShow}
            onRemovePlan={onRemovePlan}
            planIncludesClinica={planIncludesClinica}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
