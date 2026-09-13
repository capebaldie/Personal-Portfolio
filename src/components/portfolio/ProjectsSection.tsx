import { projects } from "@/data/content";
import { Meta, TagRow } from "./PortfolioUI";

export function ProjectsSection() {
  if (projects.length === 0) {
    return (
      <p className="prose">
        Nothing worth showing here yet — the work that best represents me right now
        is under <a href="#experience">Experience</a>.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8">
      {projects.map((project) => (
        <article
          key={project.name}
          className="border border-line bg-background p-5 sm:p-6"
        >
          <div
            role="img"
            aria-label={project.imageLabel}
            className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border border-line bg-surface"
          >
            <span className="absolute inset-4 border border-dashed border-line" />
            <span className="relative font-mono text-xs text-muted">
              interface preview
            </span>
          </div>
          <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h3 className="display text-[1.7rem] leading-tight sm:text-3xl">
              <a href={project.href} className="transition-colors hover:text-accent">
                {project.name}
                <span aria-hidden="true" className="ml-2 text-base text-muted">
                  ↗
                </span>
              </a>
            </h3>
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
            <p className="font-mono text-xs text-muted">{project.category}</p>
            <Meta className="shrink-0">{project.year}</Meta>
          </div>
          <p className="prose mt-5">{project.detail}</p>
          <TagRow tags={project.tags} />
          <a
            href={project.href}
            className="mt-5 inline-flex items-center gap-2 text-sm text-accent underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
          >
            View project <span aria-hidden="true">→</span>
          </a>
        </article>
      ))}
    </div>
  );
}
