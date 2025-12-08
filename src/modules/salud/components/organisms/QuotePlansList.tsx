import { QuotePlanCard } from "../molecules/QuotePlanCard";

interface Plan {
  id: string;
  name: string;
  empresa: string;
  precio: number;
}

interface QuotePlansListProps {
  plans: Plan[];
}

export const QuotePlansList = ({ plans }: QuotePlansListProps) => (
  <>
    <h2 className="text-lg font-semibold mb-4">Planes comparados</h2>
    <div className="grid gap-4 mb-8">
      {plans.map((plan, idx) => (
        <QuotePlanCard
          key={plan.id || idx}
          name={plan.name}
          empresa={plan.empresa}
          precio={plan.precio}
        />
      ))}
    </div>
  </>
);
