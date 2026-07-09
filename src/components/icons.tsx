import type { SVGProps } from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function DeckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 20V9l9-5 9 5v11" />
      <path d="M3 12.5h18M3 16.25h18" />
      <path d="M7.5 20V11M12 20v-9.5M16.5 20V11" />
    </svg>
  );
}

export function PorchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21V10l9-6 9 6v11" />
      <path d="M3 10h18" />
      <path d="M8 21v-6h8v6" />
      <path d="M8 15h8" />
    </svg>
  );
}

export function PatioIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M3 9.3h18M3 14.6h18M9 4v16M15 4v16" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} strokeWidth={2.4} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}

export function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12V4h8l9 9-8 8-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.4" />
    </svg>
  );
}

export const PROJECT_ICONS = {
  deck: DeckIcon,
  porch: PorchIcon,
  patio: PatioIcon,
} as const;
