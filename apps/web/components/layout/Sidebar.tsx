"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Buildings,
  ChartLine,
  HardHat,
  SquaresFour,
  Swatches,
  Wrench,
} from "@phosphor-icons/react";

import { appNavItems } from "@/components/layout/nav";
import { cn } from "@/lib/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setMobileNavOpen,
  selectMobileNavOpen,
  selectSidebarOpen,
} from "@/store/slices/ui/uiSlice";

const icons = {
  Dashboard: SquaresFour,
  Jobs: Wrench,
  Agents: HardHat,
  Customers: Buildings,
  Analytics: ChartLine,
  "Design system": Swatches,
} as const;

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const mobileNavOpen = useAppSelector(selectMobileNavOpen);

  const nav = (
    <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 px-3 py-4">
      {appNavItems.map((item) => {
        const Icon = icons[item.label];
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => dispatch(setMobileNavOpen(false))}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-active text-white"
                : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground",
            )}
          >
            <Icon size={18} weight={active ? "fill" : "regular"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground hidden h-full shrink-0 flex-col border-r border-slate-800 lg:flex",
          sidebarOpen ? "w-60" : "w-[4.5rem]",
        )}
      >
        <div className="flex h-14 items-center border-b border-slate-800 px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="bg-accent text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold">
              OF
            </span>
            {sidebarOpen ? (
              <span className="text-sm font-semibold tracking-tight">
                OpsFlow
              </span>
            ) : null}
          </Link>
        </div>
        {nav}
        <div className="text-sidebar-muted border-t border-slate-800 px-4 py-3 text-xs">
          {sidebarOpen ? "Service operations POC" : "POC"}
        </div>
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => dispatch(setMobileNavOpen(false))}
          />
          <aside className="bg-sidebar text-sidebar-foreground shadow-soft relative z-10 flex h-full w-72 flex-col">
            <div className="flex h-14 items-center border-b border-slate-800 px-4">
              <span className="text-sm font-semibold tracking-tight">
                OpsFlow
              </span>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
