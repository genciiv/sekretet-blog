import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n.jsx";
import SEO from "../components/SEO.jsx";

export default function Home() {
  const { t, lang } = useI18n();

  return (
    <main>
      <SEO
        title={t("hero.title")}
        description={t("hero.subtitle")}
        lang={lang}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/trail"
                className="inline-flex h-11 items-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                {t("hero.ctaPrimary")}
              </Link>
              <Link
                to="/blog"
                className="inline-flex h-11 items-center rounded-full border border-zinc-200 px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="h-72 w-full rounded-2xl bg-white shadow-sm" />
            <p className="mt-4 text-sm text-zinc-600">
              (Placeholder) Foto / video / highlight do shtohen në hapat pasues.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
