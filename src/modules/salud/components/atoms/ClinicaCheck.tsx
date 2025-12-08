import { Check, X } from "lucide-react";

interface ClinicaCheckProps {
  included: boolean;
}

export const ClinicaCheck = ({ included }: ClinicaCheckProps) => (
  <td className="px-3 py-1.5 text-center border-l border-border">
    {included ? (
      <Check className="h-4 w-4 text-success mx-auto" />
    ) : (
      <X className="h-4 w-4 text-destructive mx-auto" />
    )}
  </td>
);
