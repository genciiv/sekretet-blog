// FILE: client/src/pages/About.jsx
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n.jsx";
import SEO from "../components/SEO.jsx";
import Section from "../components/sections/Section.jsx";
import Card from "../components/ui/Card.jsx";

const HERO_IMG =
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80";

export default function About() {
  const { lang } = useI18n();
  const isSQ = lang === "sq";

  const title = isSQ ? "Rreth nesh" : "About";
  const seoTitle = isSQ ? "Rreth nesh • Sekretet e Harresës" : "About • Secrets of Harresë";
  const desc = isSQ
    ? "Misioni, qëllimi dhe ideja e shtegut turistik-kulturor Levan – Shtyllas – Apolloni."
    : "Mission, purpose and idea of the cultural route Levan – Shtyllas – Apollonia.";

  return (
    <main>
      <SEO title={seoTitle} description={desc} lang={lang} />

      {/* HERO */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-zinc-900" />
                {isSQ ? "Turizëm & Kulturë" : "Tourism & Culture"}
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
                {title}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600">
                {isSQ ? (
                  <>
                    “Sekretet e Harresës” është një portal informues për shtegun
                    turistik-kulturor <b>Levan – Shtyllas – Apolloni</b>. Qëllimi është të
                    sjellë histori, trashëgimi, natyrë dhe orientim praktik (hartë & itinerar)
                    në një vend të vetëm.
                  </>
                ) : (
                  <>
                    “Secrets of Harresë” is an informational portal for the cultural route{" "}
                    <b>Levan – Shtyllas – Apollonia</b>. The goal is to bring history,
                    heritage, nature, and practical guidance (map & itinerary) into one place.
                  </>
                )}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/trail" className="btn btn-primary">
                  {isSQ ? "Shiko Shtegun" : "Explore Trail"}
                </Link>
                <Link to="/map" className="btn btn-outline">
                  {isSQ ? "Harta" : "Map"}
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  {isSQ ? "Kontakto" : "Contact"}
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 shadow-sm">
              <img
                src={HERO_IMG}
                alt="About"
                className="h-[320px] w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MISIONI / VIZIONI / QËLLIMI */}
      <Section
        title={isSQ ? "Qëllimi & Misioni" : "Purpose & Mission"}
        subtitle={
          isSQ
            ? "Një përmbledhje e shkurtër pse ekziston ky projekt."
            : "A short overview of why this project exists."
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">
              {isSQ ? "Misioni" : "Mission"}
            </div>
            <p className="mt-2 text-sm text-zinc-600 leading-6">
              {isSQ
                ? "Të promovojmë trashëgiminë kulturore dhe natyrore të zonës përmes informacionit të thjeshtë, të saktë dhe të aksesueshëm."
                : "To promote the area's cultural and natural heritage through simple, accurate and accessible information."}
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">
              {isSQ ? "Vizioni" : "Vision"}
            </div>
            <p className="mt-2 text-sm text-zinc-600 leading-6">
              {isSQ
                ? "Një guidë moderne për vizitorët dhe komunitetin, ku historia lidhet me itinerarin real dhe përvojën në terren."
                : "A modern guide for visitors and the community—connecting history with real routes and on-the-ground experiences."}
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">
              {isSQ ? "Çfarë ofron" : "What it offers"}
            </div>
            <p className="mt-2 text-sm text-zinc-600 leading-6">
              {isSQ
                ? "Artikuj, galeri, hartë interaktive dhe pika orientuese për Levan, Shtyllas, Apolloni (dhe më tej)."
                : "Articles, gallery, interactive map and key points for Levan, Shtyllas, Apollonia (and beyond)."}
            </p>
          </Card>
        </div>
      </Section>

      {/* SHTEGU */}
      <Section
        title={isSQ ? "Shtegu Levan – Shtyllas – Apolloni" : "The Route"}
        subtitle={
          isSQ
            ? "Tre pika të lidhura me histori, natyrë dhe trashëgimi."
            : "Three points connected by history, nature, and heritage."
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">
              {isSQ ? "Levan" : "Levan"}
            </div>
            <p className="mt-2 text-sm text-zinc-600 leading-6">
              {isSQ
                ? "Pika hyrëse e itinerarit dhe nisja praktike për të eksploruar zonën."
                : "The entry point of the itinerary and a practical start to explore the area."}
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">
              {isSQ ? "Shtyllas" : "Shtyllas"}
            </div>
            <p className="mt-2 text-sm text-zinc-600 leading-6">
              {isSQ
                ? "Natyrë, reliev dhe panorama—pjesa më “outdoor” e shtegut."
                : "Nature, terrain and panoramic views—the most “outdoor” part of the route."}
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">
              {isSQ ? "Apollonia" : "Apollonia"}
            </div>
            <p className="mt-2 text-sm text-zinc-600 leading-6">
              {isSQ
                ? "Trashëgimi arkeologjike dhe histori—qendra kulturore e itinerarit."
                : "Archaeological heritage and history—the cultural core of the itinerary."}
            </p>
          </Card>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/blog" className="btn btn-primary">
            {isSQ ? "Lexo artikujt" : "Read articles"}
          </Link>
          <Link to="/gallery" className="btn btn-outline">
            {isSQ ? "Shiko galerinë" : "View gallery"}
          </Link>
          <Link to="/map" className="btn btn-outline">
            {isSQ ? "Hap hartën" : "Open map"}
          </Link>
        </div>
      </Section>

      {/* CTA */}
      <Section
        title={isSQ ? "Bashkëpunim & Sugjerime" : "Collaboration & Suggestions"}
        subtitle={
          isSQ
            ? "Nëse ke materiale, histori ose foto—na shkruaj."
            : "If you have materials, stories or photos—send us a message."
        }
      >
        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-sm font-semibold text-zinc-900">
                {isSQ ? "Dëshiron të kontribuosh?" : "Want to contribute?"}
              </div>
              <p className="mt-2 text-sm text-zinc-600 leading-6">
                {isSQ
                  ? "Mund të shtosh sugjerime për vende, përshkrime, histori lokale, ose foto nga shtegu."
                  : "You can suggest places, descriptions, local stories, or share photos from the route."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/contact" className="btn btn-primary">
                {isSQ ? "Kontakto" : "Contact"}
              </Link>
              <Link to="/partners" className="btn btn-outline">
                {isSQ ? "Partnerët" : "Partners"}
              </Link>
            </div>
          </div>
        </Card>
      </Section>
    </main>
  );
}
