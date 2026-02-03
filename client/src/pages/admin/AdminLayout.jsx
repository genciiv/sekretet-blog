// FILE: client/src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../../lib/api.js";

function Icon({ name }) {
  const cls = "h-5 w-5";

  if (name === "posts")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M7 7h10M7 12h10M7 17h7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );

  if (name === "comments")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.5-4.5A8 8 0 1 1 21 12z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 12h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );

  if (name === "gallery")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 11l2 2 3-3 5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 9.5h.01"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );

  if (name === "contacts")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6h16v12H4V6z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M4 7l8 6 8-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (name === "plus")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );

  return null;
}

export default function AdminLayout() {
  const nav = useNavigate();
  const loc = useLocation();

  function logout() {
    // ✅ logout real
    clearAdminToken();

    // ✅ shko në kryefaqe dhe mos lejo Back të kthejë te admin
    nav("/", { replace: true });
  }

  const linkBase =
    "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition";
  const leftBase = "flex items-center gap-3";
  const linkInactive = "text-zinc-700 hover:bg-zinc-100";
  const linkActive = "bg-zinc-900 text-white";

  const title = loc.pathname.includes("/admin/posts")
    ? "Posts"
    : loc.pathname.includes("/admin/comments")
      ? "Comments"
      : loc.pathname.includes("/admin/gallery")
        ? "Gallery"
        : loc.pathname.includes("/admin/contacts")
          ? "Kontaktet"
          : "Admin";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-900" />
              <div>
                <div className="text-sm font-semibold">Sekretet</div>
                <div className="text-xs text-zinc-500">Admin Panel</div>
              </div>
            </div>

            <div className="mt-6 grid gap-2">
              <NavLink
                to="/admin/posts"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <div className={leftBase}>
                  <Icon name="posts" />
                  Posts
                </div>
                <span className="text-xs opacity-70">→</span>
              </NavLink>

              <NavLink
                to="/admin/comments"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <div className={leftBase}>
                  <Icon name="comments" />
                  Comments
                </div>
                <span className="text-xs opacity-70">→</span>
              </NavLink>

              <NavLink
                to="/admin/gallery"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <div className={leftBase}>
                  <Icon name="gallery" />
                  Gallery
                </div>
                <span className="text-xs opacity-70">→</span>
              </NavLink>

              <NavLink
                to="/admin/contacts"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <div className={leftBase}>
                  <Icon name="contacts" />
                  Kontaktet
                </div>
                <span className="text-xs opacity-70">→</span>
              </NavLink>
            </div>

            <div className="mt-6 grid gap-2">
              <button className="btn w-full" onClick={logout} type="button">
                Logout
              </button>

              <button
                className="btn btn-primary w-full"
                onClick={() => nav("/", { replace: true })}
                type="button"
              >
                View site
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Admin</div>
                <div className="text-xs text-zinc-500">{title}</div>
              </div>

              <div className="flex items-center gap-2">
                {loc.pathname === "/admin/posts" ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => nav("/admin/posts/new")}
                    type="button"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon name="plus" /> Shto Post
                    </span>
                  </button>
                ) : null}

                <button className="btn" onClick={() => nav(-1)} type="button">
                  ← Back
                </button>
                <button className="btn" onClick={() => nav(1)} type="button">
                  Forward →
                </button>
              </div>
            </div>

            <div className="mt-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
