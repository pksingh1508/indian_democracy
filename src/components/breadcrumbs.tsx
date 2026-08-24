import Link from "next/link";
import { Fragment } from "react";
import { Reveal } from "@/src/components/motion-primitives";

export interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <Reveal load y={8}>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-1.5 font-mono text-xs text-faint">
          {items.map((item, i) => (
            <Fragment key={item.href}>
              {i > 0 && (
                <li aria-hidden className="select-none">
                  /
                </li>
              )}
              <li>
                {i === items.length - 1 ? (
                  <span aria-current="page" className="text-muted">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="text-faint no-underline hover:text-indelible">
                    {item.label}
                  </Link>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
    </Reveal>
  );
}
