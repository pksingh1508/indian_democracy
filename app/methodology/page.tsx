import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/src/components/ui";
import { SITE } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How this independent public record is collected, verified, dated, and corrected.",
};

const PRINCIPLES: { title: string; body: React.ReactNode }[] = [
  {
    title: "Official sources only",
    body: (
      <>
        Every current-office fact on this site comes from an official public
        service: the Digital Sansad member rosters, the President's and
        Vice-President's Secretariats, the Prime Minister's Office portfolio
        notification, the Supreme Court's judge list, the Department of Justice,
        and the Local Government Directory. We do not scrape inside page
        requests; datasets are collected offline, reviewed as a diff in version
        control, then published with a new build.
      </>
    ),
  },
  {
    title: "A citation travels with the fact",
    body: (
      <>
        Each dataset stores its publisher, linked URL, authority tier, and the
        date it was retrieved. Pages display that citation beside the facts it
        supports, so you can always check the primary record yourself.
      </>
    ),
  },
  {
    title: "Time-aware records",
    body: (
      <>
        Office holding changes; identity does not. Records keep their published
        dates — appointment dates, term windows, projected retirements, and
        portfolio "as-on" dates are shown separately from when we last checked
        the source.
      </>
    ),
  },
  {
    title: "Honest gaps",
    body: (
      <>
        Where a roster is a dated baseline rather than a current snapshot — for
        example the Department of Justice High Court lists dated 1 April 2026 —
        we label it exactly that way instead of implying it is current. Areas we
        have not yet collected (state legislatures, district courts) say so on{" "}
        <Link href="/coverage" className="text-link">the coverage report</Link>.
      </>
    ),
  },
  {
    title: "Data minimization",
    body: (
      <>
        This is a record of public offices, not a directory of private people.
        Personal contact details, addresses, phone numbers, email addresses, and
        identity numbers are excluded by design. Dates of birth are not
        displayed even where an official roster publishes them; role-relevant
        term dates are what belong here.
      </>
    ),
  },
  {
    title: "One person per office record",
    body: (
      <>
        Person pages correspond to individual roster records and are never
        merged automatically across datasets by name similarity. If the same
        natural person appears in two rosters, each record stays separate and
        clearly labelled — merging identities is a deliberate editorial act, not
        an algorithm.
      </>
    ),
  },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="How this works"
        title="Methodology"
        lede={`${SITE.name} republishes dated, source-linked records of who serves in India's public offices. This page explains where the data comes from, how it is checked, and where it stops.`}
        meta={
          <span className="font-mono text-xs text-faint">
            Last reviewed {SITE.collectedOn}
          </span>
        }
      />

      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div key={p.title}>
            <h2 className="font-display text-xl text-ink">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-lg border border-rule bg-surface p-6">
        <h2 className="font-display text-xl text-ink">Chamber visualizations</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The Lok Sabha and Rajya Sabha seat views are{" "}
          <strong>chamber-style composition views</strong>: they show party and
          group totals arranged as a conceptual hemicycle generated from the same
          computed totals as the tables. They do not represent physical seating
          assignments, which no public source publishes at seat level. The
          arithmetic is always shown explicitly — assigned seats plus named
          vacancies must equal the sanctioned house size.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl text-ink">Recollection cadence</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          National datasets were collected on {SITE.collectedOn} using the
          collection scripts kept alongside the datasets. When a new snapshot is
          needed, the scripts are re-run against the official services, the diff
          is reviewed, and the site is rebuilt. See{" "}
          <Link href="/sources" className="text-link">
            the source registry
          </Link>{" "}
          for every upstream publisher.
        </p>
      </section>
    </div>
  );
}
