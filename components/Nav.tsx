"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Radar, GitCompare, ClipboardCheck } from "lucide-react";

const LINKS = [
  { href: "/", label: "Overview", icon: BarChart3 },
  { href: "/framing", label: "Framing", icon: Radar },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/analyze", label: "Analyze your syllabus", icon: ClipboardCheck },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-5 py-3">
        <Link href="/" className="mr-4 flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-ink bg-white text-xs font-bold text-ink">
            GH
          </span>
          <span className="hidden sm:inline">Global Health 101</span>
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active ? "bg-primary text-white" : "text-muted hover:bg-line/60 hover:text-ink"
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
