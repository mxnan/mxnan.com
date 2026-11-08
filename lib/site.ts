const FALLBACK_SITE_URL = "https://mxnan.vercel.app";

/**
 * Canonical origin for the whole site.
 *
 * Set NEXT_PUBLIC_APP_URL in production (e.g. https://mxnan.vercel.app).
 * The fallback keeps builds working if the env var is missing.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL?.trim() || FALLBACK_SITE_URL
).replace(/\/+$/, "");

export const SITE_NAME = "mxnan";
export const SITE_LOCALE = "en_US";

export const SITE_TITLE =
  "mxnan — Freelance Product Design & Front-End";

export const SITE_DESCRIPTION =
  "Freelance product design and front-end for early-stage teams. Clear decisions, fast turnarounds, and readable code. Reply within 48 hours.";

export const SITE_KEYWORDS = [
  "freelance product design",
  "freelance front-end developer",
  "Next.js developer",
  "React developer",
  "landing page design",
  "product design",
  "UX design",
  "web development",
  "mxnan",
];

export const DEFAULT_OG_IMAGE = "/og/default.jpg";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
