import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/Skeleton";

const AnalyticsPageClient = dynamic(
  () =>
    import("@/features/analytics/AnalyticsPageClient").then(
      (mod) => mod.AnalyticsPageClient,
    ),
  {
    loading: () => (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    ),
  },
);

export default function AnalyticsPage() {
  return <AnalyticsPageClient />;
}
