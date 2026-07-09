"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  PROJECTS,
  baseStartingPrice,
  computeStartingPrice,
  formatUSD,
  getProject,
  type Answers,
  type ProjectType,
  type Question,
} from "@/lib/estimator";
import {
  ArrowIcon,
  BackIcon,
  CheckIcon,
  PROJECT_ICONS,
  ShieldIcon,
  ClockIcon,
} from "@/components/icons";

type Phase = "select" | "configure";

/* Animated "Starting at" figure in the sticky price badge. */
function PriceCounter({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => formatUSD(v));
  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [value, mv, reduce]);
  return <motion.span>{text}</motion.span>;
}

export function Estimator() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("select");
  const [projectId, setProjectId] = useState<ProjectType["id"] | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [showContact, setShowContact] = useState(false);
  const [sent, setSent] = useState(false);

  const project = getProject(projectId);
  const price = useMemo(
    () => (project ? computeStartingPrice(project, answers) : 0),
    [project, answers],
  );

  function chooseProject(p: ProjectType) {
    setProjectId(p.id);
    setAnswers({ ...p.defaults });
    setPhase("configure");
    setSent(false);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() =>
        document.getElementById("estimator")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }

  function reset() {
    setPhase("select");
    setProjectId(null);
    setAnswers({});
    setShowContact(false);
    setSent(false);
    document.getElementById("estimator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggle(q: Question, optId: string) {
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.kind === "single") return { ...prev, [q.id]: [optId] };
      const nextSel = cur.includes(optId)
        ? cur.filter((v) => v !== optId)
        : [...cur, optId];
      return { ...prev, [q.id]: nextSel };
    });
  }

  return (
    <div id="estimator" className="scroll-mt-16">
      <AnimatePresence mode="wait">
        {phase === "select" ? (
          <ProjectPicker key="select" reduce={!!reduce} onChoose={chooseProject} />
        ) : (
          project && (
            <Configurator
              key="configure"
              project={project}
              answers={answers}
              price={price}
              onToggle={toggle}
              onBack={reset}
              onContinue={() => setShowContact(true)}
            />
          )
        )}
      </AnimatePresence>

      {/* Lead capture */}
      <AnimatePresence>
        {showContact && project && (
          <ContactModal
            project={project}
            answers={answers}
            price={price}
            sent={sent}
            onSent={() => setSent(true)}
            onClose={() => setShowContact(false)}
            onRestart={reset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- Project picker ---------------------------- */

function ProjectPicker({
  reduce,
  onChoose,
}: {
  reduce: boolean;
  onChoose: (p: ProjectType) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-5xl px-5 sm:px-8"
    >
      <div className="text-center">
        <p className="u-eyebrow text-[11px] text-brand">Step 1 · Your project</p>
        <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-[2.6rem]">
          What are you dreaming up?
        </h2>
        <p className="u-serif mx-auto mt-3 max-w-lg text-lg text-muted">
          Choose a starting point. You&apos;ll shape every detail on the next screen.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {PROJECTS.map((p, i) => {
          const Icon = PROJECT_ICONS[p.icon];
          return (
            <motion.button
              key={p.id}
              onClick={() => onChoose(p)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.06 * i, duration: 0.45 }}
              className="group flex flex-col overflow-hidden border border-hair bg-white text-left shadow-soft transition hover:border-brand hover:shadow-brand"
            >
              <span className="relative block h-44 w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={`Archadeck ${p.name} project`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={i === 0}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-blue/45 to-transparent" />
                <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center bg-white/95 text-blue shadow-soft">
                  <Icon className="h-6 w-6" />
                </span>
              </span>
              <span className="flex flex-1 flex-col p-5">
                <span className="text-xl font-semibold text-ink">{p.name}</span>
                <span className="u-serif mt-1 flex-1 text-sm text-muted">{p.tagline}</span>
                <span className="mt-4 flex items-center justify-between border-t border-hair pt-4">
                  <span>
                    <span className="u-eyebrow block text-[9px] text-muted">Starting at</span>
                    <span className="text-lg font-semibold text-blue">
                      {formatUSD(baseStartingPrice(p))}
                    </span>
                  </span>
                  <span className="u-eyebrow flex items-center gap-1.5 text-[10px] text-brand">
                    Configure <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ------------------------------ Configurator ----------------------------- */

function Configurator({
  project,
  answers,
  price,
  onToggle,
  onBack,
  onContinue,
}: {
  project: ProjectType;
  answers: Answers;
  price: number;
  onToggle: (q: Question, optId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const addonStep = project.steps.find((s) => s.kind === "multi");
  const selectedAddons = (addonStep ? answers[addonStep.id] ?? [] : [])
    .map((id) => addonStep!.options.find((o) => o.id === id)?.label)
    .filter(Boolean) as string[];

  // Human summary chips for the visual panel.
  const chips = useMemo(() => {
    const out: string[] = [];
    for (const step of project.steps) {
      if (step.kind === "multi") continue;
      const sel = answers[step.id]?.[0];
      const label = step.options.find((o) => o.id === sel)?.label;
      if (label && label !== "Not sure" && label !== "Not sure yet") out.push(label);
    }
    return out;
  }, [project, answers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      {/* Sticky price header */}
      <div className="sticky top-16 z-20 border-y border-hair bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <button
            onClick={onBack}
            className="u-eyebrow flex items-center gap-1.5 text-[11px] text-muted transition hover:text-blue"
          >
            <BackIcon className="h-4 w-4" /> All projects
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden text-lg font-semibold text-ink sm:block">
              {project.name}
            </span>
            <div className="bg-blue px-4 py-2 text-right text-white shadow-brand">
              <span className="u-eyebrow block text-[9px] text-white/80">Starting at</span>
              <span className="block text-lg font-semibold tabular-nums leading-tight">
                <PriceCounter value={price} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[5fr_4fr] lg:gap-12">
          {/* Left — visual */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-hair shadow-soft">
              <Image
                src={project.image}
                alt={`Archadeck ${project.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue/70 via-blue/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="u-eyebrow text-[10px] text-white/80">Your design</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <span
                      key={c}
                      className="bg-white/95 px-3 py-1 text-xs font-medium text-blue"
                    >
                      {c}
                    </span>
                  ))}
                  {selectedAddons.map((a) => (
                    <span
                      key={a}
                      className="border border-white/70 px-3 py-1 text-xs font-medium text-white"
                    >
                      + {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs italic leading-relaxed text-muted">
              Photo is illustrative. Final design, materials, and dimensions are
              confirmed with your designer based on your site.
            </p>
          </div>

          {/* Right — controls */}
          <div className="space-y-9">
            {project.steps.map((step) => (
              <ConfigSection
                key={step.id}
                step={step}
                selected={answers[step.id] ?? []}
                onToggle={(optId) => onToggle(step, optId)}
              />
            ))}

            <div className="border-t border-hair pt-7">
              <div className="flex items-baseline justify-between">
                <span className="u-eyebrow text-[10px] text-muted">Your estimate</span>
                <span className="text-3xl font-bold text-blue tabular-nums">
                  <PriceCounter value={price} />
                </span>
              </div>
              <p className="u-serif mt-1 text-right text-sm text-muted">
                Starting at · transparent, no obligation
              </p>
              <button
                onClick={onContinue}
                className="u-eyebrow mt-5 flex w-full items-center justify-center gap-2 bg-brand px-8 py-4 text-xs text-white shadow-brand transition hover:bg-brand-600"
              >
                Get my detailed estimate <ArrowIcon className="h-4 w-4" />
              </button>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4 text-brand" /> Under 2 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldIcon className="h-4 w-4 text-brand" /> No obligation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ConfigSection({
  step,
  selected,
  onToggle,
}: {
  step: Question;
  selected: string[];
  onToggle: (optId: string) => void;
}) {
  const isMulti = step.kind === "multi";
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h3 className="u-heading text-lg font-semibold text-ink">{step.section}</h3>
        {isMulti && <span className="text-xs text-muted">Optional</span>}
      </div>
      {step.helper && <p className="mt-1 text-sm text-muted">{step.helper}</p>}

      <div className={`mt-4 grid gap-2.5 ${isMulti ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
        {step.options.map((opt) => {
          const on = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onToggle(opt.id)}
              aria-pressed={on}
              className={`group flex items-center gap-3 border p-3.5 text-left transition ${
                on
                  ? "border-brand bg-brand/[0.06] shadow-soft"
                  : "border-hair bg-white hover:border-brand/60 hover:bg-wash"
              }`}
            >
              <span
                className={`flex h-5 w-5 flex-none items-center justify-center border transition ${
                  isMulti ? "" : "rounded-full"
                } ${
                  on
                    ? "border-brand bg-brand text-white"
                    : "border-[#c8d3db] bg-white text-transparent group-hover:border-brand"
                }`}
              >
                <CheckIcon className="h-3 w-3" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">{opt.label}</span>
                {opt.sublabel && (
                  <span className="mt-0.5 block text-xs leading-snug text-muted">
                    {opt.sublabel}
                  </span>
                )}
              </span>
              {isMulti && opt.min ? (
                <span className="text-xs font-semibold text-blue">+{formatUSD(opt.min)}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------ Contact modal ---------------------------- */

function ContactModal({
  project,
  answers,
  price,
  sent,
  onSent,
  onClose,
  onRestart,
}: {
  project: ProjectType;
  answers: Answers;
  price: number;
  sent: boolean;
  onSent: () => void;
  onClose: () => void;
  onRestart: () => void;
}) {
  const summary = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    for (const step of project.steps) {
      const sel = answers[step.id] ?? [];
      const labels = sel
        .map((id) => step.options.find((o) => o.id === id)?.label)
        .filter(Boolean) as string[];
      if (labels.length) rows.push({ label: step.section, value: labels.join(", ") });
    }
    return rows;
  }, [project, answers]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="relative w-full max-w-lg overflow-hidden bg-white shadow-brand"
      >
        {sent ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-brand text-white">
              <CheckIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-ink">You&apos;re all set</h3>
            <p className="u-serif mt-2 text-muted">
              A Chicagoland design consultant will reach out shortly with your
              detailed, itemized estimate for your {project.name.toLowerCase()}.
            </p>
            <button
              onClick={onRestart}
              className="u-eyebrow mt-6 bg-blue px-6 py-3 text-[11px] text-white transition hover:bg-blue-900"
            >
              Estimate another project
            </button>
          </div>
        ) : (
          <>
            <div className="bg-blue p-6 text-white sm:p-7">
              <p className="u-eyebrow text-[10px] text-white/75">
                {project.name} · your estimate
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="u-eyebrow text-[11px] text-white/80">Starting at</span>
                <span className="text-3xl font-bold tabular-nums">{formatUSD(price)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-white/75">
                {summary.map((r) => (
                  <span key={r.label}>
                    <span className="text-white/55">{r.label}:</span> {r.value}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 sm:p-7">
              <h3 className="text-lg font-semibold text-ink">
                Get it itemized down to the board
              </h3>
              <p className="u-serif mt-1 text-sm text-muted">
                A detailed written estimate and a free design consult — no pressure,
                no phone tag.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSent();
                }}
                className="mt-5 grid gap-3 sm:grid-cols-2"
              >
                <input
                  required
                  placeholder="Full name"
                  className="bg-field px-4 py-3 text-ink placeholder:text-[#8a8a8a] outline-none ring-brand focus:ring-2"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone"
                  className="bg-field px-4 py-3 text-ink placeholder:text-[#8a8a8a] outline-none ring-brand focus:ring-2"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="bg-field px-4 py-3 text-ink placeholder:text-[#8a8a8a] outline-none ring-brand focus:ring-2 sm:col-span-2"
                />
                <button
                  type="submit"
                  className="u-eyebrow bg-brand px-6 py-3.5 text-xs text-white shadow-brand transition hover:bg-brand-600 sm:col-span-2"
                >
                  Send my detailed estimate
                </button>
              </form>
              <button
                onClick={onClose}
                className="mt-3 w-full text-center text-sm text-muted underline-offset-4 transition hover:text-blue hover:underline"
              >
                Keep configuring
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
