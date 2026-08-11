import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/Skeleton";

const DashboardPageClient = dynamic(
  () =>
    import("@/features/analytics/DashboardPageClient").then(
      (mod) => mod.DashboardPageClient,
    ),
  {
    loading: () => (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    ),
  },
);

export default function DashboardPage() {
  return <DashboardPageClient />;
}
