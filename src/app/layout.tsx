import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import { profile } from "@/data/content";
import "./globals.css";

/* Named by role, not by typeface, so swapping one is a one-file change.
   Bricolage Grotesque is variable across weight, width and optical size, so
   one file covers headings at 44px and company names at 24px — which the
   previous single-weight serif could not. */
const display = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"], // Plex Mono isn't variable — weights must be explicit
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
};

// Sets data-theme on <html> before first paint so there's no flash of the
// wrong mode. Inline because it must run ahead of hydration — React state
// can't execute early enough.
const noFlashThemeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body className="min-h-full">
        {/* The sidebar's six links come first in the DOM at every width, so
            without this every keyboard pass walks the whole nav to reach the
            page. Hidden until focused; #overview already carries the anchor
            headroom that keeps it clear of the mobile bar. */}
        <a
          href="#overview"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
