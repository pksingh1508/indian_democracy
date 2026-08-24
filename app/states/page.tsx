import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import {
  districtCount,
  states,
} from "@/src/lib/data/geography";
import {
  lokSabhaMembers,
  rajyaSabhaMembers,
} from "@/src/lib/data/parliament";
import { normalizeStateName, slugify } from "@/src/lib/format";
import { geography } from "@/src/lib/data/geography";
import { Reveal, Stagger, StaggerItem } from "@/src/components/motion-primitives";

export const metadata: Metadata = {
  title: "States & Union Territories",
  description:
    "All 28 states and 8 Union Territories: Lok Sabha and Rajya Sabha representation, High Courts, and official LGD districts.",
};

const UT_NORMALIZED = new Set([
  "andamanandnicobarislands",
  "chandigarh",
  "dadraandnagarhavelianddamananddiu",
  "delhi",
  "jammuandkashmir",
  "ladakh",
  "lakshadweep",
  "puducherry",
]);

function jurisdictionType(stateName: string): "State" | "Union Territory" {
  return UT_NORMALIZED.has(normalizeStateName(stateName)) ? "Union Territory" : "State";
}

export default function StatesPage() {
  const stateRows = states.map((s) => {
    const lsSeats = lokSabhaMembers.filter(
      (m) => normalizeStateName(m.stateOrUnionTerritory) === normalizeStateName(s.stateName),
    ).length;
    const rsSeats = rajyaSabhaMembers.filter(
      (m) => normalizeStateName(m.stateOrUnionTerritory) === normalizeStateName(s.stateName),
    ).length;
    return { ...s, type: jurisdictionType(s.stateName), lsSeats, rsSeats };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/states", label: "States & UTs" }]} />
      <PageHeader
        eyebrow="Geography · Local Government Directory"
        title={`States & UTs · ${states.length}`}
        lede={`All ${states.length} jurisdictions of the Indian Union — ${states.length - 8} states and 8 Union Territories — with their parliamentary representation, High Courts, and ${districtCount.toLocaleString("en-IN")} districts.`}
      />

      <Reveal className="mt-8">
        <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
          <table className="data-table">
          <caption className="px-4 pt-4">
            Codes are official LGD state codes. Seat counts are computed from the
            current member rosters.
          </caption>
          <thead>
            <tr>
              <th scope="col">Jurisdiction</th>
              <th scope="col">Type</th>
              <th scope="col" className="num">LGD code</th>
              <th scope="col" className="num">LS seats</th>
              <th scope="col" className="num">RS seats</th>
            </tr>
          </thead>
          <tbody>
            {stateRows.map((s) => (
              <tr key={s.stateCode}>
                <td>
                  <Link href={`/states/${slugify(s.stateName)}`} className="text-link font-medium">
                    {s.stateName}
                  </Link>
                </td>
                <td className="text-muted">{s.type}</td>
                <td className="num font-mono text-xs text-faint tabular-nums">
                  {s.stateCode}
                </td>
                <td className="num font-mono tabular-nums">{s.lsSeats}</td>
                <td className="num font-mono tabular-nums">{s.rsSeats}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-4" y={12}>
        <p className="text-sm leading-relaxed text-muted">
          State legislatures and state ministries are not part of the collected
          record yet — see the{" "}
          <Link href="/coverage" className="text-link">coverage report</Link>. Source:{" "}
          {geography.source.publisher} ({geography.source.title}), snapshot{" "}
          {geography.snapshotDate}.
        </p>
      </Reveal>

      <Stagger className="mt-6 flex flex-wrap gap-2" stagger={0.07}>
        {["Complete geography", "Parliamentary rosters complete", "State executives not yet collected"].map(
          (label) => (
            <StaggerItem key={label} y={8}>
              <StatusBadge tone={label.includes("not yet") ? "missing" : "ok"}>
                {label}
              </StatusBadge>
            </StaggerItem>
          ),
        )}
      </Stagger>
    </div>
  );
}
