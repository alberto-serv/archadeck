"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { CheckIcon } from "@/components/icons";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationInner />
    </Suspense>
  );
}

function ConfirmationInner() {
  const params = useSearchParams();
  const projectName = params.get("projectName") || "your project";
  const price = params.get("price");
  const name = params.get("name") || "";
  const email = params.get("email") || "";
  const phone = params.get("phone") || "";
  const address = params.get("address") || "";
  const visitType = params.get("visitType") === "virtual" ? "Virtual consult" : "In-home visit";
  const date = params.get("date") || "";
  const time = params.get("time") || "";
  const other = params.get("other") || "";

  const rows: { label: string; value: string }[] = [
    { label: "Project", value: projectName },
    price ? { label: "Estimate", value: `Starting at $${Number(price).toLocaleString()}` } : null,
    { label: "Consultation", value: visitType },
    date ? { label: "Date", value: date } : null,
    time ? { label: "Time", value: time } : null,
    other ? { label: "Also quoting", value: other } : null,
    name ? { label: "Name", value: name } : null,
    email ? { label: "Email", value: email } : null,
    phone ? { label: "Phone", value: phone } : null,
    address ? { label: "Address", value: address } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center bg-brand text-white shadow-brand">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-ink sm:text-4xl">
            You&apos;re booked!
          </h1>
          <p className="u-serif mx-auto mt-3 max-w-md text-lg text-muted">
            {date ? (
              <>
                Your free consultation is set for{" "}
                <span className="font-semibold text-blue not-italic">{date}</span>
                {time ? <>, {time}</> : null}. We&apos;ll send a confirmation to{" "}
                <span className="not-italic">{email || "your email"}</span>.
              </>
            ) : (
              <>A Chicagoland designer will reach out shortly to confirm the details.</>
            )}
          </p>
        </div>

        <div className="mt-9 border border-hair bg-white shadow-soft">
          <p className="u-eyebrow border-b border-hair px-6 py-4 text-[10px] text-muted">
            Your appointment
          </p>
          <dl className="divide-y divide-hair">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-4 px-6 py-3.5 text-sm">
                <dt className="w-32 flex-none text-muted">{r.label}</dt>
                <dd className="flex-1 font-medium text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 border border-hair bg-wash p-6">
          <p className="u-eyebrow text-[10px] text-brand">What happens next</p>
          <ol className="u-serif mt-3 space-y-2 text-sm text-muted">
            <li>1. A designer reviews your configuration and confirms your appointment.</li>
            <li>2. They measure and design your outdoor space{other ? " and any additional projects" : ""} on-site.</li>
            <li>3. You receive a detailed, itemized quote — no obligation.</li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="u-eyebrow inline-block bg-blue px-7 py-3.5 text-[11px] text-white transition hover:bg-blue-900"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
