import { uniquePartyOptions } from "@/src/lib/data/parliament";
import type { PartyCount } from "@/src/lib/data/parliament";

export interface ChamberFilterValues {
  q?: string;
  party?: string;
  state?: string;
}

/**
 * Plain GET form — filtering works with JavaScript disabled.
 * Values round-trip through the URL; the server re-renders the table.
 */
export function MemberFilters({
  action,
  partyCounts,
  stateNames,
  current,
}: {
  action: string;
  partyCounts: PartyCount[];
  stateNames: string[];
  current: ChamberFilterValues;
}) {
  const parties = uniquePartyOptions(partyCounts);
  return (
    <form action={action} method="GET" role="search" aria-label="Filter members" className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="f-q" className="font-mono text-[0.7rem] uppercase tracking-wide text-faint">
          Name / constituency
        </label>
        <input
          id="f-q"
          type="search"
          name="q"
          defaultValue={current.q ?? ""}
          placeholder="e.g. Gandhinagar"
          className="input w-56"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="f-party" className="font-mono text-[0.7rem] uppercase tracking-wide text-faint">
          Party
        </label>
        <select id="f-party" name="party" defaultValue={current.party ?? ""} className="select w-52">
          <option value="">All parties</option>
          {parties.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="f-state" className="font-mono text-[0.7rem] uppercase tracking-wide text-faint">
          State / UT
        </label>
        <select id="f-state" name="state" defaultValue={current.state ?? ""} className="select w-52">
          <option value="">All states &amp; UTs</option>
          {stateNames.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="button">Apply filters</button>
      {(current.q || current.party || current.state) && (
        <a href={action + "#members"} className="text-link text-sm py-2.5">
          Clear
        </a>
      )}
    </form>
  );
}

export function applyMemberFilters<T>(
  members: T[],
  filters: ChamberFilterValues,
  fieldsFor: (m: T) => {
    haystack: string;
    partyKey: string;
    state: string;
  },
): T[] {
  let out = members;
  const { q, party, state } = filters;
  if (party) out = out.filter((m) => fieldsFor(m).partyKey === party);
  if (state) out = out.filter((m) => fieldsFor(m).state === state);
  if (q && q.trim().length >= 2) {
    const needle = q.trim().toLowerCase();
    out = out.filter((m) => fieldsFor(m).haystack.includes(needle));
  }
  return out;
}
