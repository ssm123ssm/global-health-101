"use client";

import { useMemo, useState } from "react";
import { syllabi } from "@/lib/data";
import {
  COUNTRIES,
  LEVELS,
  INFO,
  DEFAULT_FILTERS,
  applyFilters,
  type FilterState,
} from "@/lib/filters";
import { Section } from "@/components/ui";

const chip = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    active ? "bg-primary text-white" : "bg-white text-muted ring-1 ring-line hover:text-ink"
  }`;

export function FilterGroup<T extends string | number>({
  label,
  options,
  value,
  render = (o) => String(o),
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  render?: (o: T) => string;
  onChange: (v: T) => void;
}) {
  return (
    <div className="min-w-[150px]">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button key={String(o)} onClick={() => onChange(o)} className={chip(value === o)}>
            {render(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function useSyllabusFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const filtered = useMemo(() => applyFilters(syllabi, filters), [filters]);
  return { filters, setFilters, filtered };
}

export function FilterBar({
  filters,
  setFilters,
  summary,
  children,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  summary?: string;
  children?: React.ReactNode;
}) {
  const set = (patch: Partial<FilterState>) => setFilters({ ...filters, ...patch });
  return (
    <Section title="Filters" hint={summary}>
      <div className="flex flex-wrap gap-x-8 gap-y-5">
        {children}
        <FilterGroup
          label="Country"
          options={COUNTRIES}
          value={filters.country}
          onChange={(c) => set({ country: c })}
          render={(c) => (c === "all" ? "All" : c)}
        />
        <FilterGroup
          label="Course level"
          options={LEVELS}
          value={filters.level}
          onChange={(l) => set({ level: l })}
          render={(l) => (l === "all" ? "All" : l)}
        />
        <FilterGroup
          label="Min. info level"
          options={INFO}
          value={filters.minInfo}
          onChange={(n) => set({ minInfo: n })}
          render={(n) => (n === 1 ? "All" : `${n}+`)}
        />
      </div>
    </Section>
  );
}
