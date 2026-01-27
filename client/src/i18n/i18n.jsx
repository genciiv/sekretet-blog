import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "lang";

// vetëm SQ
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
    },
  },
};

function getInitialLang() {
  return "sq";
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang] = useState(getInitialLang());

  useEffect(() => {
    // fshi çfarëdo EN të ruajtur më parë
    localStorage.setItem(STORAGE_KEY, "sq");
    document.documentElement.lang = "sq";
  }, []);

  const dict = DICT.sq;

  const api = useMemo(() => {
    function t(path, fallback = "") {
      const parts = String(path).split(".");
      let cur = dict;
      for (const p of parts) cur = cur?.[p];
      if (cur === undefined || cur === null) return fallback || path;
      return cur;
    }

    // mbahet për kompatibilitet (mos të prishet header etj), por s’bën asgjë
    function setLanguage() {}

    return { lang: "sq", setLanguage, dict, t, isSQ: true };
  }, [dict]);

  return <I18nContext.Provider value={api}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
