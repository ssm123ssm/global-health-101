import { syllabi, meta } from "@/lib/data";
import { mean } from "@/lib/scoring";
import { infoLevelBins, scoreBins, layer1Rows, layer2Rows } from "@/lib/aggregate";
import { PageHeader, StatCard, Section } from "@/components/ui";
import Distribution from "@/components/charts/Distribution";
import ProportionBars, { ProportionLegend } from "@/components/charts/ProportionBar";
import { C } from "@/lib/palette";

export default function Overview() {
  const usa = syllabi.filter((s) => s.country === "USA").length;
  const canada = syllabi.length - usa;
  const avgCov = mean(syllabi.map((s) => s.coverage));
  const avgFram = mean(syllabi.map((s) => s.framingDepth));
  const l1 = layer1Rows();
  const l2 = layer2Rows();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Health 101"
        lead="An analysis of 84 global health course syllabi from universities across the United States and Canada — measuring how each addresses colonial history, power and privilege, equity, and epistemic justice."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Syllabi analyzed" value={syllabi.length} sub={`${usa} USA · ${canada} Canada`} />
        <StatCard
          label="Avg. coverage"
          value={`${avgCov.toFixed(1)}/${meta.coverageMax}`}
          sub="Layer 1 — content present"
        />
        <StatCard
          label="Avg. framing depth"
          value={`${avgFram.toFixed(1)}/${meta.framingMax}`}
          sub="Layer 2 — decolonial framing"
        />
        <StatCard
          label="Fully detailed"
          value={syllabi.filter((s) => s.informationLevel === 5).length}
          sub="info level 5 of 5"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Information completeness" hint="Cumulative detail ladder (1–5)">
          <Distribution bins={infoLevelBins()} color={C.muted} yLabel="syllabi" />
        </Section>
        <Section title="Coverage score" hint={`Layer 1 — content topics present (0–${meta.coverageMax})`}>
          <Distribution bins={scoreBins((s) => s.coverage, meta.coverageMax)} color={C.primary} yLabel="syllabi" />
        </Section>
        <Section title="Framing depth score" hint={`Layer 2 — decolonial framing (0–${meta.framingMax})`}>
          <Distribution bins={scoreBins((s) => s.framingDepth, meta.framingMax)} color={C.accent} yLabel="syllabi" />
        </Section>
      </div>

      <Section
        title="Layer 1 — content coverage"
        hint="Share of syllabi that include each topic. Sorted by % Yes."
      >
        <div className="mb-4">
          <ProportionLegend />
        </div>
        <ProportionBars rows={l1} />
      </Section>

      <Section
        title="Layer 2 — depth of decolonial framing"
        hint="Share of syllabi meeting each advanced framing criterion."
      >
        <div className="mb-4">
          <ProportionLegend />
        </div>
        <ProportionBars rows={l2} />
      </Section>
    </div>
  );
}
