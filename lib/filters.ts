import type { Syllabus } from "./types";

export const COUNTRIES = ["all", "USA", "Canada"] as const;
export const LEVELS = ["all", "Undergraduate", "Graduate", "Both"] as const;
export const INFO = [1, 2, 3, 4, 5] as const;

export interface FilterState {
  country: (typeof COUNTRIES)[number];
  level: (typeof LEVELS)[number];
  minInfo: (typeof INFO)[number];
}

export const DEFAULT_FILTERS: FilterState = { country: "all", level: "all", minInfo: 1 };

export const applyFilters = (rows: Syllabus[], f: FilterState) =>
  rows.filter(
    (s) =>
      (f.country === "all" || s.country === f.country) &&
      (f.level === "all" || s.courseLevel === f.level) &&
      s.informationLevel >= f.minInfo,
  );
