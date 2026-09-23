"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { syllabi, meta } from "@/lib/data";
import { categoryProfile, triRowsFor } from "@/lib/aggregate";
import { mean } from "@/lib/scoring";
import { PageHeader, Section } from "@/components/ui";
import { FilterBar, useSyllabusFilters } from "@/components/Filters";
import ProportionBars, { ProportionLegend } from "@/components/charts/ProportionBar";
import { C } from "@/lib/palette";

// @visx/text measures label wrapping via the DOM, which differs between server
// and client — render the radar client-only to avoid a hydration mismatch.
const Radar = dynamic(() => import("@/components/charts/Radar"), {
  ssr: false,
  loading: () => <div style={{ height: 340 }} />,
});

export default function FramingPage() {
  const { filters, setFilters, filtered } = useSyllabusFilters();
  const profile = useMemo(() => categoryProfile(filtered), [filtered]);
  const axes = meta.layer2Categories.map((c) => c.title);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Depth of decolonial framing"
        lead="Beyond whether a topic appears, Layer 2 asks how it is framed — across six dimensions of decolonial and equity-centered pedagogy."
      />

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        summary={`${filtered.length} of ${syllabi.length} syllabi`}
      />

      {filtered.length === 0 ? (
        <Section title="No matches" hint="">
          <p className="text-sm text-muted">No syllabi match the current filters.</p>
        </Section>
      ) : (
        <div data-theme="red" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Section title="Framing profile" hint="Mean share of criteria met per category (0–100%).">
              <Radar
                axes={axes.map((a) => a.split(" ").slice(0, 4).join(" "))}
                series={[{ name: "Filtered syllabi", color: C.yes, values: profile }]}
              />
            </Section>
            <Section title="Category strength" hint="Average % of sub-criteria met.">
              <ul className="space-y-3">
                {meta.layer2Categories.map((cat, i) => (
                  <li key={cat.key}>
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="text-sm text-ink">{cat.title}</span>
                      <span className="text-sm font-semibold tabular-nums text-primary">
                        {Math.round(profile[i] * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full" style={{ width: `${profile[i] * 100}%`, background: C.yes }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {meta.layer2Categories.map((cat) => (
            <Section
              key={cat.key}
              title={cat.title}
              hint={`Mean met: ${Math.round(
                mean(filtered.map((s) => s.framingByCategory[cat.key] / cat.questions.length)) * 100,
              )}% · ${cat.questions.length} criteria`}
            >
              <div className="mb-4">
                <ProportionLegend />
              </div>
              <ProportionBars rows={triRowsFor(cat.questions, (s) => s.layer2, filtered)} />
            </Section>
          ))}
        </div>
      )}
    </div>
  );
}
