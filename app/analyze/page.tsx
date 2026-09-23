"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { meta, syllabi } from "@/lib/data";
import { mean } from "@/lib/scoring";
import { categoryProfile, layer1Rows, layer2Rows } from "@/lib/aggregate";
import { PageHeader, Section, StatCard, TriToggle } from "@/components/ui";
import { C } from "@/lib/palette";
import type { Tri } from "@/lib/types";

// @visx/text measures label wrapping via the DOM, which differs between server
// and client — render the radar client-only to avoid a hydration mismatch.
const Radar = dynamic(() => import("@/components/charts/Radar"), {
  ssr: false,
  loading: () => <div style={{ height: 340 }} />,
});

const STORAGE_KEY = "gh101-analyze-v1";
const ALL_LAYER2 = meta.layer2Categories.flatMap((c) => c.questions);

const emptyRecord = (keys: { key: string }[]): Record<string, Tri> =>
  Object.fromEntries(keys.map((q) => [q.key, "nei" as Tri]));

function pctYes(row: { yes: number; no: number; nei: number }) {
  const total = row.yes + row.no + row.nei;
  return total ? Math.round((row.yes / total) * 100) : 0;
}

function QuestionRow({
  label,
  value,
  onChange,
  pct,
}: {
  label: string;
  value: Tri;
  onChange: (v: Tri) => void;
  pct: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-line/30 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-ink">{label}</div>
        <div className="text-xs text-muted">
          {pct}% of the {syllabi.length} syllabi in this dataset say yes
        </div>
      </div>
      <TriToggle value={value} onChange={onChange} />
    </div>
  );
}

export default function AnalyzePage() {
  const [label, setLabel] = useState("");
  const [layer1, setLayer1] = useState<Record<string, Tri>>(() => emptyRecord(meta.layer1));
  const [layer2, setLayer2] = useState<Record<string, Tri>>(() => emptyRecord(ALL_LAYER2));
  const [loaded, setLoaded] = useState(false);

  // Load any saved draft after mount — localStorage isn't available during prerender.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.label === "string") setLabel(saved.label);
        if (saved.layer1) setLayer1((prev) => ({ ...prev, ...saved.layer1 }));
        if (saved.layer2) setLayer2((prev) => ({ ...prev, ...saved.layer2 }));
      }
    } catch {
      // corrupt or blocked storage — just start fresh
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ label, layer1, layer2 }));
    } catch {
      // storage unavailable (private mode, quota, etc.) — answers just won't persist
    }
  }, [loaded, label, layer1, layer2]);

  const reset = () => {
    setLabel("");
    setLayer1(emptyRecord(meta.layer1));
    setLayer2(emptyRecord(ALL_LAYER2));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const coverage = useMemo(
    () => meta.layer1.reduce((n, q) => n + (layer1[q.key] === "yes" ? 1 : 0), 0),
    [layer1],
  );
  const framingByCategory = useMemo(
    () =>
      Object.fromEntries(
        meta.layer2Categories.map((c) => [
          c.key,
          c.questions.reduce((n, q) => n + (layer2[q.key] === "yes" ? 1 : 0), 0),
        ]),
      ) as Record<string, number>,
    [layer2],
  );
  const framingDepth = useMemo(
    () => Object.values(framingByCategory).reduce((a, b) => a + b, 0),
    [framingByCategory],
  );
  const userProfile = useMemo(
    () => meta.layer2Categories.map((c) => framingByCategory[c.key] / c.questions.length),
    [framingByCategory],
  );

  const datasetProfile = useMemo(() => categoryProfile(syllabi), []);
  const avgCoverage = useMemo(() => mean(syllabi.map((s) => s.coverage)), []);
  const avgFraming = useMemo(() => mean(syllabi.map((s) => s.framingDepth)), []);
  const coveragePctile = useMemo(
    () => Math.round((syllabi.filter((s) => s.coverage <= coverage).length / syllabi.length) * 100),
    [coverage],
  );
  const framingPctile = useMemo(
    () => Math.round((syllabi.filter((s) => s.framingDepth <= framingDepth).length / syllabi.length) * 100),
    [framingDepth],
  );

  const l1Pct = useMemo(() => {
    const rows = layer1Rows();
    return Object.fromEntries(meta.layer1.map((q, i) => [q.key, pctYes(rows[i])])) as Record<string, number>;
  }, []);
  const l2Pct = useMemo(() => {
    const rows = layer2Rows();
    return Object.fromEntries(ALL_LAYER2.map((q, i) => [q.key, pctYes(rows[i])])) as Record<string, number>;
  }, []);

  const axes = meta.layer2Categories.map((c) => c.title.split(" ").slice(0, 4).join(" "));
  const answered =
    meta.layer1.filter((q) => layer1[q.key] !== "nei").length +
    ALL_LAYER2.filter((q) => layer2[q.key] !== "nei").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analyze your syllabus"
        lead="Uses the same coding instrument applied to the 84 syllabi in this dataset. Answers are scored in the browser and discarded."
      />

      <Section
        title={label || "Your syllabus"}
        hint="Optional label, useful when comparing multiple syllabi."
      >
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. GH 210, Fall 2026"
            className="w-full max-w-xs rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={reset}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted ring-1 ring-line transition hover:text-ink"
          >
            Clear all answers
          </button>
          <span className="text-xs text-muted">{answered}/{meta.layer1.length + ALL_LAYER2.length} questions answered</span>
        </div>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Coverage"
          value={`${coverage}/${meta.coverageMax}`}
          sub={`dataset avg ${avgCoverage.toFixed(1)} · higher than ${coveragePctile}% of syllabi`}
        />
        <StatCard
          label="Framing depth"
          value={`${framingDepth}/${meta.framingMax}`}
          sub={`dataset avg ${avgFraming.toFixed(1)} · higher than ${framingPctile}% of syllabi`}
        />
        <StatCard label="Compared against" value={syllabi.length} sub="syllabi in this dataset" />
      </div>

      <Section title="Framing profile" hint="Category scores compared with the dataset average.">
        <Radar
          axes={axes}
          series={[
            { name: label || "Your syllabus", color: C.accent, values: userProfile },
            { name: "Dataset average", color: C.muted, values: datasetProfile },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: C.accent }} />
            {label || "Your syllabus"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: C.muted }} />
            Dataset average
          </span>
        </div>
      </Section>

      <Section title="Layer 1: content coverage" hint="Whether the syllabus includes each topic.">
        <div className="space-y-2">
          {meta.layer1.map((q) => (
            <QuestionRow
              key={q.key}
              label={q.label}
              value={layer1[q.key]}
              onChange={(v) => setLayer1((prev) => ({ ...prev, [q.key]: v }))}
              pct={l1Pct[q.key]}
            />
          ))}
        </div>
      </Section>

      {meta.layer2Categories.map((cat) => (
        <Section key={cat.key} title={cat.title} hint="Layer 2: depth of framing.">
          <div className="space-y-2">
            {cat.questions.map((q) => (
              <QuestionRow
                key={q.key}
                label={q.label}
                value={layer2[q.key]}
                onChange={(v) => setLayer2((prev) => ({ ...prev, [q.key]: v }))}
                pct={l2Pct[q.key]}
              />
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
