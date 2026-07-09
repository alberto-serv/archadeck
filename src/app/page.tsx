import { Header } from "@/components/Header";
import { Estimator } from "@/components/Estimator";

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Header />

      {/* Estimator */}
      <main className="flex-1 py-12 sm:py-16">
        <Estimator />
      </main>

      {/* Footer */}
      <footer className="border-t border-hair bg-blue py-6 text-white/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-6 gap-y-1.5 px-5 text-center text-sm sm:flex-row sm:justify-between sm:text-left sm:px-8">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
            <p className="u-eyebrow text-[11px] text-white">Archadeck of Chicagoland</p>
            <a href="tel:8472504100" className="font-medium text-white hover:underline">
              (847) 250-4100
            </a>
          </div>
          <p className="text-xs text-white/50">
            Estimates are ballpark ranges for planning only, not a formal quote.
          </p>
        </div>
      </footer>
    </div>
  );
}
