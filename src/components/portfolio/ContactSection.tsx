import { profile } from "@/data/content";
import { BrandMark } from "@/components/BrandMark";
import { ContactLinks } from "./PortfolioUI";

export function ContactSection() {
  return (
    <>
      <p className="prose">
        Based in {profile.location}, open to remote work and collaborations. Email is
        the fastest way to reach me.
      </p>
      <ContactLinks className="mt-6" />
      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        {profile.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted transition-colors hover:text-foreground"
            >
              <BrandMark name={social.label} size={16} />
              {social.label}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-16 font-mono text-xs text-muted">Built with Next.js and Tailwind.</p>
    </>
  );
}
