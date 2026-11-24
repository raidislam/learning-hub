"use client";

import { Bookmark, ClipboardCheck, Code2, Database, FolderKanban, LayoutDashboard, Network, Server, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { TRACKS } from "@/lib/curriculum";
import { useSummary } from "@/lib/progress/hooks";
import { useProgress } from "@/lib/progress/store";
import { cn } from "@/lib/utilities/cn";
import type { TrackDef } from "@/types/curriculum";

const TRACK_ICON: Record<string, LucideIcon> = { core: Code2, frontend: LayoutDashboard, backend: Server, dsa: Network };

function NavLink({ href, icon: Icon, children, active, trailing }: { href: string; icon: LucideIcon; children: React.ReactNode; active: boolean; trailing?: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "bg-accent font-medium text-foreground" : "text-muted-fg hover:bg-card-2 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">{children}</span>
      {trailing}
    </Link>
  );
}

function TrackLink({ track, pathname }: { track: TrackDef; pathname: string }) {
  const s = useSummary(track);
  const hydrated = useProgress((x) => x.hydrated);
  const active = pathname === `/${track.slug}` || pathname.startsWith(`/${track.slug}/`);
  return (
    <div>
      <NavLink href={`/${track.slug}`} icon={TRACK_ICON[track.id]} active={active && pathname === `/${track.slug}`}>
        {track.shortTitle}
      </NavLink>
      {active && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
          {track.modules.map((m) => {
            const href = `/${track.slug}/${m.slug}`;
            const on = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={m.id} href={href} className={cn("block truncate rounded px-2 py-1 text-xs", on ? "text-primary" : "text-muted hover:text-foreground")}>
                {String(m.number).padStart(2, "0")} · {m.title}
              </Link>
            );
          })}
          {hydrated && s.written > 0 && <ProgressBar value={s.complete} max={s.written} className="mt-2" label={`${track.title} progress`} />}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const bookmarkCount = useProgress((s) => s.bookmarks.length);
  return (
    <nav aria-label="Main" className="flex h-full flex-col gap-1 overflow-y-auto p-3">
      <Link href="/dashboard" className="mb-3 flex items-center gap-2 px-3 py-2 text-base font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-mono text-xs font-bold text-primary-fg">JS</span>
        JS Learning Hub
      </Link>
      <NavLink href="/dashboard" icon={LayoutDashboard} active={pathname === "/dashboard"}>
        Dashboard
      </NavLink>
      <p className="mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Learn</p>
      {TRACKS.map((t) => (
        <TrackLink key={t.id} track={t} pathname={pathname} />
      ))}
      <p className="mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Practice</p>
      <NavLink href="/projects" icon={FolderKanban} active={pathname.startsWith("/projects")}>
        Projects
      </NavLink>
      <NavLink href="/assessments" icon={ClipboardCheck} active={pathname.startsWith("/assessments")}>
        Assessments
      </NavLink>
      <NavLink
        href="/bookmarks"
        icon={Bookmark}
        active={pathname.startsWith("/bookmarks")}
        trailing={bookmarkCount > 0 ? <span className="rounded-full bg-accent px-1.5 text-xs text-muted-fg">{bookmarkCount}</span> : null}
      >
        Bookmarks
      </NavLink>
      <div className="mt-auto flex items-center gap-2 px-3 pt-4 text-xs text-muted">
        <Database className="h-3.5 w-3.5" /> Progress এই browser এ সংরক্ষিত
      </div>
    </nav>
  );
}
