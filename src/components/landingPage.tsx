"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { HoverInfo } from "@/src/components/parliament-scene-canvas";
import type { ParliamentFloor } from "@/src/lib/parliament-floor-geometry";
import { partyColor } from "@/src/lib/parties";
import { FreshnessBadge } from "@/src/components/badges";

export interface LegendEntry {
  label: string;
  color: string;
  count: number;
}

const SceneCanvas = dynamic(
  () => import("@/src/components/parliament-scene-canvas").then((m) => m.ParliamentSceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[460px] items-center justify-center rounded-lg border border-rule-strong bg-[#11141c] text-sm text-muted">
        Assembling the chamber…
      </div>
    ),
  },
);

/**
 * landingPage — interactive 3D Lok Sabha chamber hero.
 * Renders the chamber scene, identifies members on hover, and navigates to
 * each member's roster page on click. Falls back to the linked member index
 * whenever WebGL is unavailable.
 */
export function LandingPage({
  floor,
  legend,
}: {
  floor: ParliamentFloor;
  legend: LegendEntry[];
}) {
  const router = useRouter();
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [failed, setFailed] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleHover = useCallback((info: HoverInfo | null) => setHover(info), []);
  const handleSelect = useCallback((id: string) => router.push(`/people/${id}`), [router]);
  const handleFailure = useCallback(() => setFailed(true), []);

  const members = useMemo(
    () => [...floor.persons].sort((a, b) => a.display.localeCompare(b.display)),
    [floor.persons],
  );

  return (
    <section className="border-b border-rule bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-end">
          <div>
            <p className="eyebrow mb-3">Interactive · 18th Lok Sabha chamber</p>
            <h1 className="font-display text-4xl leading-[1.08] text-ink sm:text-5xl">
              Walk the floor of the{" "}
              <span className="text-indelible">House of the People.</span>
            </h1>
          </div>
          <p className="text-base leading-relaxed text-muted lg:pb-1">
            All {floor.seats.length.toLocaleString("en-IN")} seats of the chamber,
            arranged as the House sits — treasury benches to the right of the
            Speaker&apos;s chair, the opposition to the left. Drag to orbit,
            scroll to zoom.{" "}
            <strong className="font-medium text-ink">
              Click any member to open their record.
            </strong>
          </p>
        </div>

        <div className="relative">
          {!failed ? (
            <>
              <SceneCanvas
                key={resetKey}
                floor={floor}
                onHover={handleHover}
                onSelectPerson={handleSelect}
                onFailure={handleFailure}
              />
              {hover ? (
                <div
                  className="pointer-events-none absolute z-20 w-64 rounded-lg border border-rule-strong bg-surface p-3 shadow-lg"
                  style={{
                    left: `min(max(${hover.px}px, 130px), calc(100% - 140px))`,
                    top: hover.py,
                    transform: "translate(-50%, calc(-100% - 16px))",
                  }}
                >
                  <p className="font-display text-sm leading-snug text-ink">{hover.person.display}</p>
                  {hover.person.role ? (
                    <p className="mt-0.5 text-xs font-medium text-indelible">{hover.person.role}</p>
                  ) : null}
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {hover.person.partyAbbr} · {hover.person.constituency},{" "}
                    {hover.person.stateOrUT}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-faint">
                    Open profile →
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <div
              role="alert"
              className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-rule-strong bg-paper p-6 text-center text-sm leading-relaxed text-muted"
            >
              3D rendering isn&apos;t available in this browser. Every named
              member remains reachable through the index below.
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p aria-live="polite" className="min-h-5 font-mono text-xs text-muted">
              {hover
                ? `${hover.person.name} — ${hover.person.partyAbbr}, ${hover.person.constituency}`
                : failed
                  ? "3D view unavailable"
                  : "Hover a figure to identify them; click to open their page."}
            </p>
            <div className="flex items-center gap-3">
              <FreshnessBadge snapshotDate={floor.snapshotLabel} />
              {!failed && (
                <button type="button" className="button secondary !py-1.5 text-xs" onClick={() => setResetKey((n) => n + 1)}>
                  Reset view
                </button>
              )}
            </div>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Party composition on the floor">
          {legend.map((entry) => (
            <li key={entry.label} className="flex items-baseline gap-1.5 font-mono text-xs text-muted">
              <span
                aria-hidden
                className="inline-block size-2.5 translate-y-[-1px] rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.label}
              <span className="tabular-nums text-faint">{entry.count}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-rule pt-6">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6">
            <h2 className="font-display text-lg text-ink">Named members on the floor</h2>
            <Link href="/parliament/lok-sabha" className="text-link text-sm">
              Full roster of {floor.sittingMembers} members →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
            {[floor.speaker, ...members].map((p) => (
              <li key={p.id}>
                <Link
                  href={`/people/${p.id}`}
                  className="group flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 no-underline transition-colors duration-200 hover:border-rule hover:bg-paper"
                >
                  <span
                    aria-hidden
                    className="inline-block size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: p.side === "chair" ? "#39415c" : partyColor(p.partyAbbr),
                    }}
                  />
                  <span className="min-w-0 truncate text-sm text-muted transition-colors group-hover:text-indelible">
                    {p.display}
                  </span>
                  <span className="ml-auto font-mono text-[0.62rem] text-faint">{p.partyAbbr}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[0.68rem] leading-relaxed text-faint">
            Seating follows published convention (treasury right of the Chair,
            opposition left; DMK seated apart since June 2026). Exact division
            numbers are not public; block positions are stylised.
          </p>
        </div>
      </div>
    </section>
  );
}
