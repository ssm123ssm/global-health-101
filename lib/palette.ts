// Data answers: red = Yes (decolonized), blue = No, grey = NEI.
// Brand/metric chrome: blue (primary) + violet (accent) — never used for the Yes/No answers.
// Exception: /framing is themed red (see globals.css), since its metrics are the share of "Yes".
// Facets (country, course level) use their own qualitative hues, distinct from the answer colors.
export const C = {
  ink: "#1e293b",
  muted: "#64748b",
  faint: "#cbd5e1",
  line: "#e2e8f0",
  surface: "#ffffff",
  primary: "#1d4ed8", // blue — UI accent + coverage metric
  primarySoft: "#bfdbfe",
  accent: "#7c3aed", // violet — framing metric / secondary
  yes: "#be123c", // red — Yes / decolonized
  no: "#2563eb", // blue — No
  nei: "#cbd5e1", // neutral
  // Qualitative palette for faceting (country, course level).
  facets: ["#d97706", "#7c3aed", "#0d9488", "#0891b2"], // amber, violet, teal, cyan
} as const;

export const triColor = (t: "yes" | "no" | "nei") => C[t];
