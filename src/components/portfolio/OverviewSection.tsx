import { about, profile } from "@/data/content";
import { ContributionGraph } from "@/components/ContributionGraph";
import { OverviewIntro } from "@/components/OverviewIntro";
import { ContactLinks } from "./PortfolioUI";

export function OverviewSection() {
  return (
    <>
      <OverviewIntro
        tagline={profile.tagline}
        lede={about.lede}
        paragraphs={about.paragraphs}
      />
      <dl className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { k: "Currently Exploring", v: "Full-stack + AI" },
          { k: "Based", v: profile.location },
          { k: "Shipping since", v: "2023" },
        ].map((fact) => (
          <div key={fact.k} className="flex flex-col border border-line p-4">
            <dt className="font-mono text-xs text-muted">{fact.k}</dt>
            <dd className="mt-1">{fact.v}</dd>
          </div>
        ))}
      </dl>
      <ContactLinks className="mt-8" />
      <ContributionGraph />
    </>
  );
}
