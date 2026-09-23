"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { syllabi, meta } from "@/lib/data";
import { mean } from "@/lib/scoring";
import { categoryProfile } from "@/lib/aggregate";
import { PageHeader, Section, StatCard } from "@/components/ui";
import type { RadarSeries } from "@/components/charts/Radar";
import { C } from "@/lib/palette";

// @visx/text measures label wrapping via the DOM, which differs between server
// and client — render the radar client-only to avoid a hydration mismatch.
const Radar = dynamic(() => import("@/components/charts/Radar"), {
  ssr: false,
  loading: () => <div style={{ height: 340 }} />,
});

type Dim = "country" | "courseLevel";

const GROUPS: Record<Dim, { values: string[]; colors: string[] }> = {
  country: { values: ["USA", "Canada"], colors: [C.facets[0], C.facets[1]] },
  courseLevel: { values: ["Undergraduate", "Graduate", "Both"], colors: [C.facets[0], C.facets[1], C.facets[2]] },
};

export default function ComparePage() {
  const [dim, setDim] = useState<Dim>("country");
  const { values, colors } = GROUPS[dim];

  const groups = useMemo(
    () =>
      values.map((v, i) => {
        const rows = syllabi.filter((s) => s[dim] === v);
        return {
          name: v,
          color: colors[i],
          rows,
          coverage: mean(rows.map((r) => r.coverage)),
          framing: mean(rows.map((r) => r.framingDepth)),
          profile: categoryProfile(rows),
        };
      }),
    [dim, values, colors],
  );

  const series: RadarSeries[] = groups.map((g) => ({ name: g.name, color: g.color, values: g.profile }));
  const axes = meta.layer2Categories.map((c) => c.title.split(" ").slice(0, 4).join(" "));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comparisons"
        lead="How decolonization content differs between countries and between undergraduate and graduate courses."
      />

      <div className="flex gap-2">
        {(["country", "courseLevel"] as Dim[]).map((d) => (
          <button
            key={d}
            onClick={() => setDim(d)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              dim === d ? "bg-primary text-white" : "bg-white text-muted ring-1 ring-line hover:text-ink"
            }`}
          >
            {d === "country" ? "By country" : "By course level"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <StatCard
            key={g.name}
            label={g.name}
            value={`${g.rows.length}`}
            sub={`coverage ${g.coverage.toFixed(1)}/${meta.coverageMax} · framing ${g.framing.toFixed(1)}/${meta.framingMax}`}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Section title="Framing profile overlay" hint="Mean share of criteria met per category.">
          <Radar axes={axes} series={series} />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
            {series.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </Section>
        <Section title="Average scores" hint="Coverage (Layer 1) and framing depth (Layer 2).">
          <div className="space-y-5">
            {groups.map((g) => (
              <div key={g.name}>
                <div className="mb-1 text-sm font-medium text-ink">{g.name}</div>
                {[
                  { label: "Coverage", v: g.coverage, max: meta.coverageMax },
                  { label: "Framing", v: g.framing, max: meta.framingMax },
                ].map((b) => (
                  <div key={b.label} className="mb-1.5 flex items-center gap-3">
                    <span className="w-16 text-xs text-muted">{b.label}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full" style={{ width: `${(b.v / b.max) * 100}%`, background: g.color }} />
                    </div>
                    <span className="w-12 text-right text-xs font-semibold tabular-nums text-ink">
                      {b.v.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
