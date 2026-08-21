import type { MetadataRoute } from "next";
import { states } from "@/src/lib/data/geography";
import { highCourtJurisdictions } from "@/src/lib/data/judiciary";
import {
  lokSabhaMembers,
  rajyaSabhaMembers,
} from "@/src/lib/data/parliament";
import { councilOfMinisters } from "@/src/lib/data/executive";
import { supremeCourtJudges } from "@/src/lib/data/judiciary";
import { slugify } from "@/src/lib/format";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lokkosh.example.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const snapshot = new Date("2026-08-21");

  const staticRoutes = [
    "",
    "/parliament",
    "/parliament/lok-sabha",
    "/parliament/rajya-sabha",
    "/institutions",
    "/states",
    "/high-courts",
    "/people",
    "/search",
    "/methodology",
    "/sources",
    "/coverage",
    "/corrections",
    ...[
      "president",
      "vice-president",
      "prime-minister",
      "union-council-of-ministers",
      "supreme-court",
      "election-commission",
      "comptroller-and-auditor-general",
      "union-public-service-commission",
      "state-executive-and-legislatures",
      "local-government",
    ].map((s) => `/institutions/${s}`),
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: snapshot,
  }));

  const peopleIds = [
    ...lokSabhaMembers.map((m) => m.id),
    ...rajyaSabhaMembers.map((m) => m.id),
    ...councilOfMinisters.ministers.map((m) => m.id),
    ...supremeCourtJudges.map((j) => j.id),
    "president-of-india",
    "vice-president-of-india",
    "prime-minister-of-india",
  ];

  return [
    ...staticRoutes,
    ...states.map((s) => ({
      url: `${BASE}/states/${slugify(s.stateName)}`,
      lastModified: snapshot,
    })),
    ...highCourtJurisdictions.map((c) => ({
      url: `${BASE}/high-courts/${c.id}`,
      lastModified: snapshot,
    })),
    ...peopleIds.map((id) => ({
      url: `${BASE}/people/${id}`,
      lastModified: snapshot,
    })),
  ];
}
