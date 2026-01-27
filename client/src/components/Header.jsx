import { NavLink, Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/i18n.jsx";

export default function Header() {
  const { t } = useI18n();
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/trail", label: t("nav.trail") },
    { to: "/antiquity", label: t("nav.antiquity") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/map", label: "Harta" },
    { to: "/partners", label: t("nav.partners") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-zinc-900">Sekretet</div>
              <div className="text-xs text-zinc-500">Levan–Shtyllas–Apolloni</div>
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
                      isActive ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900",
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
