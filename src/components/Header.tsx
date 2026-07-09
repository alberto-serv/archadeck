import Image from "next/image";
import logo from "../../public/archadeck-logo-long.png";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-blue text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center" aria-label="Archadeck of Chicagoland">
          <Image
            src={logo}
            alt="Archadeck"
            priority
            className="h-6 w-auto sm:h-7"
            style={{ width: "auto" }}
          />
        </a>
        <div className="flex items-center gap-6">
          <a
            href="tel:8472504100"
            className="hidden text-sm font-medium tracking-wide text-white/90 transition hover:text-white sm:block"
          >
            (847) 250-4100
          </a>
          <a
            href="#estimator"
            className="u-eyebrow bg-white px-4 py-2 text-[11px] text-blue transition hover:bg-white/90"
          >
            Free Estimate
          </a>
        </div>
      </div>
    </header>
  );
}
