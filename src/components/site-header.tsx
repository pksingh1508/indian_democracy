"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, formatSnapshotDate } from "@/src/lib/site";

const NAV = [
  { href: "/parliament", label: "Parliament" },
  { href: "/institutions", label: "Institutions" },
  { href: "/states", label: "States & UTs" },
  { href: "/high-courts", label: "High Courts" },
  { href: "/people", label: "People" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-rule bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className={`flex items-baseline gap-2 no-underline focus-visible:outline-2 ${
            pathname === "/" ? "text-indelible" : "text-ink"
          }`}
        >
          <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight text-inherit transition-colors duration-200 hover:text-indelible">
            {SITE.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="order-4 w-full md:order-none md:w-auto">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            {NAV.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      isActive
                        ? pathname === item.href
                          ? "page"
                          : "location"
                        : undefined
                    }
                    className={`relative font-medium no-underline transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-indelible after:transition-transform after:duration-300 after:ease-out hover:text-indelible hover:after:scale-x-100 ${
                      isActive
                        ? "text-indelible after:scale-x-100"
                        : "text-muted after:scale-x-0"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/coverage"
            title="Dataset snapshot date — see coverage report"
            aria-current={pathname === "/coverage" ? "page" : undefined}
            className={`hidden rounded-full border px-2.5 py-1 font-mono text-[0.65rem] tracking-wide no-underline transition-colors duration-200 hover:border-indelible hover:text-indelible lg:inline-block ${
              pathname === "/coverage"
                ? "border-indelible bg-indelible-tint text-indelible"
                : "border-rule text-muted"
            }`}
          >
            snapshot · {formatSnapshotDate(SITE.snapshotDate)}
          </Link>
          <Link
            href="/search"
            aria-current={pathname === "/search" ? "page" : undefined}
            className={`button secondary !px-3 !py-1.5 ${
              pathname === "/search"
                ? "!border-indelible !bg-indelible-tint"
                : ""
            }`}
          >
            Search
          </Link>
        </div>
      </div>
    </header>
  );
}
