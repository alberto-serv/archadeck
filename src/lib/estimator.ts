// Estimator flow — reconstructed from the live priceguide.ai schema that powers
// archadeck.com/chicagoland/resources/pricing-estimator, with pricing preserved.
//
// Quotes are presented as a single "Starting at" figure = Σ(selected option min).
// The first "base" question in each branch carries the project's core price;
// later add-on options stack on top. Options with no min/max contribute nothing.
//
// Per product direction: no timeline questions; deck is size → material → add-ons.

export type Option = {
  id: string;
  label: string;
  sublabel?: string;
  min?: number;
  max?: number;
};

export type Question = {
  id: string;
  title: string;
  helper?: string;
  /** Short label for the configurator section heading. */
  section: string;
  kind: "single" | "multi";
  /** Marks the base price-driving question (size / type). */
  base?: boolean;
  options: Option[];
};

export type ProjectType = {
  id: "deck" | "porch" | "patio";
  name: string;
  tagline: string;
  icon: "deck" | "porch" | "patio";
  /** Real Archadeck project photo (public/). */
  image: string;
  /** Sensible defaults so the live price is never $0. */
  defaults: Record<string, string[]>;
  steps: Question[];
};

export const PROJECTS: ProjectType[] = [
  {
    id: "deck",
    name: "Deck",
    tagline: "Custom decks in wood, composite & PVC",
    icon: "deck",
    image: "/projects/deck.jpg",
    defaults: { "deck-size": ["medium"], "deck-material": ["composite"] },
    steps: [
      {
        id: "deck-size",
        section: "Size",
        title: "What size deck would you like?",
        helper: "A rough idea is perfect — we'll refine it together on-site.",
        kind: "single",
        base: true,
        options: [
          { id: "small", label: "Small", sublabel: "150–300 sq ft", min: 12000, max: 20000 },
          { id: "medium", label: "Medium", sublabel: "300–450 sq ft · most common", min: 20000, max: 40000 },
          { id: "large", label: "Large", sublabel: "450+ sq ft", min: 32000, max: 75000 },
          { id: "unsure", label: "Not sure yet", sublabel: "We'll help you size it", min: 20000, max: 75000 },
        ],
      },
      {
        id: "deck-material",
        section: "Material",
        title: "What decking material do you prefer?",
        kind: "single",
        options: [
          { id: "pt", label: "Pressure-treated wood", sublabel: "Classic & budget-friendly" },
          { id: "composite", label: "Composite + PVC", sublabel: "Low-maintenance, fade & stain resistant" },
          { id: "combo", label: "Composite / wood combination" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "deck-features",
        section: "Add-ons",
        title: "Would you like to add any of these features?",
        helper: "Optional — choose as many as you like.",
        kind: "multi",
        options: [
          { id: "lighting", label: "Outdoor lighting", sublabel: "Deck, post & step lights", min: 1200, max: 2500 },
          { id: "privacy", label: "Privacy screens or latticework", min: 800, max: 2200 },
          { id: "skirting", label: "Skirting", min: 1000, max: 6000 },
          { id: "pergola", label: "Pergola over the deck", min: 4000, max: 9500 },
        ],
      },
    ],
  },
  {
    id: "porch",
    name: "Porch",
    tagline: "Covered, screened & three-season rooms",
    icon: "porch",
    image: "/projects/porch.jpg",
    defaults: { "porch-type": ["screened"], "porch-size": ["medium"] },
    steps: [
      {
        id: "porch-type",
        section: "Type",
        title: "What type of porch are you considering?",
        kind: "single",
        base: true,
        options: [
          { id: "open", label: "Open / covered space", sublabel: "Roof, no walls", min: 32000, max: 65000 },
          { id: "screened", label: "Screened porch", sublabel: "Roof + screen walls", min: 32000, max: 65000 },
          { id: "sunroom", label: "Sunroom / three-season room", sublabel: "Window enclosure", min: 42000, max: 85000 },
          { id: "unsure", label: "Not sure yet", min: 20000, max: 85000 },
        ],
      },
      {
        id: "porch-size",
        section: "Size",
        title: "Roughly how big do you want it?",
        helper: "An estimate is fine — we'll measure precisely on-site.",
        kind: "single",
        options: [
          { id: "small", label: "Small", sublabel: "Under 150 sq ft" },
          { id: "medium", label: "Medium", sublabel: "150–250 sq ft · most common" },
          { id: "large", label: "Large", sublabel: "250–400 sq ft" },
          { id: "xl", label: "Extra large", sublabel: "400+ sq ft" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "porch-addons",
        section: "Add-ons",
        title: "Any add-ons you'd like to consider?",
        helper: "Optional — pick any that appeal to you.",
        kind: "multi",
        options: [
          { id: "lighting", label: "Lighting, ceiling fans & outlets", min: 2500, max: 5000 },
          { id: "electrical", label: "Electrical upgrades", min: 2000, max: 6000 },
          { id: "fireplace", label: "Built-in fireplace or fire feature", min: 15000, max: 35000 },
          { id: "kitchen", label: "Outdoor kitchen or bar", min: 8000, max: 25000 },
        ],
      },
    ],
  },
  {
    id: "patio",
    name: "Patio & Hardscape",
    tagline: "Pavers, natural stone & outdoor living",
    icon: "patio",
    image: "/projects/patio.jpg",
    defaults: {
      "patio-project": ["patio"],
      "patio-size": ["medium"],
      "patio-material": ["paver"],
    },
    steps: [
      {
        id: "patio-project",
        section: "Type",
        title: "What type of project do you need?",
        helper: "Choose one or both.",
        kind: "multi",
        base: true,
        options: [
          { id: "patio", label: "Patio installation", min: 8000, max: 20000 },
          { id: "retaining", label: "Retaining wall", sublabel: "If your yard is elevated", min: 4000, max: 20000 },
          { id: "unsure", label: "Not sure", min: 5000, max: 15000 },
        ],
      },
      {
        id: "patio-size",
        section: "Size",
        title: "What size is your project area?",
        kind: "single",
        options: [
          { id: "medium", label: "Medium", sublabel: "100–300 sq ft · most common" },
          { id: "large", label: "Large", sublabel: "350–500 sq ft" },
          { id: "xl", label: "Extra large", sublabel: "500+ sq ft" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "patio-material",
        section: "Material",
        title: "What material would you like?",
        kind: "single",
        options: [
          { id: "paver", label: "Paver patio", sublabel: "Modern concrete pavers" },
          { id: "brick", label: "Brick pavers", sublabel: "Traditional" },
          { id: "stone", label: "Natural stone", sublabel: "Flagstone, bluestone" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "patio-addons",
        section: "Add-ons",
        title: "Any add-ons you'd like to consider?",
        helper: "Optional — build out your outdoor living space.",
        kind: "multi",
        options: [
          { id: "firepit", label: "Fire pit", min: 2000, max: 6000 },
          { id: "kitchen", label: "Outdoor kitchen", min: 8000, max: 40000 },
          { id: "pergola", label: "Pergola over the patio", min: 5000, max: 12000 },
          { id: "lighting", label: "Outdoor lighting", min: 1200, max: 3500 },
          { id: "seating", label: "Built-in seating walls", min: 2000, max: 10000 },
          { id: "walkway", label: "Walkway or path", min: 3500, max: 10000 },
          { id: "steps", label: "Outdoor steps", sublabel: "Between levels", min: 1500, max: 5000 },
        ],
      },
    ],
  },
];

export type Answers = Record<string, string[]>;

export function getProject(id: string | null): ProjectType | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Running "starting at" total for a project given current answers. */
export function computeStartingPrice(project: ProjectType, answers: Answers): number {
  let low = 0;
  for (const step of project.steps) {
    const selected = answers[step.id] ?? [];
    for (const opt of step.options) {
      if (selected.includes(opt.id) && opt.min) low += opt.min;
    }
  }
  return low;
}

/**
 * Entry price shown on the picker cards. Anchored to the project's primary
 * offering — the first base option (e.g. a patio install, not the cheaper
 * retaining wall) — rather than the absolute cheapest line item.
 */
export function baseStartingPrice(project: ProjectType): number {
  const base = project.steps.find((s) => s.base);
  if (!base) return 0;
  const primary = base.options.find((o) => o.min);
  return primary?.min ?? 0;
}

export function formatUSD(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}
