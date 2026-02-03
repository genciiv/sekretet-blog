import { NavLink, Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/i18n.jsx";

export default function Header() {
  const { lang, t } = useI18n();
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  // ✅ Partnerët hiqen nga menuja
  // ✅ Shtohet “Rreth nesh”
  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/map", label: lang === "en" ? "Map" : "Harta" },
    { to: "/about", label: lang === "en" ? "About" : "Rreth nesh" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-zinc-900">Sekretet</div>
              <div className="text-xs text-zinc-500">
                Levan–Shtyllas–Apolloni
              </div>
            </div>
          </Link>

          {/* MENU QENDROR */}
          {!isAdmin ? (
            <nav className="hidden items-center gap-6 md:flex">
              {nav.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) =>
                    [
                      "text-sm font-medium transition",
                      isActive
                        ? "text-zinc-900"
                        : "text-zinc-600 hover:text-zinc-900",
                    ].join(" ")
                  }
                >
                  {it.label}
                </NavLink>
              ))}
            </nav>
          ) : null}

          {/* ✅ VETËM KONTAKT */}
          <Link
            to="/contact"
            className="inline-flex h-9 items-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </div>
    </header>
  );
}
