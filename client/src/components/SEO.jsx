import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useI18n } from "../i18n/i18n.jsx";

const SITE_NAME = "Sekretet e Harresës";
const DEFAULT_OG_IMAGE = "/og-default.jpg"; // vendose te client/public/og-default.jpg (opsionale)

function clean(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function SEO({
  title,
  description,
  image,
  canonical, // optional
  noindex = false,
}) {
  const { lang } = useI18n();
  const loc = useLocation();

  const origin = import.meta.env.VITE_SITE_ORIGIN || window.location.origin;

  const path = canonical || loc.pathname + loc.search;
  const url = path.startsWith("http") ? path : `${origin}${path}`;

  const metaTitle = clean(title) ? `${clean(title)} • ${SITE_NAME}` : SITE_NAME;
  const metaDesc =
    clean(description) ||
    "Portal turistik-kulturor për shtegun Levan–Shtyllas–Apolloni.";

  const ogImage = image || DEFAULT_OG_IMAGE;
  const ogImageAbs = ogImage.startsWith("http")
    ? ogImage
    : `${origin}${ogImage}`;

  // Hreflang (same URL, different lang via localStorage; still useful as signals)
  const altSQ = url;
  const altEN = url;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />

      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={ogImageAbs} />
      <meta property="og:locale" content={lang === "sq" ? "sq_AL" : "en_US"} />

      {/* Twitter (optional but nice) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImageAbs} />

      {/* hreflang */}
      <link rel="alternate" hrefLang="sq" href={altSQ} />
      <link rel="alternate" hrefLang="en" href={altEN} />
      <link rel="alternate" hrefLang="x-default" href={altSQ} />
    </Helmet>
  );
}
