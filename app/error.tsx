"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="eyebrow mb-3">Something went wrong</p>
      <h1 className="font-display text-4xl text-ink">The record could not be read</h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        An unexpected error interrupted this page. Nothing you do here affects
        the underlying datasets. Try again, or come back shortly.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-faint">Reference: {error.digest}</p>
      ) : null}
      <button type="button" onClick={reset} className="button mt-8">
        Try again
      </button>
    </div>
  );
}
