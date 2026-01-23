import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import Section from "../components/sections/Section.jsx";
import Card from "../components/ui/Card.jsx";
import MapView from "../components/MapView.jsx";
import { useI18n } from "../i18n/i18n.jsx";

const MAP_PREVIEW_IMG =
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80";

export default function Home() {
  const { lang, t } = useI18n();

  const title = lang === "en" ? "Secrets of Harresë" : "Sekretet e Harresës";
  const desc =
    lang === "en"
      ? "A cultural route connecting Levan – Shtyllas – Apollonia, with stories, gallery and an interactive map."
      : "Shteg turistik-kulturor Levan – Shtyllas – Apolloni, me histori, galeri dhe hartë interaktive.";

  return (
    <main>
      <SEO title={title} description={desc} lang={lang} />

      {/* HERO */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-zinc-900" />
                {lang === "en" ? "Tourism & Culture" : "Turizëm & Kulturë"}
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
                {desc}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/trail" className="btn btn-primary">
                  {lang === "en" ? "Explore Trail" : "Shiko Shtegun"}
                </Link>
                <Link to="/map" className="btn btn-outline">
                  {lang === "en" ? "Open Map" : "Hap Hartën"}
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 max-w-xl">
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">4+</div>
                  <div className="text-xs text-zinc-600">
                    {lang === "en" ? "Key points" : "Pika kryesore"}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">Map</div>
                  <div className="text-xs text-zinc-600">
                    {lang === "en" ? "Interactive" : "Interaktive"}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    Blog
                  </div>
                  <div className="text-xs text-zinc-600">
                    {lang === "en" ? "Stories" : "Histori"}
                  </div>
                </Card>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 shadow-sm">
                <img
                  src={MAP_PREVIEW_IMG}
                  alt="Map preview"
                  className="h-[360px] w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    {lang === "en" ? "Apollonia" : "Apollonia"}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600">
                    {lang === "en" ? "Archaeological park" : "Park arkeologjik"}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    {lang === "en" ? "Bylis" : "Bylis"}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600">
                    {lang === "en" ? "Ancient city" : "Qytet antik"}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HARTA (Ballina) */}
      <Section
        title={lang === "en" ? "Interactive Map" : "Harta Interaktive"}
        subtitle={
          lang === "en"
            ? "Click markers to open a post or the trail page."
            : "Kliko pikat për të hapur një artikull ose faqen e shtegut."
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <MapView />

          {/* Preview panel (me foto placeholder) */}
          <Card className="overflow-hidden">
            <img
              src={MAP_PREVIEW_IMG}
              alt="Cultural route"
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <div className="text-sm font-semibold text-zinc-900">
                {lang === "en" ? "Route highlights" : "Pikat kryesore"}
              </div>
              <p className="mt-2 text-sm text-zinc-600">
                {lang === "en"
                  ? "Apollonia, Bylis and Ardenica in one interactive experience—open the map for details."
                  : "Apollonia, Bylis dhe Ardenica në një eksperiencë interaktive—hap hartën për detaje."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/map" className="btn btn-primary">
                  {lang === "en" ? "Open full map" : "Hap hartën e plotë"}
                </Link>
                <Link to="/blog" className="btn btn-outline">
                  {lang === "en" ? "Read posts" : "Lexo postimet"}
                </Link>
              </div>

              <div className="mt-5 text-xs text-zinc-500">
                {lang === "en"
                  ? "Tip: Use zoom and click markers."
                  : "Tip: Përdor zoom dhe kliko pikat."}
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
