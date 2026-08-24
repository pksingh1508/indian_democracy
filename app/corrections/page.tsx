import type { Metadata } from "next";
import { PageHeader } from "@/src/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/src/components/motion-primitives";

export const metadata: Metadata = {
  title: "Corrections",
  description:
    "How to report an error in this public record, and what happens next.",
};

const STEPS = [
  {
    title: "Identify the page",
    body: "Give the exact page URL and quote the fact you believe is wrong.",
  },
  {
    title: "Bring the source",
    body: "Point us to an official record — a gazette notification, roster, order, or the institution's own current page — that supports the correction.",
  },
  {
    title: "We check and publish",
    body: "Verified errors are corrected promptly against the official record. The dataset's checked date is updated, and material corrections get a visible note.",
  },
];

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="Accountability"
        title="Corrections"
        lede="This record is built from official sources, but records age and rosters change. If a fact here is wrong or stale, we want to hear it."
      />

      <Stagger as="ol" className="mt-10 space-y-8" stagger={0.1}>
        {STEPS.map((step, i) => (
          <StaggerItem key={step.title} as="li" className="flex gap-5">
            <span
              aria-hidden
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indelible/40 bg-indelible-tint font-mono text-sm text-indelible"
            >
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">{step.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-10">
        <div className="rounded-lg border border-rule bg-surface p-6">
          <h2 className="font-display text-lg text-ink">Report a correction</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Email{" "}
            <a href="mailto:corrections@indian-democracy.example.org" className="text-link">
              corrections@indian-democracy.example.org
            </a>{" "}
            with the page, the disputed fact, and your supporting source.
            High-risk corrections about named individuals are acknowledged within
            one business day. Reporter contact details are never published.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
