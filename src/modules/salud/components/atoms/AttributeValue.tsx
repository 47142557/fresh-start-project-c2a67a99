import { PlanBadge } from './PlanBadge';

interface AttributeValueProps {
  value: string;
}

export const AttributeValue = ({ value }: AttributeValueProps) => (
  <td className="px-3 py-1.5 text-center border-l border-border">
    <PlanBadge value={value} />
  </td>
);
