import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "lang";

const DICT = {
  sq: {
    nav: {
      home: "Ballina",
      trail: "Shtegu",
      antiquity: "Antikiteti",
      blog: "Blog",
      gallery: "Galeria",
      partners: "Partnerët",
      contact: "Kontakt",
      admin: "Admin",
    },
    hero: {
      title: "Sekretet e Harresës",
      subtitle: "Portal turistik-kulturor për shtegun Levan–Shtyllas–Apolloni.",
      ctaPrimary: "Shiko shtegun",
      ctaSecondary: "Lexo historinë",
    },
    common: {
      language: "Gjuha",
      sq: "SQ",
      en: "EN",
    },
  },
  en: {
    nav: {
      home: "Home",
      trail: "Trail",
      antiquity: "Antiquity",
      blog: "Blog",
      gallery: "Gallery",
      partners: "Partners",
      contact: "Contact",
      admin: "Admin",
    },
    hero: {
      title: "Secrets of Forgetting",
      subtitle:
        "A cultural-tourism portal for the Levan–Shtyllas–Apollonia route.",
      ctaPrimary: "View the trail",
      ctaSecondary: "Read the story",
    },
    common: {
      language: "Language",
      sq: "SQ",
      en: "EN",
    },
  },
};

function getInitialLang() {
  const stored = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
  if (stored === "sq" || stored === "en") return stored;
  return "sq";
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const dict = DICT[lang] || DICT.sq;

  const api = useMemo(() => {
    function t(path, fallback = "") {
      // path e stilit: "nav.home"
      const parts = String(path).split(".");
      let cur = dict;
      for (const p of parts) cur = cur?.[p];
      if (cur === undefined || cur === null) return fallback || path;
      return cur;
    }

    function setLanguage(next) {
      const v = String(next || "").toLowerCase();
      setLang(v === "en" ? "en" : "sq");
    }

    return { lang, setLanguage, dict, t };
  }, [lang, dict]);

  return <I18nContext.Provider value={api}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
