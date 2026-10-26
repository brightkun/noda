"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Home, Network, Plus } from "lucide-react";
import { useReviewToday } from "@/entities/card";
import { NoteSearchInput, TagFilter } from "@/features/filter-notes";
import { ThemeToggle } from "@/features/toggle-theme";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { NoteList } from "./NoteList";

const NAV_ITEMS = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/review", label: "Повторение", icon: BrainCircuit },
  { href: "/graph", label: "Граф", icon: Network },
] as const;

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: dueCards } = useReviewToday();
  const dueCount = dueCards?.length ?? 0;

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="rounded-md text-lg font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Noda
        </Link>
        <ThemeToggle />
      </div>

      <Link
        href="/notes/new"
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        <Plus aria-hidden />
        Новая заметка
      </Link>

      <nav aria-label="Разделы">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-md px-2.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                  {label}
                  {href === "/review" && dueCount > 0 && (
                    <span
                      aria-label={`К повторению: ${dueCount}`}
                      className="ml-auto rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground tabular-nums"
                    >
                      {dueCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3">
        <NoteSearchInput />
        <TagFilter />
      </div>

      <NoteList />
    </aside>
  );
};
