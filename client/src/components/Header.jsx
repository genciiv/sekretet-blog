import { NavLink, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useI18n } from "../i18n/i18n.jsx";

export default function Header() {
  const { lang, t } = useI18n();
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/map", label: lang === "en" ? "Map" : "Harta" },
    { to: "/about", label: lang === "en" ? "About" : "Rreth nesh" },
  ];

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* LOGO */}
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

          {/* DESKTOP MENU */}
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

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:inline-flex h-9 items-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
            >
              {t("nav.contact")}
            </Link>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 md:hidden"
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 grid gap-3">
            {nav.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "block rounded-xl px-4 py-2 text-sm font-medium",
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100",
                  ].join(" ")
                }
              >
                {it.label}
              </NavLink>
            ))}

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              {t("nav.contact")}
            </NavLink>

            {/* ADMIN */}
            <NavLink
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
            >
              Admin
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
