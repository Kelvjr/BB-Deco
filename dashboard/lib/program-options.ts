/** Canonical program names (public apply form). Keep in sync with `web/components/apply/constants.ts`. */
export const PROGRAM_CATALOG = [
  "Catering and Hospitality",
  "Pastry Arts",
  "Cake Making and Decorating",
  "Floral & Events Management",
] as const;

export type ProgramCatalogName = (typeof PROGRAM_CATALOG)[number];
