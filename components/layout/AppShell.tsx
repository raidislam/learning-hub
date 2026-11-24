"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SearchDialog } from "@/components/navigation/SearchDialog";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-border bg-card shadow-xl">
            <button onClick={() => setOpen(false)} aria-label="Menu বন্ধ করুন" className="absolute right-3 top-3 rounded-md p-1.5 text-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur">
          <button onClick={() => setOpen(true)} aria-label="Menu খুলুন" className="rounded-md p-1.5 text-muted-fg hover:text-foreground lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="font-semibold lg:hidden">
            JS Hub
          </Link>
          <div className="flex-1" />
          <SearchDialog />
          <ThemeToggle />
        </header>
        <main id="main" className="px-4 py-8 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
