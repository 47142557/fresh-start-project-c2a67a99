import { HealthPlan } from "@/core/interfaces/plan/planes";
import { AttributeValue } from "../atoms/AttributeValue";

interface AttributeRowProps {
  attrName: string;
  plans: HealthPlan[];
  index: number;
  getPlanAttributeValue: (plan: HealthPlan, attrName: string) => string;
}

export const AttributeRow = ({ attrName, plans, index, getPlanAttributeValue }: AttributeRowProps) => (
  <tr className={index % 2 === 0 ? 'bg-background border-b border-border' : 'bg-muted/20 border-b border-border'}>
    <th scope="row" className="px-3 py-1.5 font-medium sticky-col text-left text-xs">
      {attrName}
    </th>
    {plans.map(plan => (
      <AttributeValue 
        key={`${plan._id}-${attrName}`} 
        value={getPlanAttributeValue(plan, attrName)} 
      />
    ))}
  </tr>
);
