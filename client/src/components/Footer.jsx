import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n.jsx";

export default function Footer() {
  const { lang } = useI18n();

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* TOP */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* ABOUT */}
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Sekretet
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              Portal turistik-kulturor i ndërtuar si projekt edukativ për
              promovimin e trashëgimisë kulturore, shtigjeve historike dhe
              natyrore në zonën Levan – Shtyllas – Apolloni.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              {lang === "en" ? "Contact" : "Kontakt"}
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              Email: info@shembull.al
            </p>
          </div>

          {/* SOCIAL */}
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Social
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              Instagram • Facebook
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-8 flex flex-col gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} Sekretet. All rights reserved.
          </div>

          {/* NAV LINKS */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/about"
              className="hover:text-zinc-800 hover:underline"
            >
              {lang === "en" ? "About" : "Rreth nesh"}
            </Link>

            <Link
              to="/contact"
              className="hover:text-zinc-800 hover:underline"
            >
              {lang === "en" ? "Contact" : "Kontakt"}
            </Link>

            {/* ✅ ADMIN LOGIN */}
            <Link
              to="/admin/login"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
