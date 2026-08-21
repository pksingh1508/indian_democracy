import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="eyebrow mb-3">404 · Not in the record</p>
      <h1 className="font-display text-4xl text-ink">This page isn&apos;t part of the record</h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        The address may be mistyped, or the record may not cover it yet — state
        legislatures and district offices are still outside the collected
        datasets.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="button">Go home</Link>
        <Link href="/search" className="button secondary">Search the record</Link>
      </div>
    </div>
  );
}
