import { Skeleton } from "@/components/ui/skeleton";

export const QuoteLoadingSkeleton = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative flex flex-col min-h-[550px]">
        <div className="px-8 pt-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-7 w-40 rounded-lg bg-slate-200" />
            <Skeleton className="h-6 w-6 rounded-full bg-slate-100" />
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <Skeleton className="h-full w-1/3 bg-slate-300" />
          </div>
        </div>
        <div className="p-8 flex-grow flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-slate-100" />
                <Skeleton className="h-4 w-1/2 bg-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-32 rounded-2xl bg-slate-50 border border-slate-100" />
              <Skeleton className="h-32 rounded-2xl bg-slate-50 border border-slate-100" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl bg-slate-50" />
          </div>
          <div className="mt-auto pt-6">
             <Skeleton className="h-14 w-full rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};