import type { Syllabus, Tri } from "./types";
import { meta } from "./data";

// Coverage = #yes across Layer 1 (0..11). FramingDepth = #yes across Layer 2 (0..18).
// `no` and `nei` both score 0. Denominators are fixed by the instrument, never hidden.

export const coveragePct = (s: Syllabus) => s.coverage / meta.coverageMax;
export const framingPct = (s: Syllabus) => s.framingDepth / meta.framingMax;

export const triCounts = (values: Tri[]) => {
  const c = { yes: 0, no: 0, nei: 0 };
  for (const v of values) c[v]++;
  return c;
};

export const mean = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;

export function groupBy<T, K extends string>(rows: T[], key: (r: T) => K) {
  const m = new Map<K, T[]>();
  for (const r of rows) {
    const k = key(r);
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}
