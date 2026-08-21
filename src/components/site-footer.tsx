import Link from "next/link";
import { SITE, formatSnapshotDate } from "@/src/lib/site";

const SECTIONS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { href: "/parliament/lok-sabha", label: "Lok Sabha" },
      { href: "/parliament/rajya-sabha", label: "Rajya Sabha" },
      { href: "/states", label: "States & UTs" },
      { href: "/people", label: "People" },
    ],
  },
  {
    heading: "Institutions",
    links: [
      { href: "/institutions/president", label: "President" },
      { href: "/institutions/prime-minister", label: "Prime Minister" },
      { href: "/institutions/supreme-court", label: "Supreme Court" },
      { href: "/high-courts", label: "High Courts" },
    ],
  },
  {
    heading: "About the record",
    links: [
      { href: "/methodology", label: "Methodology" },
      { href: "/sources", label: "Source registry" },
      { href: "/coverage", label: "Coverage report" },
      { href: "/corrections", label: "Corrections" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rule bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl text-ink">{SITE.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              An independent, non-partisan public-information project. Every
              current-office fact carries its official source and the date it was
              last checked.
            </p>
            <p className="mt-4 font-mono text-xs text-faint">
              Data snapshot · {formatSnapshotDate(SITE.snapshotDate)}
            </p>
          </div>

          {SECTIONS.map((section) => (
            <nav key={section.heading} aria-label={section.heading}>
              <h2 className="eyebrow !text-muted mb-3">{section.heading}</h2>
              <ul className="space-y-1.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted no-underline hover:text-indelible">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-rule bg-paper p-4 text-sm leading-relaxed text-muted">
          <strong className="font-semibold text-ink">Independent project — not a government service.</strong>{" "}
          This website is not affiliated with the Government of India, any state
          government, any court, the Election Commission of India, or any political
          party. It republishes facts from official public services with citations,
          and is explanatory only. For authoritative use, always consult the linked
          official source.
        </div>
      </div>
    </footer>
  );
}
