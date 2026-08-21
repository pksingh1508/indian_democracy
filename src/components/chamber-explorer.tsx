"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import type { SeatPoint3D } from "@/src/components/chamber-explorer";

const Chamber3DCanvas = dynamic(
  () => import("@/src/components/chamber-3d-canvas").then((m) => m.Chamber3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-rule bg-surface text-sm text-muted">
        Loading 3D view…
      </div>
    ),
  },
);

/**
 * Opt-in 3D chamber view. The Three.js bundle loads only after the user
 * chooses "Explore in 3D"; without it the page stays fully usable.
 * Reset remounts the canvas at its initial camera position.
 */
export function ChamberExplorer({
  houseName,
  points,
  blockKeys,
}: {
  houseName: string;
  points: SeatPoint3D[];
  blockKeys: string[];
}) {
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selected, setSelected] = useState<SeatPoint3D | null>(null);

  const handleFailure = useCallback(() => setFailed(true), []);

  return (
    <div className="rounded-lg border border-rule bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="max-w-xl">
          <h2 className="font-display text-xl text-ink">Explore in 3D</h2>
          <p className="text-sm leading-relaxed text-muted">
            Optional conceptual model of {houseName}&apos;s composition — drag to
            orbit, scroll to zoom. The party table above remains the
            authoritative data view; seat positions are stylistic.
          </p>
        </div>
        {!active && !failed && (
          <button type="button" className="button" onClick={() => setActive(true)}>
            Load 3D view ({points.length.toLocaleString("en-IN")} seats)
          </button>
        )}
        {active && !failed && (
          <div className="flex gap-2">
            <button
              type="button"
              className="button secondary"
              onClick={() => setResetKey((n) => n + 1)}
            >
              Reset camera
            </button>
            <button type="button" className="button secondary" onClick={() => setActive(false)}>
              Close
            </button>
          </div>
        )}
      </div>

      {failed && (
        <p
          role="alert"
          className="mx-5 mb-5 rounded-lg border border-dashed border-rule-strong bg-paper p-4 text-sm leading-relaxed text-muted"
        >
          3D rendering isn&apos;t available in this browser, or the WebGL context
          was lost. The composition table and the 2D chamber view carry exactly
          the same information.
        </p>
      )}

      {active && !failed && (
        <div className="px-5 pb-5">
          <Chamber3DCanvas
            key={resetKey}
            points={points}
            blockKeys={blockKeys}
            onSelect={setSelected}
            onFailure={handleFailure}
          />
          <p aria-live="polite" className="mt-2 min-h-5 font-mono text-xs text-muted">
            {selected
              ? `Selected group: ${selected.blockKey === "__vacant" ? "Vacant seat" : selected.blockKey}`
              : "Click a seat to identify its group."}
          </p>
        </div>
      )}
    </div>
  );
}
