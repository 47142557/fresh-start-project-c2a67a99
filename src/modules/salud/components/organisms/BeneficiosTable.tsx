import React from "react";
import { HealthPlan } from "@/core/interfaces/plan/planes";
import { PlanHeader } from "../molecules/PlanHeader";
import { AttributeGroupRow } from "../molecules/AttributeGroupRow";
import { AttributeRow } from "../molecules/AttributeRow";
import { EmptyState } from "../molecules/EmptyState";
import { ComparisonStyles } from "./ComparisonStyles";

interface BeneficiosTableProps {
  plans: HealthPlan[];
  groupedAttributes: Record<string, string[]>;
  collapsedGroups: Set<string>;
  onToggleGroup: (groupName: string) => void;
  onRemovePlan: (planId: string) => void;
  getPlanAttributeValue: (plan: HealthPlan, attrName: string) => string;
}

export const BeneficiosTable = ({
  plans,
  groupedAttributes,
  collapsedGroups,
  onToggleGroup,
  onRemovePlan,
  getPlanAttributeValue,
}: BeneficiosTableProps) => {
  if (plans.length === 0) {
    return <EmptyState message="No hay planes seleccionados para comparar beneficios." />;
  }

  return (
    <div className="tabs-content-container">
      <style dangerouslySetInnerHTML={{ __html: ComparisonStyles }} />
      
      <div className="comparison-scroll-container">
        <table className="min-w-full table-fixed divide-y divide-border condensed-table">
          <thead className="sticky-header">
            <tr>
              <th scope="col" className="w-44 px-3 py-2 sticky-col corner-cell text-left text-xs font-semibold uppercase">
                Beneficio
              </th>
              {plans.map(plan => (
                <th key={plan._id} scope="col" className="min-w-[200px] border-l border-border">
                  <PlanHeader plan={plan} onRemovePlan={onRemovePlan} compact />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-background">
            {Object.entries(groupedAttributes).map(([groupName, attrNames]) => {
              const isCollapsed = collapsedGroups.has(groupName);
              
              return (
                <React.Fragment key={groupName}>
                  <AttributeGroupRow
                    groupName={groupName}
                    attributeCount={attrNames.length}
                    isCollapsed={isCollapsed}
                    colSpan={plans.length + 1}
                    onToggle={() => onToggleGroup(groupName)}
                  />
                  
                  {!isCollapsed && attrNames.map((attrName, index) => (
                    <AttributeRow
                      key={attrName}
                      attrName={attrName}
                      plans={plans}
                      index={index}
                      getPlanAttributeValue={getPlanAttributeValue}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
