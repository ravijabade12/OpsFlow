import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/Skeleton";

const DesignSystemPage = dynamic(
  () => import("./DesignSystemClient").then((mod) => mod.DesignSystemClient),
  {
    loading: () => (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
  },
);

export default function Page() {
  return <DesignSystemPage />;
}
