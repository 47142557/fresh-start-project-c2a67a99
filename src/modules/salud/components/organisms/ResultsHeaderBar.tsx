import { Search, Grid3x3, List, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Clinica } from "@/core/interfaces/plan/clinicas";

interface ResultsHeaderBarProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (value: "grid" | "list") => void;
  filteredPlansCount: number;
  onOpenFilters: () => void;
  allClinicas: Clinica[];
  selectedClinicas: Clinica[];
  onToggleClinica: (clinica: Clinica) => void;
  onRemoveClinica: (clinicaId: string) => void;
  openClinicSearch: boolean;
  onOpenClinicSearchChange: (open: boolean) => void;
}

export const ResultsHeaderBar = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  filteredPlansCount,
  onOpenFilters,
  allClinicas,
  selectedClinicas,
  onToggleClinica,
  onRemoveClinica,
  openClinicSearch,
  onOpenClinicSearchChange,
}: ResultsHeaderBarProps) => {
  return (
    <>
      {/* Clinic Search Section - Prominent */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            ¿Qué clínicas son importantes para ti?
          </h2>
        </div>
        
        <div className="flex gap-3">
          <Popover open={openClinicSearch} onOpenChange={onOpenClinicSearchChange}>
            <PopoverTrigger asChild>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  readOnly
                  placeholder="Escribe el nombre de tu clínica o prestador..."
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-sm cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => onOpenClinicSearchChange(true)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[min(500px,90vw)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar clínicas..." />
                <CommandList>
                  <CommandEmpty>No se encontraron clínicas.</CommandEmpty>
                  <CommandGroup>
                    {allClinicas
                      .filter(clinica => 
                        !selectedClinicas.find(c => c.item_id === clinica.item_id)
                      )
                      .map((clinica) => (
                      <CommandItem
                        key={clinica.item_id}
                        onSelect={() => {
                          onToggleClinica(clinica);
                          onOpenClinicSearchChange(false);
                        }}
                      >
                        {clinica.entity}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <Button className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Buscar
          </Button>
        </div>

        {/* Selected clinics badges */}
        {selectedClinicas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedClinicas.map((clinica) => (
              <Badge
                key={clinica.item_id}
                variant="secondary"
                className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
                onClick={() => onRemoveClinica(clinica.item_id)}
              >
                ✓ {clinica.entity}
                <span className="ml-1">×</span>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results count and controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Se encontraron <span className="font-semibold text-foreground">{filteredPlansCount} planes</span>
          {selectedClinicas.length > 0 && (
            <span> que incluyen {selectedClinicas.map(c => c.entity).join(", ")}</span>
          )}
        </p>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === "grid" && "bg-primary/10 text-primary"
              )}
              onClick={() => onViewModeChange("grid")}
              title="Vista grilla"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === "list" && "bg-primary/10 text-primary"
              )}
              onClick={() => onViewModeChange("list")}
              title="Vista lista"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort Button */}
          <div className="hidden sm:block">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-10 h-10 p-0 [&>svg]:hidden bg-card" title="Ordenar">
                <ArrowUpDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Sin ordenar</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="name-asc">Empresa: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Floating Filter Button - Mobile Only */}
      <Button
        onClick={onOpenFilters}
        className="fixed bottom-6 right-6 z-50 lg:hidden rounded-full h-14 w-14 shadow-lg"
        size="icon"
      >
        <Filter className="h-6 w-6" />
      </Button>
    </>
  );
};