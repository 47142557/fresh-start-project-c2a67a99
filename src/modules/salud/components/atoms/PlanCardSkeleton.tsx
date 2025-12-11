import { Skeleton } from "@/components/ui/skeleton";

interface PlanCardSkeletonProps {
  viewMode: "grid" | "list";
}

export const PlanCardSkeleton = ({ viewMode }: PlanCardSkeletonProps) => {
  
  // Vista Lista (Horizontal)
  if (viewMode === "list") {
    return (
      <div className="border border-slate-200 rounded-3xl p-4 bg-white shadow-sm flex items-center gap-4 h-32 animate-pulse">
        <Skeleton className="h-16 w-16 rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3 bg-slate-200 rounded-lg" />
          <Skeleton className="h-3 w-1/4 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-6 w-24 bg-slate-200 rounded-lg" />
            <Skeleton className="h-10 w-32 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  // Vista Grid (Vertical - Default)
  return (
    <div className="border border-slate-200 rounded-3xl p-5 bg-white shadow-sm animate-pulse flex flex-col h-full">
      {/* Header Logo */}
      <div className="h-24 flex items-center justify-center border-b border-slate-50 mb-4">
        <Skeleton className="h-10 w-32 bg-slate-100 rounded-lg" />
      </div>

      {/* Body */}
      <div className="space-y-4 flex-1">
        <div className="flex justify-between">
            <Skeleton className="h-6 w-1/2 bg-slate-200 rounded-lg" />
            <Skeleton className="h-6 w-16 bg-slate-100 rounded-lg" />
        </div>
        
        {/* Chips */}
        <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-6 w-20 bg-slate-50 rounded-md" />
            <Skeleton className="h-6 w-24 bg-slate-50 rounded-md" />
            <Skeleton className="h-6 w-16 bg-slate-50 rounded-md" />
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50">
            <Skeleton className="h-4 w-20 bg-slate-100 rounded mb-1" />
            <Skeleton className="h-8 w-32 bg-slate-200 rounded-lg" />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
            <Skeleton className="h-11 flex-1 bg-slate-200 rounded-xl" />
            <Skeleton className="h-11 w-14 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};