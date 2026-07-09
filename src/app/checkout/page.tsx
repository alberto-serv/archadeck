"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import {
  PROJECTS,
  computeStartingPrice,
  formatUSD,
  getProject,
  type Answers,
} from "@/lib/estimator";
import { ArrowIcon, BackIcon, CheckIcon } from "@/components/icons";

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8:00 – 10:00 AM" },
  { id: "midday", label: "Midday", time: "10:00 AM – 12:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "1:00 – 3:00 PM" },
  { id: "late", label: "Late afternoon", time: "3:00 – 5:00 PM" },
];

function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 2);
  while (dates.length < 15) {
    if (cursor.getDay() !== 0) dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();

  const projectId = params.get("project");
  const project = getProject(projectId);
  const answers: Answers = useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(params.get("config") || "{}"));
    } catch {
      return {};
    }
  }, [params]);

  const price = project ? computeStartingPrice(project, answers) : 0;

  const summary = useMemo(() => {
    if (!project) return [];
    const rows: { section: string; value: string }[] = [];
    for (const step of project.steps) {
      const sel = answers[step.id] ?? [];
      const labels = sel
        .map((id) => step.options.find((o) => o.id === id)?.label)
        .filter(Boolean) as string[];
      if (labels.length) rows.push({ section: step.section, value: labels.join(", ") });
    }
    return rows;
  }, [project, answers]);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [visitType, setVisitType] = useState<"in-home" | "virtual">("in-home");
  const [weekStart, setWeekStart] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [otherOn, setOtherOn] = useState(false);
  const [otherProjects, setOtherProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const availableDates = useMemo(() => getAvailableDates(), []);
  const visibleDates = availableDates.slice(weekStart, weekStart + 5);
  const canBack = weekStart > 0;
  const canFwd = weekStart + 5 < availableDates.length;

  const otherOptions = PROJECTS.filter((p) => p.id !== projectId);

  const canBook =
    first.trim() &&
    last.trim() &&
    email.trim() &&
    phone.trim() &&
    address.trim() &&
    selectedDate &&
    selectedTime;

  if (!project) {
    return (
      <div>
        <Header />
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
          <h1 className="text-2xl font-semibold text-ink">No project selected</h1>
          <p className="u-serif mt-2 text-muted">
            Start by configuring your project and we&apos;ll bring your estimate here.
          </p>
          <Link
            href="/"
            className="u-eyebrow mt-6 bg-brand px-7 py-3.5 text-xs text-white shadow-brand transition hover:bg-brand-600"
          >
            Start my estimate
          </Link>
        </div>
      </div>
    );
  }

  function toggleOther(id: string) {
    setOtherProjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function fmtDate(d: Date) {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  function handleBook() {
    if (!canBook || !project) return;
    setLoading(true);
    const slot = TIME_SLOTS.find((s) => s.id === selectedTime);
    const qs = new URLSearchParams({
      project: project.id,
      projectName: project.name,
      price: String(price),
      name: `${first} ${last}`.trim(),
      email,
      phone,
      address,
      visitType,
      date: selectedDate ? fmtDate(selectedDate) : "",
      time: slot ? slot.time : "",
      other: otherProjects
        .map((id) => getProject(id)?.name)
        .filter(Boolean)
        .join(", "),
    });
    router.push(`/checkout/confirmation?${qs.toString()}`);
  }

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <Link
          href="/"
          className="u-eyebrow inline-flex items-center gap-1.5 text-[11px] text-muted transition hover:text-blue"
        >
          <BackIcon className="h-4 w-4" /> Back to estimator
        </Link>

        <h1 className="mt-5 text-center text-3xl font-semibold text-ink sm:text-4xl">
          Book your free design consultation
        </h1>
        <p className="u-serif mx-auto mt-3 max-w-xl text-center text-muted">
          Review your estimate, then pick a time. A Chicagoland designer confirms every
          detail on-site and gives you a firm quote — no payment today, no obligation.
        </p>

        <div className="mt-9 space-y-5">
          {/* Project estimate */}
          <Card title="Your project estimate">
            <div className="flex gap-4 border border-hair bg-wash p-4 sm:p-5">
              <div className="relative hidden h-28 w-36 flex-none overflow-hidden sm:block">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-lg font-semibold text-ink">{project.name}</h3>
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-xs text-muted">Starting at</span>
                    <span className="text-2xl font-bold text-blue">{formatUSD(price)}</span>
                  </span>
                </div>
                <dl className="mt-3 space-y-1.5">
                  {summary.map((r) => (
                    <div key={r.section} className="flex gap-3 text-sm">
                      <dt className="w-24 flex-none text-muted">{r.section}</dt>
                      <dd className="flex-1 font-medium text-ink">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <p className="mt-3 text-xs italic text-muted">
              This is an early estimate. Your final project price is confirmed at your
              free consultation.
            </p>
          </Card>

          {/* Your information */}
          <Card title="Your information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" value={first} onChange={setFirst} placeholder="John" />
              <Field label="Last name" value={last} onChange={setLast} placeholder="Doe" />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="john@example.com"
                full
              />
              <Field
                label="Phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="(847) 250-4100"
              />
              <Field
                label="Home address"
                value={address}
                onChange={setAddress}
                placeholder="Street, city, ZIP"
              />
            </div>
          </Card>

          {/* Schedule */}
          <Card title="Schedule your free consultation">
            <div className="space-y-5">
              <div>
                <p className="u-eyebrow mb-2 text-[10px] text-muted">How would you like it?</p>
                <div className="grid grid-cols-2 gap-3">
                  <Choice
                    active={visitType === "in-home"}
                    onClick={() => setVisitType("in-home")}
                    title="In-home visit"
                    sub="On-site measure & design"
                  />
                  <Choice
                    active={visitType === "virtual"}
                    onClick={() => setVisitType("virtual")}
                    title="Virtual consult"
                    sub="Guided video call"
                  />
                </div>
              </div>

              <div>
                <p className="u-eyebrow mb-2 text-[10px] text-muted">Select a date</p>
                <div className="flex items-center gap-2">
                  <Arrow dir="left" disabled={!canBack} onClick={() => setWeekStart(Math.max(0, weekStart - 5))} />
                  <div className="grid flex-1 grid-cols-5 gap-2">
                    {visibleDates.map((d) => {
                      const on = selectedDate && isSameDay(d, selectedDate);
                      return (
                        <button
                          key={d.toISOString()}
                          onClick={() => setSelectedDate(d)}
                          className={`flex flex-col items-center border-2 py-2.5 transition ${
                            on
                              ? "border-brand bg-brand/[0.06]"
                              : "border-hair hover:border-brand/50 hover:bg-wash"
                          }`}
                        >
                          <span className="u-eyebrow text-[9px] text-muted">
                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className={`mt-0.5 text-lg font-bold ${on ? "text-blue" : "text-ink"}`}>
                            {d.getDate()}
                          </span>
                          <span className="text-[10px] text-muted">
                            {d.toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <Arrow dir="right" disabled={!canFwd} onClick={() => setWeekStart(Math.min(availableDates.length - 5, weekStart + 5))} />
                </div>
              </div>

              {selectedDate && (
                <div>
                  <p className="u-eyebrow mb-2 text-[10px] text-muted">
                    Select a time for {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((s) => {
                      const on = selectedTime === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedTime(s.id)}
                          className={`border-2 p-3 text-left transition ${
                            on
                              ? "border-brand bg-brand/[0.06]"
                              : "border-hair hover:border-brand/50 hover:bg-wash"
                          }`}
                        >
                          <p className={`text-sm font-semibold ${on ? "text-blue" : "text-ink"}`}>{s.label}</p>
                          <p className="mt-0.5 text-xs text-muted">{s.time}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Other projects */}
          <Card>
            <button
              onClick={() => setOtherOn((v) => !v)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span
                className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center border-2 transition ${
                  otherOn ? "border-brand bg-brand text-white" : "border-[#c8d3db] text-transparent"
                }`}
              >
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block text-base font-semibold text-ink">
                  I have another project to be measured and quoted
                </span>
                <span className="u-serif mt-0.5 block text-sm text-muted">
                  Our team will discuss this during your consultation.
                </span>
              </span>
            </button>

            {otherOn && (
              <div className="mt-5">
                <p className="u-eyebrow mb-3 text-[10px] text-muted">Select project type(s)</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {otherOptions.map((p) => {
                    const on = otherProjects.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleOther(p.id)}
                        className={`group relative overflow-hidden border-2 text-left transition ${
                          on ? "border-brand shadow-brand" : "border-hair hover:border-brand/60"
                        }`}
                      >
                        <span className="relative block h-24 w-full overflow-hidden">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <span className={`absolute inset-0 transition ${on ? "bg-blue/25" : "bg-blue/0 group-hover:bg-blue/10"}`} />
                          <span
                            className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center border transition ${
                              on
                                ? "border-brand bg-brand text-white opacity-100"
                                : "border-white/80 bg-white/80 text-transparent opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                        </span>
                        <span className="block px-3 py-2.5 text-sm font-semibold text-ink">
                          {p.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* Estimate summary */}
          <Card title="Estimate summary">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{project.name}</span>
                <span className="font-medium text-ink">Starting at {formatUSD(price)}</span>
              </div>
              {otherProjects.length > 0 && (
                <div className="pt-1">
                  <p className="mb-1 text-muted">Also requesting a quote for:</p>
                  <ul className="space-y-0.5">
                    {otherProjects.map((id) => (
                      <li key={id} className="flex items-center gap-1.5 text-ink">
                        <CheckIcon className="h-3.5 w-3.5 flex-none text-brand" />
                        {getProject(id)?.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2 border-t border-hair pt-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-ink">Project total estimate</span>
                  <span className="text-xl font-bold text-blue">Starting at {formatUSD(price)}</span>
                </div>
                <p className="mt-1 text-[11px] italic text-muted">
                  Your final project price is confirmed at your free consultation. No payment
                  is due today.
                </p>
              </div>
            </div>
          </Card>

          <div className="pb-10">
            <button
              onClick={handleBook}
              disabled={!canBook || loading}
              className="u-eyebrow flex h-14 w-full items-center justify-center gap-2 bg-brand text-sm text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-hair disabled:text-muted disabled:shadow-none"
            >
              {loading ? "Booking…" : "Book my free consultation"}
              {!loading && <ArrowIcon className="h-4 w-4" />}
            </button>
            {!canBook && (
              <p className="mt-2 text-center text-xs text-muted">
                Please complete your information and pick a date &amp; time.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- primitives ------------------------------- */

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="border border-hair bg-white p-5 shadow-soft sm:p-6">
      {title && <h2 className="u-heading mb-4 text-base font-semibold text-ink">{title}</h2>}
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="u-eyebrow mb-1.5 block text-[10px] text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-field px-4 py-3 text-ink placeholder:text-[#8a8a8a] outline-none ring-brand focus:ring-2"
      />
    </label>
  );
}

function Choice({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`border-2 p-4 text-left transition ${
        active ? "border-brand bg-brand/[0.06]" : "border-hair hover:border-brand/50 hover:bg-wash"
      }`}
    >
      <p className={`text-sm font-semibold ${active ? "text-blue" : "text-ink"}`}>{title}</p>
      <p className="mt-0.5 text-xs text-muted">{sub}</p>
    </button>
  );
}

function Arrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-none border border-hair p-2 text-ink transition hover:bg-wash disabled:opacity-30"
      aria-label={dir === "left" ? "Previous dates" : "Next dates"}
    >
      <BackIcon className={`h-4 w-4 ${dir === "right" ? "rotate-180" : ""}`} />
    </button>
  );
}
