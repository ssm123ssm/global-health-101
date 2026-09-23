import { meta, syllabi } from "./data";
import { mean } from "./scoring";
import type { Syllabus, Tri } from "./types";
import type { TriRow } from "@/components/charts/ProportionBar";

export const countBy = <K extends string>(rows: Syllabus[], key: (r: Syllabus) => K) => {
  const m = new Map<K, number>();
  for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + 1);
  return m;
};

export const triRowsFor = (
  keys: { key: string; label: string }[],
  pick: (s: Syllabus) => Record<string, Tri>,
  rows: Syllabus[] = syllabi,
): TriRow[] =>
  keys.map(({ key, label }) => {
    const row: TriRow = { label, yes: 0, no: 0, nei: 0 };
    for (const s of rows) row[pick(s)[key]]++;
    return row;
  });

export const layer1Rows = (rows?: Syllabus[]) => triRowsFor(meta.layer1, (s) => s.layer1, rows);
export const layer2Rows = (rows?: Syllabus[]) =>
  triRowsFor(
    meta.layer2Categories.flatMap((c) => c.questions),
    (s) => s.layer2,
    rows,
  );

export const infoLevelBins = () => {
  const counts = countBy(syllabi, (s) => String(s.informationLevel));
  return [1, 2, 3, 4, 5].map((l) => ({ label: String(l), value: counts.get(String(l)) ?? 0 }));
};

export const scoreBins = (pick: (s: Syllabus) => number, maxVal: number) => {
  const counts = new Array(maxVal + 1).fill(0);
  for (const s of syllabi) counts[pick(s)]++;
  return counts.map((value, label) => ({ label: String(label), value }));
};

// Mean of a category's per-syllabus yes-count, normalized 0..1, for radar axes.
export const categoryProfile = (rows: Syllabus[]) =>
  meta.layer2Categories.map((c) =>
    mean(rows.map((s) => s.framingByCategory[c.key] / c.questions.length)),
  );
