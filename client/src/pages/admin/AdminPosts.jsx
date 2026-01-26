import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiAuthGet, apiAuthSend } from "../../lib/api.js";

function Badge({ status }) {
  const cls =
    status === "published"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-zinc-50 text-zinc-700 border-zinc-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}
    >
      {status}
    </span>
  );
}

export default function AdminPosts() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await apiAuthGet("/api/admin/posts");
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!confirm("Ta fshij këtë postim?")) return;
    try {
      await apiAuthSend(`/api/admin/posts/${id}`, "DELETE");
      await load();
    } catch (e) {
      alert(String(e?.message || e));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Posts</div>
          <div className="text-sm text-zinc-500">
            Menaxho artikujt (draft/published).
          </div>
        </div>

        <Link to="/admin/posts/new" className="btn btn-primary">
          + Shto postim
        </Link>
      </div>

      {err ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="p-4 text-sm text-zinc-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-zinc-600">
            S’ka postime ende. Kliko “Shto postim”.
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {items.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate font-medium">
                      {p.title_sq || p.title_en || "(Pa titull)"}
                    </div>
                    <Badge status={p.status} />
                    <span className="text-xs text-zinc-500">
                      {p.category || "General"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 truncate">
                    /blog/{p.slug}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="btn"
                    onClick={() => nav(`/admin/posts/${p._id}`)}
                  >
                    Edit
                  </button>
                  <button className="btn" onClick={() => remove(p._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
