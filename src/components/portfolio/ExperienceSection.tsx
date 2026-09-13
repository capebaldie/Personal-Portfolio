import { experience } from "@/data/content";
import { Meta, TagRow } from "./PortfolioUI";

export function ExperienceSection() {
  return (
    <div className="divide-y divide-line [&>*+*]:pt-14 md:[&>*+*]:pt-12">
      {experience.map((role) => (
        <article key={role.company} className="relative pb-14 last:pb-0 md:pb-12">
          <h3 className="display text-[1.7rem] leading-tight sm:text-3xl">
            {role.company}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{role.title}</p>
          <Meta className="mt-2 font-medium">{role.period}</Meta>
          <p className="prose prose-secondary mt-5 md:mt-4">{role.blurb}</p>
          {role.detail.length > 0 && (
            <ul className="prose mt-5 space-y-2 md:mt-4">
              {role.detail.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.5em] h-2 w-2 shrink-0 border border-accent shadow-[2px_2px_0_0_var(--accent)]"
                  />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
          <TagRow tags={role.tags} />
        </article>
      ))}
    </div>
  );
}
