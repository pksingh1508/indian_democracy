import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import { searchRecords, searchIndexSize } from "@/src/lib/search-index";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search people, offices, constituencies, states, parties, and courts across the public-office record.",
};

const KIND_LABELS: Record<string, string> = {
  "Lok Sabha member": "Lok Sabha",
  "Rajya Sabha member": "Rajya Sabha",
  "Union minister": "Union ministry",
  Office: "Office",
  "Supreme Court judge": "Supreme Court",
  "State or UT": "State / UT",
  District: "District",
  "High Court": "High Court",
};

export default async function SearchPage(
  props: PageProps<"/search">,
) {
  const searchParams = await props.searchParams;
  const rawQ = typeof searchParams.q === "string" ? searchParams.q : "";
  const results = rawQ ? searchRecords(rawQ) : [];

  // Group by entity type so a candidacy-like record is never mistaken
  // for an office holding.
  const grouped = new Map<string, typeof results>();
  for (const r of results) {
    const list = grouped.get(r.kind) ?? [];
    list.push(r);
    grouped.set(r.kind, list);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/search", label: "Search" }]} />
      <PageHeader
        eyebrow="Discovery"
        title="Search the record"
        lede={`People, offices, constituencies, states, districts, parties, and courts — ${searchIndexSize().toLocaleString("en-IN")} indexed records from the official datasets.`}
      />

      <form action="/search" method="GET" role="search" className="mt-8 flex gap-2">
        <label htmlFor="q" className="sr-only">Search query</label>
        <input
          id="q"
          type="search"
          name="q"
          defaultValue={rawQ}
          placeholder='Try "Gandhinagar", "Nirmala", "Bombay High Court"…'
          className="input flex-1"
          autoFocus
        />
        <button type="submit" className="button">Search</button>
      </form>

      {!rawQ && (
        <p className="mt-6 text-sm text-muted">
          Results are plain server-rendered links grouped by record type, so a
          membership and an office are always distinguishable.
        </p>
      )}

      {rawQ && results.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-rule-strong bg-paper p-6">
          <p className="font-medium">No records match “{rawQ}”.</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Try fewer characters or check spelling. The record covers current
            national offices only — state legislators and district officers are
            not collected yet.
          </p>
        </div>
      )}

      {[...grouped.entries()].map(([kind, list]) => (
        <section key={kind} className="mt-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="eyebrow !text-muted">{KIND_LABELS[kind] ?? kind}</h2>
            <span className="font-mono text-xs text-faint">{list.length}</span>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {list.map((r) => (
              <li key={`${r.kind}-${r.href}-${r.title}`} className="record-card px-4 py-3 transition-colors hover:border-rule-strong">
                <Link href={r.href} className="block no-underline">
                  <span className="font-medium text-indelible">{r.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{r.subtitle}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {rawQ && results.length > 0 && (
        <p className="mt-10 flex items-center gap-2 text-sm text-muted">
          <StatusBadge tone="ok">{results.length} shown</StatusBadge>
          Ranked by match quality across names, constituencies, portfolios, and
          jurisdictions.
        </p>
      )}
    </div>
  );
}
