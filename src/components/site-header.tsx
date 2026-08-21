import Link from "next/link";
import { SITE, formatSnapshotDate } from "@/src/lib/site";

const NAV = [
  { href: "/parliament", label: "Parliament" },
  { href: "/institutions", label: "Institutions" },
  { href: "/states", label: "States & UTs" },
  { href: "/high-courts", label: "High Courts" },
  { href: "/people", label: "People" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-rule bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2 no-underline focus-visible:outline-2"
        >
          <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight text-ink">
            {SITE.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="order-4 w-full md:order-none md:w-auto">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-muted no-underline transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-indelible after:transition-transform after:duration-300 after:ease-out hover:text-indelible hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/coverage"
            title="Dataset snapshot date — see coverage report"
            className="hidden rounded-full border border-rule px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-muted no-underline hover:border-indelible hover:text-indelible lg:inline-block"
          >
            snapshot · {formatSnapshotDate(SITE.snapshotDate)}
          </Link>
          <Link href="/search" className="button secondary !py-1.5 !px-3">
            Search
          </Link>
        </div>
      </div>
    </header>
  );
}
