import { createContext, useContext, useEffect, useMemo, useState } from "react";

const I18nContext = createContext(null);

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
    },
    hero: {
      title: "Sekretet e Harresës",
      subtitle: "Shteg natyror-kulturor Levan–Shtyllas–Apolloni",
      cta1: "Shiko Shtegun",
      cta2: "Hap Hartën",
      cta3: "Lexo Historinë",
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
    },
    hero: {
      title: "Secrets of Forgetting",
      subtitle: "Nature–culture trail Levan–Shtyllas–Apollonia",
      cta1: "View Trail",
      cta2: "Open Map",
      cta3: "Read the Story",
    },
  },
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("lang");
    return saved === "en" ? "en" : "sq";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => DICT[lang], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
