import type { ReactNode } from "react";
import { profile } from "@/data/content";
import { BrandMark } from "@/components/BrandMark";

export function Meta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`font-mono text-xs text-muted ${className}`}>{children}</p>;
}

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
      Resume (PDF)
    </a>
  );
}

export function ContactLinks({ className = "" }: { className?: string }) {
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

export function TagRow({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
      {tags.map((tag) => (
        <li
          key={tag}
          className="raised flex items-center gap-1.5 border border-line px-2 py-1"
        >
          <BrandMark name={tag} size={12} />
          {tag}
        </li>
      ))}
    </ul>
  );
}
