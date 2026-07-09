// Estimator flow — reconstructed from the live priceguide.ai schema that powers
// archadeck.com/chicagoland/resources/pricing-estimator, with pricing preserved.
// Estimate math: low = Σ(selected option min), high = Σ(selected option max).
// The first "base" question in each branch carries the project's core price range;
// later add-on options stack on top. Options with no min/max contribute nothing.

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
  kind: "single" | "multi";
  /** Marks the base price-driving question (size / type). */
  base?: boolean;
  options: Option[];
};

export type ProjectType = {
  id: "deck" | "porch" | "patio";
  name: string;
  tagline: string;
  /** Headline range shown on the picker card. */
  range: [number, number];
  icon: "deck" | "porch" | "patio";
  /** Real Archadeck project photo (public/). */
  image: string;
  steps: Question[];
};

const timeline = (id: string, midLabel = "Within the next 6 months"): Question => ({
  id,
  title: "When would you ideally like this done?",
  helper: "This just helps us plan — it never changes your estimate.",
  kind: "single",
  options: [
    { id: "asap", label: "As soon as possible" },
    { id: "6mo", label: midLabel },
    { id: "year", label: "Within the next year" },
    { id: "future", label: "Not sure / future project" },
  ],
});

export const PROJECTS: ProjectType[] = [
  {
    id: "deck",
    name: "Deck",
    tagline: "Custom decks in wood, composite & PVC",
    range: [12000, 95200],
    icon: "deck",
    image: "/projects/deck.jpg",
    steps: [
      {
        id: "deck-size",
        title: "What size deck would you like?",
        helper: "A rough idea is perfect — we'll refine it together later.",
        kind: "single",
        base: true,
        options: [
          { id: "small", label: "Small", sublabel: "150–300 sq ft", min: 12000, max: 20000 },
          { id: "medium", label: "Medium", sublabel: "300–450 sq ft · most common", min: 20000, max: 40000 },
          { id: "large", label: "Large", sublabel: "450+ sq ft", min: 32000, max: 75000 },
          { id: "unsure", label: "I'm not sure yet", sublabel: "We'll help you size it", min: 20000, max: 75000 },
        ],
      },
      {
        id: "deck-new",
        title: "Is this a new deck or replacing an existing one?",
        kind: "single",
        options: [
          { id: "new", label: "A brand-new deck" },
          { id: "redeck", label: "Replacing existing deck boards", sublabel: "Redecking" },
          { id: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "deck-material",
        title: "What decking material do you prefer?",
        kind: "single",
        options: [
          { id: "pt", label: "Pressure-treated wood", sublabel: "Classic & budget-friendly" },
          { id: "composite", label: "Low-maintenance composite + PVC", sublabel: "Fade & stain resistant" },
          { id: "combo", label: "Low-maintenance / wood combination" },
          { id: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "deck-height",
        title: "How high will your deck be off the ground?",
        kind: "single",
        options: [
          { id: "ground", label: "Ground-level", sublabel: "No stairs needed" },
          { id: "raised", label: "Raised", sublabel: "Less than 6′ above grade" },
          { id: "multi", label: "Multi-level or on a slope", sublabel: "Elevated more than 6′" },
          { id: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "deck-features",
        title: "Would you like to add any of these features?",
        helper: "Select any that interest you — choose as many as you like.",
        kind: "multi",
        options: [
          { id: "lighting", label: "Outdoor lighting", sublabel: "Deck, post & step lights", min: 1200, max: 2500 },
          { id: "privacy", label: "Privacy screens or latticework", min: 800, max: 2200 },
          { id: "skirting", label: "Skirting", min: 1000, max: 6000 },
          { id: "pergola", label: "Pergola over the deck", min: 4000, max: 9500 },
          { id: "none", label: "None of these for now" },
        ],
      },
      timeline("deck-timeline"),
    ],
  },
  {
    id: "porch",
    name: "Porch",
    tagline: "Covered, screened & three-season rooms",
    range: [20000, 156000],
    icon: "porch",
    image: "/projects/porch.jpg",
    steps: [
      {
        id: "porch-type",
        title: "What type of porch are you considering?",
        kind: "single",
        base: true,
        options: [
          { id: "open", label: "Open / covered space", sublabel: "Roof, no walls", min: 32000, max: 65000 },
          { id: "screened", label: "Screened porch", sublabel: "Roof + screen walls", min: 32000, max: 65000 },
          { id: "sunroom", label: "Sunroom / three-season room", sublabel: "Window enclosure", min: 42000, max: 85000 },
          { id: "unsure", label: "I'm not sure yet", min: 20000, max: 85000 },
        ],
      },
      {
        id: "porch-size",
        title: "Roughly how big do you want it?",
        helper: "An estimate is fine — we'll measure precisely on-site.",
        kind: "single",
        options: [
          { id: "small", label: "Small", sublabel: "Under 150 sq ft" },
          { id: "medium", label: "Medium", sublabel: "150–250 sq ft · most common" },
          { id: "large", label: "Large", sublabel: "250–400 sq ft" },
          { id: "xl", label: "Extra large", sublabel: "400+ sq ft" },
          { id: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "porch-addons",
        title: "Any add-ons you'd like to consider?",
        helper: "Optional extras — pick any that appeal to you.",
        kind: "multi",
        options: [
          { id: "lighting", label: "Lighting, ceiling fans & outlets", min: 2500, max: 5000 },
          { id: "electrical", label: "Electrical upgrades", min: 2000, max: 6000 },
          { id: "fireplace", label: "Built-in fireplace or fire feature", min: 15000, max: 35000 },
          { id: "kitchen", label: "Outdoor kitchen or bar", min: 8000, max: 25000 },
          { id: "none", label: "None of these for now" },
        ],
      },
      timeline("porch-timeline"),
    ],
  },
  {
    id: "patio",
    name: "Patio & Hardscape",
    tagline: "Pavers, natural stone & outdoor living",
    range: [5200, 141500],
    icon: "patio",
    image: "/projects/patio.jpg",
    steps: [
      {
        id: "patio-project",
        title: "What type of project do you need?",
        helper: "Choose one or both.",
        kind: "multi",
        base: true,
        options: [
          { id: "patio", label: "Patio installation", min: 8000, max: 20000 },
          { id: "retaining", label: "Retaining wall", sublabel: "If your yard is elevated", min: 4000, max: 20000 },
          { id: "unsure", label: "I'm not sure", min: 5000, max: 15000 },
        ],
      },
      {
        id: "patio-size",
        title: "What size is your project area?",
        kind: "single",
        options: [
          { id: "medium", label: "Medium", sublabel: "100–300 sq ft · most common" },
          { id: "large", label: "Large", sublabel: "350–500 sq ft" },
          { id: "xl", label: "Extra large", sublabel: "500+ sq ft" },
          { id: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "patio-material",
        title: "What material would you like?",
        kind: "single",
        options: [
          { id: "paver", label: "Paver patio", sublabel: "Modern concrete pavers" },
          { id: "brick", label: "Pavers", sublabel: "Traditional brick" },
          { id: "stone", label: "Natural stone", sublabel: "Flagstone, bluestone" },
          { id: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "patio-addons",
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
      timeline("patio-timeline", "Within 6 months"),
    ],
  },
];

export type Answers = Record<string, string[]>;

export function getProject(id: string | null): ProjectType | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Compute the running low/high estimate for a project given current answers. */
export function computeEstimate(
  project: ProjectType,
  answers: Answers,
): { low: number; high: number } {
  let low = 0;
  let high = 0;
  for (const step of project.steps) {
    const selected = answers[step.id] ?? [];
    for (const opt of step.options) {
      if (selected.includes(opt.id) && (opt.min || opt.max)) {
        low += opt.min ?? 0;
        high += opt.max ?? 0;
      }
    }
  }
  return { low, high };
}

export function formatUSD(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}
