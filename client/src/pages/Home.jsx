import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n.jsx";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Section from "../components/sections/Section";
import PlacesMap from "../components/Map/PlacesMap";
import { places } from "../data/places";

export default function Home() {
  const { t } = useI18n();

  return (
    <main>
      {/* HERO */}
      <section className="bg-zinc-50">
        <Container className="grid gap-10 py-14 md:grid-cols-2 md:items-center">
          <div>
            <div className="badge">Portal turistik-kulturor</div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              {t.hero.title}
            </h1>

            <p className="mt-4 text-lg text-zinc-600">{t.hero.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn btn-primary" to="/trail">
                {t.hero.cta1}
              </Link>
              <Link className="btn btn-ghost" to="/antiquity">
                {t.hero.cta3}
              </Link>
              <a className="btn btn-ghost" href="#map">
                {t.hero.cta2}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="badge">Levan</span>
              <span className="badge">Shtyllas</span>
              <span className="badge">Apolloni</span>
              <span className="badge">Antikitet</span>
              <span className="badge">Shteg</span>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-3xl border border-zinc-200 bg-white shadow-sm" />
            <div className="pointer-events-none absolute -bottom-5 -left-5 hidden h-28 w-52 rounded-2xl border border-zinc-200 bg-white shadow-sm md:block" />
          </div>
        </Container>
      </section>

      {/* 3 Cards */}
      <Section title="Përmbledhje" subtitle="Çfarë do gjesh në portal">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">Antikiteti</div>
            <p className="mt-2 text-sm text-zinc-600">
              Apollonia, Byllis dhe shtresat historike të zonës.
            </p>
            <Link to="/antiquity" className="mt-4 inline-flex text-sm font-semibold text-zinc-900 hover:underline">
              Shiko më shumë →
            </Link>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">Shtegu</div>
            <p className="mt-2 text-sm text-zinc-600">
              Itinerar, etapa, këshilla për vizitorët dhe hartë.
            </p>
            <Link to="/trail" className="mt-4 inline-flex text-sm font-semibold text-zinc-900 hover:underline">
              Hap itinerarin →
            </Link>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">Blog / Story</div>
            <p className="mt-2 text-sm text-zinc-600">
              Artikuj, kujtesë kulturore, evente dhe materiale.
            </p>
            <Link to="/blog" className="mt-4 inline-flex text-sm font-semibold text-zinc-900 hover:underline">
              Lexo postimet →
            </Link>
          </Card>
        </div>
      </Section>

      {/* MAP */}
      <section id="map" className="py-12">
        <Container>
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Harta</div>
                <p className="mt-2 text-sm text-zinc-600">
                  Pika kryesore + lidhja e shtegut (Levan → Shtyllas → Apolloni).
                </p>
              </div>
              <span className="badge">OpenStreetMap</span>
            </div>

            <div className="mt-5">
              <PlacesMap places={places} heightClass="h-[360px]" showRoute />
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}
