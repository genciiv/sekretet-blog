import MapView from "../components/MapView.jsx";
import SEO from "../components/SEO.jsx";
import { useI18n } from "../i18n/i18n.jsx";

export default function MapPage() {
  const { lang } = useI18n();

  const title = lang === "en" ? "Interactive Map" : "Harta Interaktive";
  const desc =
    lang === "en"
      ? "Explore Apollonia, Bylis, Ardenica and the cultural trail. Click markers to open posts."
      : "Eksploro Apolloninë, Bylisin, Ardenicën dhe shtegun kulturor. Kliko pikat për të hapur artikujt.";

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO title={title} description={desc} lang={lang} />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
        <p className="text-zinc-600">{desc}</p>
      </div>

      <div className="mt-8">
        <MapView />
      </div>

      <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
        <div className="text-sm font-semibold text-zinc-900">Tips</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
          <li>Kliko një marker → del popup → “Hap” të çon në post/faqe.</li>
          <li>
            Polyline tregon shtegun (do e bëjmë më të saktë me GPX në hapin
            pasues).
          </li>
          <li>Zoom-in për detaje; në mobile përdor pinch.</li>
        </ul>
      </div>
    </main>
  );
}
