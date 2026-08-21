import Link from "next/link";

export interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, lede, meta, children }: PageHeaderProps) {
  return (
    <div className="border-b border-rule pb-8">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
      {lede ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{lede}</p> : null}
      {meta ? <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div> : null}
      {children}
    </div>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  aside,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {aside ? <div className="text-sm text-muted">{aside}</div> : null}
      </div>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : <div className="mb-4" />}
    </div>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  buildHref,
}: {
  page: number;
  pageSize: number;
  total: number;
  buildHref: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) {
    return (
      <p className="font-mono text-xs text-faint">
        {total.toLocaleString("en-IN")} records
      </p>
    );
  }
  const windowStart = Math.max(1, Math.min(page - 2, pages - 4));
  const windowEnd = Math.min(pages, windowStart + 4);
  const nums: number[] = [];
  for (let p = windowStart; p <= windowEnd; p++) nums.push(p);

  const linkCls =
    "inline-flex min-w-9 justify-center rounded-md border px-2.5 py-1.5 font-mono text-xs no-underline";
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1.5">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className={`${linkCls} border-rule text-muted hover:border-indelible hover:text-indelible`}>
          ← Prev
        </Link>
      ) : null}
      {windowStart > 1 && (
        <>
          <Link href={buildHref(1)} className={`${linkCls} border-rule text-muted hover:border-indelible hover:text-indelible`}>1</Link>
          <span className="text-faint">…</span>
        </>
      )}
      {nums.map((p) =>
        p === page ? (
          <span
            key={p}
            aria-current="page"
            className={`${linkCls} border-indelible bg-indelible-tint font-medium text-indelible`}
          >
            {p}
          </span>
        ) : (
          <Link key={p} href={buildHref(p)} className={`${linkCls} border-rule text-muted hover:border-indelible hover:text-indelible`}>
            {p}
          </Link>
        ),
      )}
      {windowEnd < pages && (
        <>
          <span className="text-faint">…</span>
          <Link href={buildHref(pages)} className={`${linkCls} border-rule text-muted hover:border-indelible hover:text-indelible`}>{pages}</Link>
        </>
      )}
      {page < pages ? (
        <Link href={buildHref(page + 1)} className={`${linkCls} border-rule text-muted hover:border-indelible hover:text-indelible`}>
          Next →
        </Link>
      ) : null}
      <span className="ml-2 font-mono text-xs text-faint">
        {(total === 0 ? 0 : (page - 1) * pageSize + 1).toLocaleString("en-IN")}–
        {Math.min(page * pageSize, total).toLocaleString("en-IN")} of{" "}
        {total.toLocaleString("en-IN")}
      </span>
    </nav>
  );
}
