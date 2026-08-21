import { partyColor } from "@/src/lib/parties";

export function PartyTag({
  name,
  abbreviation,
  className = "",
}: {
  name: string;
  abbreviation?: string | null;
  className?: string;
}) {
  const color = partyColor(abbreviation ?? name);
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        aria-hidden
        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
        style={{ backgroundColor: color }}
      />
      <span>{abbreviation ?? name}</span>
    </span>
  );
}

export function PartySwatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-3 w-3 shrink-0 rounded-[3px] border border-black/10"
      style={{ backgroundColor: color }}
    />
  );
}
