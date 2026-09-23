export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="card p-5">
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-ink">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function Section({
  title,
  hint,
  children,
  className = "",
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-5 ${className}`}>
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-muted">{lead}</p>
    </div>
  );
}

export function Pill({ children, tone = "muted" }: { children: React.ReactNode; tone?: "yes" | "no" | "nei" | "muted" }) {
  const tones = {
    yes: "bg-rose-50 text-rose-700 ring-rose-600/20",
    no: "bg-blue-50 text-blue-700 ring-blue-600/20",
    nei: "bg-slate-100 text-slate-500 ring-slate-400/20",
    muted: "bg-slate-100 text-slate-600 ring-slate-400/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}

const TRI_OPTIONS: { v: "yes" | "nei" | "no"; label: string }[] = [
  { v: "yes", label: "Yes" },
  { v: "nei", label: "Not sure" },
  { v: "no", label: "No" },
];

const TRI_ACTIVE = {
  yes: "bg-rose-600 text-white ring-rose-600",
  no: "bg-blue-600 text-white ring-blue-600",
  nei: "bg-slate-500 text-white ring-slate-500",
};

export function TriToggle({
  value,
  onChange,
}: {
  value: "yes" | "no" | "nei";
  onChange: (v: "yes" | "no" | "nei") => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      {TRI_OPTIONS.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition ${
            value === o.v ? TRI_ACTIVE[o.v] : "bg-white text-muted ring-line hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
