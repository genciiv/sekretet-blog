import { useI18n } from "../i18n/i18n.jsx";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-1 py-1 shadow-sm">
      <button
        onClick={() => setLang("sq")}
        className={`rounded-full px-3 py-1 text-sm ${
          lang === "sq"
            ? "bg-zinc-900 text-white"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
      >
        SQ
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 text-sm ${
          lang === "en"
            ? "bg-zinc-900 text-white"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
      >
        EN
      </button>
    </div>
  );
}
