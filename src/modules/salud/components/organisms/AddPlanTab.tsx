import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HealthPlan } from "@/core/interfaces/plan/planes";
import { AddPlanCard } from "../molecules/AddPlanCard";

interface AddPlanTabProps {
  plansToAdd: HealthPlan[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddPlan: (planId: string) => void;
  isMaxReached: boolean;
}

export const AddPlanTab = ({
  plansToAdd,
  searchTerm,
  onSearchChange,
  onAddPlan,
  isMaxReached,
}: AddPlanTabProps) => (
  <div className="flex flex-col space-y-4 h-full overflow-hidden">
    <div className="relative shrink-0">
      <Input 
        placeholder="Buscar planes por nombre o línea..." 
        value={searchTerm} 
        onChange={(e) => onSearchChange(e.target.value)} 
        className="pl-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    </div>

    <ScrollArea className="flex-1 min-h-0">
      {plansToAdd.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No se encontraron planes disponibles o ya están todos comparados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
          {plansToAdd.map(plan => (
            <AddPlanCard
              key={plan._id}
              plan={plan}
              onAddPlan={onAddPlan}
              isMaxReached={isMaxReached}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  </div>
);
