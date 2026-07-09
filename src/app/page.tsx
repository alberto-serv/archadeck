import { Header } from "@/components/Header";
import { Estimator } from "@/components/Estimator";

export default function Home() {
  return (
    <div id="top">
      <Header />

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
