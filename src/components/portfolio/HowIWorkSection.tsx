import { principles } from "@/data/content";

export function HowIWorkSection() {
  return (
    <div className="divide-y divide-line">
      {principles.map((principle, index) => (
        <article
          key={principle.title}
          className="py-10 first:pt-0 last:pb-0 md:py-12"
        >
          <p className="mb-2 font-mono text-xs text-muted" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="display text-[1.7rem] leading-tight sm:text-3xl">
            {principle.title}
          </h3>
          <p className="prose mt-5 md:mt-3">{principle.description}</p>
        </article>
      ))}
    </div>
  );
}
