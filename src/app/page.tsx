import { Sidebar } from "@/components/Sidebar";
import { Section } from "@/components/Section";
import { BrandMark, hasMark } from "@/components/BrandMark";
import { Stagger } from "@/components/Stagger";
import { ContributionGraph } from "@/components/ContributionGraph";
import { Lede } from "@/components/Lede";
import {
  about,
  experience,
  principles,
  profile,
  projects,
  stack,
} from "@/data/content";

/** Small mono label used for metadata rows — the one place mono earns its keep. */
function Meta({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-mono text-xs text-muted ${className}`}>{children}</p>
  );
}

/** Rendered twice — top of Overview, where a recruiter lands, and in Contact
 *  where the rest of the reach-me links live. */
function ResumeLink() {
  return (
    <a
      href={profile.resume}
      download
      className="raised inline-flex items-center gap-2 border border-line px-4 py-2.5 text-muted hover:border-accent hover:text-foreground"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2" />
      </svg>
      {/* Format in the label, not just the icon — it's the difference
          between knowing what lands in your downloads and guessing. */}
      Résumé (PDF)
    </a>
  );
}

/** Email leads, résumé follows in muted — the copy says email is the fastest
 *  way to reach me, and two equally loud buttons would contradict it. */
function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={`mailto:${profile.email}`}
        className="raised inline-flex items-center gap-2 border border-line px-4 py-2.5 text-accent hover:border-accent"
      >
        {profile.email}
      </a>

      <ResumeLink />
    </div>
  );
}

/** Tag rows carry a brand mark where one exists — "Zero-dep" and "TUI" aren't
 *  brands, so those render as plain text and the row absorbs it. */
function TagRow({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
      {tags.map((t) => (
        <li
          key={t}
          className="raised flex items-center gap-1.5 border border-line px-2 py-1"
        >
          <BrandMark name={t} size={12} />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <div className="lg:pl-72">
      <Sidebar />

      <main className="mx-auto max-w-3xl px-5 pt-10 lg:pt-0 pb-24 md:px-10">
        <Section id="overview" title="Overview">
          <div className="prose">
            {/* The lede sits *under* the section heading in the hierarchy, so
                it takes the display face at normal weight — at 600 it read
                heavier than the h2 above it. */}
            <Lede
              text={profile.tagline}
              className="display text-[clamp(1.4rem,2.6vw,1.85rem)] leading-snug font-medium sm:font-normal"
            />
            <p className="mt-6">{about.lede}</p>
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { k: "Currently Exploring", v: "Full-stack + AI" },
              { k: "Based", v: profile.location },
              { k: "Shipping since", v: "2023" },
            ].map((f) => (
              <div key={f.k} className="flex flex-col border border-line p-4">
                <dt className="font-mono text-xs text-muted">{f.k}</dt>
                <dd className="mt-1">{f.v}</dd>
              </div>
            ))}
          </dl>

          {/* Up here because it's the first thing anyone hiring looks for —
              the copy in Contact still points at email as the way to reach me. */}
          <ContactLinks className="mt-8" />

          <ContributionGraph />
        </Section>

        <Section id="experience" title="Experience">
          {/* A hairline between roles. On a phone the entries stacked into one
              continuous column of text and the only cue that a new job had
              started was a slightly larger line. */}
          <div className="divide-y divide-line [&>*+*]:pt-12">
            {experience.map((role) => (
              <article key={role.company} className="relative pb-12 last:pb-0">
                <h3 className="display text-[1.7rem] leading-tight sm:text-3xl">
                  {role.company}
                </h3>
                {/* Role title is a subtitle, not machine metadata — it reads
                    better in the body face than in mono. */}
                <p className="mt-0.5 text-sm text-muted">{role.title}</p>
                <Meta className="mt-2 font-medium">{role.period}</Meta>

                {/* Muted: this is the summary, the bullets under it are the
                    substance. Same size, one shade back. */}
                <p className="prose prose-secondary mt-4">{role.blurb}</p>

                {role.detail.length > 0 && (
                  <ul className="prose mt-4 space-y-2">
                    {role.detail.map((d) => (
                      <li key={d} className="flex gap-3">
                        {/* The ❏ glyph, drawn instead of typed: a square with
                            a hard offset shadow — the same double-outline read
                            as .raised. A box aligns to the text baseline on
                            its own margin, where the character's size and
                            position depended on whichever font actually
                            carried it. */}
                        <span
                          aria-hidden="true"
                          className="mt-[0.5em] h-2 w-2 shrink-0 border border-accent shadow-[2px_2px_0_0_var(--accent)]"
                        />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <TagRow tags={role.tags} />
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects">
          {projects.length === 0 ? (
            // An honest empty state beats four entries linking to github.com.
            <p className="prose">
              Nothing worth showing here yet — the work that best represents me
              right now is under <a href="#experience">Experience</a>.
            </p>
          ) : (
            <div className="divide-y divide-line [&>*+*]:pt-12">
              {projects.map((p) => (
                <article key={p.name} className="relative pb-12 last:pb-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h3 className="display text-[1.7rem] leading-tight sm:text-3xl">
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {p.name}
                        <span
                          aria-hidden="true"
                          className="ml-2 text-base text-muted"
                        >
                          ↗
                        </span>
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </h3>
                  </div>
                  <p className="prose mt-3">{p.detail}</p>
                  <TagRow tags={p.tags} />
                </article>
              ))}
            </div>
          )}
        </Section>

        <Section id="how-i-work" title="How I work">
          <div className="space-y-10 lg:space-y-16">
            {principles.map((pr) => (
              <article key={pr.title}>
                <h3 className="display text-[1.7rem] leading-tight sm:text-3xl">
                  {pr.title}
                </h3>
                <p className="prose mt-3">{pr.body}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* Stack was the plainest section on the page — thirteen words in
            thirteen boxes. The marks are what give it something to look at. */}
        <Section id="stack" title="Stack">
          <div className="space-y-8">
            {stack.map((group) => (
              <div key={group.group}>
                <Meta>{group.group}</Meta>
                <Stagger
                  className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 xl:grid-cols-4"
                  itemClassName="stack-item raised flex items-center gap-2.5 border border-line p-2.5 text-sm"
                  items={group.items.map((item) => ({
                    key: item,
                    mark: hasMark(item) ? (
                      <BrandMark name={item} size={18} />
                    ) : undefined,
                    node: (
                      /* 18px mark + 10px gap — keeps markless items on the
                         same text column as the rest of the grid. */
                      <span className={hasMark(item) ? "" : "pl-7"}>
                        {item}
                      </span>
                    ),
                  }))}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <p className="prose">
            Based in {profile.location}, open to remote work and collaborations.
            Email is the fastest way to reach me.
          </p>

          {/* Out of the display face: at 36px it fought the mono metadata
              beside it, and a mail link is a control, not a headline. */}
          <ContactLinks className="mt-6" />

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted transition-colors hover:text-foreground"
                >
                  <BrandMark name={s.label} size={16} />
                  {s.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-16 font-mono text-xs text-muted">
            Built with Next.js and Tailwind.
          </p>
        </Section>
      </main>
    </div>
  );
}
