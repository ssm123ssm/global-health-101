import { C } from "@/lib/palette";

export interface TriRow {
  label: string;
  yes: number;
  no: number;
  nei: number;
}

const total = (r: TriRow) => r.yes + r.no + r.nei;

export function ProportionLegend() {
  const items: [string, string][] = [
    ["Yes", C.yes],
    ["Not enough info", C.nei],
    ["No", C.no],
  ];
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted">
      {items.map(([l, c]) => (
        <span key={l} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
          {l}
        </span>
      ))}
    </div>
  );
}

export default function ProportionBars({ rows }: { rows: TriRow[] }) {
  const sorted = [...rows].sort((a, b) => b.yes / total(b) - a.yes / total(a));
  return (
    <div className="space-y-3">
      {sorted.map((r) => {
        const t = total(r);
        const pct = (n: number) => (t ? (n / t) * 100 : 0);
        return (
          <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="min-w-0">
              <div className="mb-1 truncate text-sm text-ink" title={r.label}>
                {r.label}
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-line">
                <span style={{ width: `${pct(r.yes)}%`, background: C.yes }} />
                <span style={{ width: `${pct(r.nei)}%`, background: C.nei }} />
                <span style={{ width: `${pct(r.no)}%`, background: C.no }} />
              </div>
            </div>
            <div className="w-12 text-right text-sm font-semibold tabular-nums text-primary">
              {Math.round(pct(r.yes))}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
