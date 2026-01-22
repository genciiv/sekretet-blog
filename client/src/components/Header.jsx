import { NavLink } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";
import { useI18n } from "../i18n/i18n.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
  }`;

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-zinc-900" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900">Sekretet</div>
            <div className="text-xs text-zinc-500">Levan–Shtyllas–Apolloni</div>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-5 md:flex">
          <NavLink to="/" className={navLinkClass}>
            {t.nav.home}
          </NavLink>
          <NavLink to="/trail" className={navLinkClass}>
            {t.nav.trail}
          </NavLink>
          <NavLink to="/antiquity" className={navLinkClass}>
            {t.nav.antiquity}
          </NavLink>
          <NavLink to="/blog" className={navLinkClass}>
            {t.nav.blog}
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass}>
            {t.nav.gallery}
          </NavLink>
          <NavLink to="/partners" className={navLinkClass}>
            {t.nav.partners}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            {t.nav.contact}
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
