import { Header } from "@/components/Header";
import { Estimator } from "@/components/Estimator";
import { ClockIcon, ShieldIcon, TagIcon } from "@/components/icons";

export default function Home() {
  return (
    <div id="top">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hair bg-wash">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-blue/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-16 text-center sm:px-8 sm:pt-24">
          <p className="u-eyebrow text-[11px] text-brand">
            Archadeck of Chicagoland
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-bold leading-[1.05] text-ink sm:text-6xl">
            Your dream outdoor space,
            <span className="u-serif italic font-normal text-blue"> priced in minutes.</span>
          </h1>
          <p className="u-serif mx-auto mt-5 max-w-xl text-lg text-muted sm:text-xl">
            Configure your project and see a transparent starting price
            instantly — no phone call, no obligation.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {[
              { icon: ClockIcon, t: "Under 2 minutes" },
              { icon: TagIcon, t: "Transparent pricing" },
              { icon: ShieldIcon, t: "No obligation" },
            ].map(({ icon: Icon, t }) => (
              <span key={t} className="flex items-center gap-2 text-ink">
                <Icon className="h-4 w-4 text-brand" /> {t}
              </span>
            ))}
          </div>

          <a
            href="#estimator"
            className="u-eyebrow mt-9 inline-block bg-brand px-9 py-4 text-xs text-white shadow-brand transition hover:bg-brand-600"
          >
            Configure my project ↓
          </a>
        </div>
      </section>

      {/* Estimator */}
      <main className="py-12 sm:py-16">
        <Estimator />
      </main>

      {/* Footer */}
      <footer className="border-t border-hair bg-blue py-10 text-white/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center text-sm sm:px-8">
          <p className="u-eyebrow text-[11px] text-white">
            Archadeck of Chicagoland
          </p>
          <p className="u-serif max-w-md text-white/70">
            Custom decks, porches, patios &amp; outdoor living, designed and
            built to last. Serving the greater Chicago area.
          </p>
          <a href="tel:8472504100" className="font-medium text-white hover:underline">
            (847) 250-4100
          </a>
          <p className="mt-2 text-xs text-white/50">
            Estimates are ballpark ranges for planning only and not a formal quote.
          </p>
        </div>
      </footer>
    </div>
  );
}
