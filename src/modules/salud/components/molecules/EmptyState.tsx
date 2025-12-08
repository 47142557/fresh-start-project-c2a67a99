import { Search } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ message, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center h-full py-16 text-center text-muted-foreground">
    {icon || <Search className="w-10 h-10 mb-4" />}
    <p className="text-lg font-medium">{message}</p>
  </div>
);
