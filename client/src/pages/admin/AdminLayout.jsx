import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../../lib/api";

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
  return null;
}

export default function AdminLayout({ children }) {
  const nav = useNavigate();

  function logout() {
    clearAdminToken();
    nav("/admin/login");
  }

  const linkBase =
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";
  const linkInactive = "text-zinc-700 hover:bg-zinc-100";
  const linkActive = "bg-zinc-900 text-white";

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
                <Icon name="posts" />
                Posts
              </NavLink>

              <NavLink
                to="/admin/comments"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <Icon name="comments" />
                Comments
              </NavLink>

              <NavLink
                to="/admin/gallery"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <Icon name="gallery" />
                Gallery
              </NavLink>
            </div>

            <div className="mt-6 grid gap-2">
              <button className="btn w-full" onClick={logout}>
                Logout
              </button>
              <button
                className="btn btn-primary w-full"
                onClick={() => nav("/")}
              >
                View site
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Admin</div>
                <div className="text-xs text-zinc-500">Panel navigimi</div>
              </div>

              <div className="flex gap-2">
                <button className="btn" onClick={() => nav(-1)}>
                  ← Back
                </button>
                <button className="btn" onClick={() => nav(1)}>
                  Forward →
                </button>
              </div>
            </div>

            <div className="mt-6">
              {/* ✅ KJO E RREGULLON */}
              {children ? children : <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
