import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { hasAdminToken, adminLogout } from "../../lib/api";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const links = [
  { to: "/admin/posts", label: "Posts" },
  { to: "/admin/comments", label: "Comments" },
];

export default function AdminLayout() {
  const nav = useNavigate();

  if (!hasAdminToken()) {
    setTimeout(() => nav("/admin/login"), 0);
    return null;
  }

  function onLogout() {
    adminLogout();
    nav("/admin/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:overflow-auto">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-10 w-10 rounded-2xl bg-zinc-900" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-900">
                  Sekretet
                </div>
                <div className="truncate text-xs text-zinc-500">
                  Admin Panel
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-700 hover:bg-zinc-100",
                    )
                  }
                >
                  <span>{l.label}</span>
                  <span className="text-xs opacity-70">→</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-6 border-t border-zinc-200 pt-4">
              <button
                onClick={onLogout}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Logout
              </button>

              <button
                onClick={() => nav("/")}
                className="mt-2 w-full rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                View site
              </button>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-4 rounded-3xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    Admin
                  </div>
                  <div className="text-xs text-zinc-500">Panel navigimi</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => nav(-1)}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => nav(1)}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                  >
                    Forward →
                  </button>
                </div>
              </div>
            </div>

            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
