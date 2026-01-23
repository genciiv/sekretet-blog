import { NavLink, Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/i18n.jsx";

function LangBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-9 px-3 rounded-full text-sm font-medium transition",
        active
          ? "bg-zinc-900 text-white"
          : "bg-white text-zinc-900 hover:bg-zinc-100",
        "border border-zinc-200",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

export default function Header() {
  const { lang, setLanguage, t } = useI18n();
  const loc = useLocation();

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/trail", label: t("nav.trail") },
    { to: "/antiquity", label: t("nav.antiquity") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/partners", label: t("nav.partners") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-zinc-900">
                Sekretet
              </div>
              <div className="text-xs text-zinc-500">
                Levan–Shtyllas–Apolloni
              </div>
            </div>
          </Link>

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
          ) : (
            <div className="hidden md:block text-sm font-medium text-zinc-600">
              {t("nav.admin")}
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="rounded-full border border-zinc-200 bg-white p-1">
              <div className="flex items-center gap-1">
                <LangBtn
                  active={lang === "sq"}
                  onClick={() => setLanguage("sq")}
                >
                  {t("common.sq")}
                </LangBtn>
                <LangBtn
                  active={lang === "en"}
                  onClick={() => setLanguage("en")}
                >
                  {t("common.en")}
                </LangBtn>
              </div>
            </div>

            <Link
              to="/admin/login"
              className="hidden md:inline-flex h-9 items-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
            >
              {t("nav.admin")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
