import type { ReactNode } from "react";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-dvh items-stretch">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <Header title={title} description={description} />
        {actions ? (
          <div className="border-border bg-surface flex flex-wrap items-center gap-2 border-b px-4 py-3 md:px-6">
            {actions}
          </div>
        ) : null}
        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  );
}
