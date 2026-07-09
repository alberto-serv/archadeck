"use client";

import { useEffect, useMemo, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  formatUSD,
  type Answers,
  type ProjectType,
} from "@/lib/estimator";
import { ClockIcon, ShieldIcon, TagIcon } from "@/components/icons";

function Counter({ value, delay = 0 }: { value: number; delay?: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const rounded = useTransform(mv, (v) => formatUSD(v));
  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 1.1,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, delay, mv, reduce]);
  return <motion.span>{rounded}</motion.span>;
}

/** Human-readable summary of the selections. */
function useSummary(project: ProjectType, answers: Answers) {
  return useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    for (const step of project.steps) {
      const sel = answers[step.id] ?? [];
      if (!sel.length) continue;
      const labels = sel
        .map((id) => step.options.find((o) => o.id === id)?.label)
        .filter(Boolean)
        .filter((l) => l !== "None of these for now");
      if (!labels.length) continue;
      rows.push({ label: step.title.replace(/\?$/, ""), value: labels.join(", ") });
    }
    return rows;
  }, [project, answers]);
}

export function PriceReveal({
  project,
  answers,
  estimate,
  onRestart,
}: {
  project: ProjectType;
  answers: Answers;
  estimate: { low: number; high: number };
  onRestart: () => void;
}) {
  const summary = useSummary(project, answers);
  const [sent, setSent] = useState(false);

  return (
    <div>
      <p className="u-eyebrow text-[11px] text-brand">Your instant estimate</p>
      <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-[2rem]">
        Your {project.name.toLowerCase()} project
      </h2>

      {/* The number */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 border border-hair bg-gradient-to-br from-white to-wash p-7 shadow-soft sm:p-9"
      >
        <span className="u-eyebrow flex items-center gap-2 text-[10px] text-muted">
          <TagIcon className="h-4 w-4 text-brand" /> Transparent price range
        </span>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-4xl font-bold text-blue tabular-nums sm:text-6xl">
            <Counter value={estimate.low} />
          </span>
          <span className="text-2xl font-light text-muted sm:text-4xl">–</span>
          <span className="text-4xl font-bold text-blue tabular-nums sm:text-6xl">
            <Counter value={estimate.high} delay={0.12} />
          </span>
        </div>
        <p className="u-serif mt-3 max-w-md text-sm text-muted">
          A ballpark based on what you told us. Your dedicated designer will
          refine every detail — free, with no obligation.
        </p>
      </motion.div>

      {/* Trust row */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: ShieldIcon, t: "No-obligation", d: "Nothing owed, ever" },
          { icon: ClockIcon, t: "Under 2 minutes", d: "You just finished" },
          { icon: TagIcon, t: "Transparent", d: "Real Chicagoland pricing" },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="flex items-center gap-3 border border-hair bg-white px-4 py-3">
            <Icon className="h-5 w-5 flex-none text-brand" />
            <span>
              <span className="block text-sm font-semibold text-ink">{t}</span>
              <span className="block text-xs text-muted">{d}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      {summary.length > 0 && (
        <div className="mt-4 border border-hair bg-white">
          <p className="u-eyebrow border-b border-hair px-5 py-3 text-[10px] text-muted">
            Your selections
          </p>
          <dl className="divide-y divide-hair">
            {summary.map((row) => (
              <div key={row.label} className="flex gap-4 px-5 py-3 text-sm">
                <dt className="w-2/5 flex-none text-muted">{row.label}</dt>
                <dd className="flex-1 font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Contact capture */}
      <div className="mt-4 border border-brand bg-blue p-6 text-white sm:p-8">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold">You're all set 🎉</h3>
            <p className="u-serif mt-2 text-white/80">
              A Chicagoland design consultant will reach out shortly with your
              detailed, itemized estimate.
            </p>
            <button
              onClick={onRestart}
              className="u-eyebrow mt-5 bg-white px-6 py-3 text-[11px] text-blue transition hover:bg-white/90"
            >
              Estimate another project
            </button>
          </motion.div>
        ) : (
          <>
            <h3 className="text-xl font-semibold sm:text-2xl">
              Want it itemized down to the board?
            </h3>
            <p className="u-serif mt-2 text-white/80">
              Get a detailed written estimate and a free design consult — no
              pressure, no phone tag.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-5 grid gap-3 sm:grid-cols-2"
            >
              <input
                required
                placeholder="Full name"
                className="col-span-1 bg-white px-4 py-3 text-ink placeholder:text-[#8a8a8a] outline-none ring-brand focus:ring-2"
              />
              <input
                required
                type="tel"
                placeholder="Phone"
                className="col-span-1 bg-white px-4 py-3 text-ink placeholder:text-[#8a8a8a] outline-none ring-brand focus:ring-2"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="col-span-1 bg-white px-4 py-3 text-ink placeholder:text-[#8a8a8a] outline-none ring-brand focus:ring-2 sm:col-span-2"
              />
              <button
                type="submit"
                className="u-eyebrow col-span-1 bg-brand px-6 py-3.5 text-xs text-white shadow-brand transition hover:bg-brand-600 sm:col-span-2"
              >
                Send my detailed estimate
              </button>
            </form>
            <button
              onClick={onRestart}
              className="mt-4 text-sm text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              Start over
            </button>
          </>
        )}
      </div>
    </div>
  );
}
