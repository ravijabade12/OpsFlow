"use client";

import { List, SidebarSimple } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setMobileNavOpen,
  toggleSidebar,
  selectSidebarOpen,
} from "@/store/slices/ui/uiSlice";

export function Header({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  return (
    <header className="border-border bg-surface/95 sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={() => dispatch(setMobileNavOpen(true))}
        >
          <List size={18} weight="bold" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => dispatch(toggleSidebar())}
        >
          <SidebarSimple size={18} weight="bold" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-foreground truncate text-base font-semibold tracking-tight md:text-lg">
            {title}
          </h1>
          {description ? (
            <p className="text-muted truncate text-xs md:text-sm">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
