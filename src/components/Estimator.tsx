"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  PROJECTS,
  computeEstimate,
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
} from "@/components/icons";
import { PriceReveal } from "@/components/PriceReveal";

type Phase = "select" | "quiz" | "result";

export function Estimator() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("select");
  const [projectId, setProjectId] = useState<ProjectType["id"] | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);

  const project = getProject(projectId);
  const steps = project?.steps ?? [];
  const step = steps[stepIndex];

  const estimate = useMemo(
    () => (project ? computeEstimate(project, answers) : { low: 0, high: 0 }),
    [project, answers],
  );

  // Total dots across the whole flow (project pick counts as step 1).
  const totalDots = (project?.steps.length ?? 0) + 1;
  const activeDot = phase === "select" ? 0 : stepIndex + 1;

  function go(next: number) {
    setDirection(next > 0 ? 1 : -1);
  }

  function chooseProject(id: ProjectType["id"]) {
    go(1);
    setProjectId(id);
    setAnswers({});
    setStepIndex(0);
    setPhase("quiz");
  }

  function isSelected(q: Question, optId: string) {
    return (answers[q.id] ?? []).includes(optId);
  }

  function toggle(q: Question, optId: string) {
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.kind === "single") return { ...prev, [q.id]: [optId] };
      // multi — "none" clears the rest and vice-versa
      if (optId === "none") return { ...prev, [q.id]: ["none"] };
      const without = cur.filter((v) => v !== "none");
      const nextSel = without.includes(optId)
        ? without.filter((v) => v !== optId)
        : [...without, optId];
      return { ...prev, [q.id]: nextSel };
    });
  }

  function selectAndAdvance(q: Question, optId: string) {
    toggle(q, optId);
    // Single-select auto-advances for a fluid feel.
    if (q.kind === "single") {
      window.setTimeout(() => advance(), reduce ? 0 : 260);
    }
  }

  function advance() {
    if (stepIndex < steps.length - 1) {
      go(1);
      setStepIndex((i) => i + 1);
    } else {
      go(1);
      setPhase("result");
    }
  }

  function back() {
    if (phase === "result") {
      go(-1);
      setPhase("quiz");
      setStepIndex(steps.length - 1);
      return;
    }
    if (stepIndex === 0) {
      go(-1);
      setPhase("select");
      setProjectId(null);
      return;
    }
    go(-1);
    setStepIndex((i) => i - 1);
  }

  function restart() {
    go(-1);
    setPhase("select");
    setProjectId(null);
    setAnswers({});
    setStepIndex(0);
  }

  const canContinue = step ? (answers[step.id]?.length ?? 0) > 0 : false;
  const showEstimateBar = phase === "quiz" && estimate.high > 0;

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -40 }),
  };

  return (
    <div id="estimator" className="relative">
      {/* Progress */}
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="flex items-center gap-3 pb-6 pt-2">
          <button
            onClick={back}
            disabled={phase === "select"}
            className="u-eyebrow flex items-center gap-1.5 text-[11px] text-muted transition hover:text-blue disabled:pointer-events-none disabled:opacity-0"
          >
            <BackIcon className="h-4 w-4" /> Back
          </button>
          <div className="flex flex-1 items-center gap-1.5">
            {Array.from({ length: totalDots }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 overflow-hidden bg-hair"
              >
                <motion.div
                  className="h-full bg-brand"
                  initial={false}
                  animate={{ width: i < activeDot ? "100%" : i === activeDot ? "45%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>
          <span className="u-eyebrow text-[11px] text-muted tabular-nums">
            {Math.min(activeDot + 1, totalDots)}/{totalDots}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pb-4 sm:px-8">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ---------- PROJECT PICKER ---------- */}
          {phase === "select" && (
            <motion.div
              key="select"
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="u-eyebrow text-[11px] text-brand">Step 1 · Your project</p>
              <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-[2.4rem]">
                What are you dreaming up?
              </h2>
              <p className="u-serif mt-3 text-lg text-muted">
                Pick a starting point. You can change details as you go.
              </p>

              <div className="mt-8 grid gap-4">
                {PROJECTS.map((p, i) => {
                  const Icon = PROJECT_ICONS[p.icon];
                  return (
                    <motion.button
                      key={p.id}
                      onClick={() => chooseProject(p.id)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduce ? 0 : 0.05 * i, duration: 0.4 }}
                      className="group relative flex flex-col overflow-hidden border border-hair bg-white text-left shadow-soft transition hover:border-brand hover:shadow-brand sm:flex-row sm:items-stretch"
                    >
                      {/* Real project photo */}
                      <span className="relative block h-32 w-full flex-none overflow-hidden sm:h-auto sm:w-48 md:w-56">
                        <Image
                          src={p.image}
                          alt={`Archadeck ${p.name} project`}
                          fill
                          sizes="(max-width: 640px) 100vw, 224px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-blue/0 transition group-hover:bg-blue/10"
                        />
                      </span>

                      <span className="flex flex-1 items-center gap-4 p-5 sm:p-6">
                        <span className="flex h-12 w-12 flex-none items-center justify-center bg-wash text-blue transition group-hover:bg-brand group-hover:text-white sm:h-14 sm:w-14">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xl font-semibold text-ink sm:text-2xl">
                            {p.name}
                          </span>
                          <span className="u-serif mt-0.5 block text-sm text-muted sm:text-base">
                            {p.tagline}
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-blue sm:hidden">
                            {formatUSD(p.range[0])}–{formatUSD(p.range[1])}
                          </span>
                        </span>
                        <span className="hidden text-right sm:block">
                          <span className="u-eyebrow block text-[10px] text-muted">
                            Typically
                          </span>
                          <span className="block text-sm font-semibold text-blue">
                            {formatUSD(p.range[0])}–{formatUSD(p.range[1])}
                          </span>
                        </span>
                        <ArrowIcon className="h-5 w-5 flex-none text-hair transition group-hover:translate-x-1 group-hover:text-brand" />
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ---------- QUESTION ---------- */}
          {phase === "quiz" && step && (
            <motion.div
              key={step.id}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <p className="u-eyebrow text-[11px] text-brand">
                {project?.name} · Step {stepIndex + 2}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-[2rem] sm:leading-tight">
                {step.title}
              </h2>
              {step.helper && (
                <p className="u-serif mt-3 text-base text-muted">{step.helper}</p>
              )}

              <div className="mt-7 grid gap-3">
                {step.options.map((opt) => {
                  const selected = isSelected(step, opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectAndAdvance(step, opt.id)}
                      aria-pressed={selected}
                      className={`group flex items-center gap-4 border p-4 text-left transition sm:p-[18px] ${
                        selected
                          ? "border-brand bg-brand/[0.06] shadow-soft"
                          : "border-hair bg-white hover:border-brand/60 hover:bg-wash"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 flex-none items-center justify-center border transition ${
                          step.kind === "multi" ? "" : "rounded-full"
                        } ${
                          selected
                            ? "border-brand bg-brand text-white"
                            : "border-[#c8d3db] bg-white text-transparent group-hover:border-brand"
                        }`}
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="mt-0.5 block text-sm text-muted">
                            {opt.sublabel}
                          </span>
                        )}
                      </span>
                      {(opt.min || opt.max) && step.base && (
                        <span className="hidden text-sm font-semibold text-blue sm:block">
                          {formatUSD(opt.min ?? 0)}+
                        </span>
                      )}
                      {(opt.min || opt.max) && !step.base && (
                        <span className="hidden text-sm font-medium text-muted sm:block">
                          +{formatUSD(opt.min ?? 0)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Multi-select needs an explicit continue */}
              {step.kind === "multi" && (
                <div className="mt-7 flex justify-end">
                  <button
                    onClick={advance}
                    disabled={!canContinue}
                    className="u-eyebrow flex items-center gap-2 bg-brand px-7 py-3.5 text-xs text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-hair disabled:text-muted disabled:shadow-none"
                  >
                    Continue <ArrowIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ---------- RESULT ---------- */}
          {phase === "result" && project && (
            <motion.div
              key="result"
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <PriceReveal
                project={project}
                answers={answers}
                estimate={estimate}
                onRestart={restart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live estimate bar */}
      <AnimatePresence>
        {showEstimateBar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none sticky bottom-4 z-20 mx-auto mt-2 max-w-3xl px-5 sm:px-8"
          >
            <div className="pointer-events-auto flex items-center justify-between border border-hair bg-white/95 px-5 py-3 shadow-brand backdrop-blur">
              <span className="u-eyebrow text-[10px] text-muted">
                Estimate so far
              </span>
              <span className="text-lg font-semibold text-blue tabular-nums">
                {formatUSD(estimate.low)} – {formatUSD(estimate.high)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
