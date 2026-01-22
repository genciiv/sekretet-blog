import { useI18n } from "../i18n/i18n";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useI18n();

  return (
    <main>
      <section className="bg-zinc-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              {t.hero.title}
            </h1>
            <p className="mt-4 text-lg text-zinc-600">{t.hero.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/trail"
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
              >
                {t.hero.cta1}
              </Link>
              <Link
                to="/antiquity"
                className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                {t.hero.cta3}
              </Link>
              <a
                href="#map"
                className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                {t.hero.cta2}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-3xl border border-zinc-200 bg-white shadow-sm" />
            <div className="absolute -bottom-5 -left-5 hidden h-28 w-48 rounded-2xl border border-zinc-200 bg-white shadow-sm md:block" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Antikiteti",
              desc: "Apollonia, Byllis, shtresat historike.",
            },
            {
              title: "Shtegu",
              desc: "Itinerar, etapat, këshilla për vizitorët.",
            },
            {
              title: "Trashëgimia",
              desc: "Natyrë, komunitet, kujtesë kulturore.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="text-sm font-semibold text-zinc-900">
                {c.title}
              </div>
              <p className="mt-2 text-sm text-zinc-600">{c.desc}</p>
            </div>
          ))}
        </div>

        <div
          id="map"
          className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="text-sm font-semibold text-zinc-900">Harta</div>
          <p className="mt-2 text-sm text-zinc-600">
            Këtu do vendosim hartën me pika (Apollonia, Byllis, Levan, Shtyllas)
            në Hapin 2.
          </p>
          <div className="mt-4 aspect-[16/7] w-full rounded-2xl bg-zinc-50" />
        </div>
      </section>
    </main>
  );
}
