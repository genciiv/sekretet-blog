// FILE: client/src/pages/admin/AdminPosts.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import { apiAuthGet, apiAuthSend } from "../../lib/api.js";

function Badge({ children, tone = "zinc" }) {
  const map = {
    zinc: "bg-zinc-100 text-zinc-800 border-zinc-200",
    green: "bg-green-50 text-green-800 border-green-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-800 border-red-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        map[tone] || map.zinc,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function AdminPosts() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); // all | draft | published
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

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return (items || [])
      .filter((p) => (status === "all" ? true : p.status === status))
      .filter((p) => {
        if (!text) return true;
        const t =
          `${p.title_sq || ""} ${p.title_en || ""} ${p.slug || ""} ${p.category || ""}`
            .toLowerCase()
            .includes(text);
        return t;
      });
  }, [items, q, status]);

  async function togglePublish(p) {
    // publish <-> draft
    const next = p.status === "published" ? "draft" : "published";
    await apiAuthSend(`/api/admin/posts/${p._id}`, "PUT", { status: next });
    await load();
  }

  async function remove(p) {
    const ok = confirm(`Ta fshij postimin "${p.title_sq || p.slug}"?`);
    if (!ok) return;
    await apiAuthSend(`/api/admin/posts/${p._id}`, "DELETE");
    await load();
  }

  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <input
              className="h-10 w-full md:w-80 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="Kërko titull, slug, kategori…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="h-10 rounded-xl border border-zinc-200 px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Të gjitha</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="btn" onClick={load} type="button">
              Rifresko
            </button>
            <button
              className="btn btn-primary"
              onClick={() => nav("/admin/posts/new")}
              type="button"
            >
              Shto Post
            </button>
          </div>
        </div>

        {err ? (
          <div className="mt-3 text-sm text-red-600">
            Gabim: {err} (shiko token / requireAdmin)
          </div>
        ) : null}
      </Card>

      {loading ? (
        <div className="text-sm text-zinc-600">Loading…</div>
      ) : filtered.length === 0 ? (
        <Card className="p-6">
          <div className="text-sm font-semibold">S’ka postime</div>
          <div className="mt-1 text-sm text-zinc-600">
            Kliko “Shto Post” për të krijuar të parin.
          </div>
          <div className="mt-4">
            <Link className="btn btn-primary" to="/admin/posts/new">
              Shto Post
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <Card key={p._id} className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-zinc-900">
                      {p.title_sq || "Pa titull"}
                    </div>
                    <Badge tone={p.status === "published" ? "green" : "amber"}>
                      {p.status}
                    </Badge>
                    {p.category ? <Badge>{p.category}</Badge> : null}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    slug: <span className="font-mono">{p.slug}</span>
                    {p.publishedAt ? (
                      <>
                        {" "}
                        • publikuar: {new Date(p.publishedAt).toLocaleString()}
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link className="btn" to={`/blog/${p.slug}`} target="_blank">
                    Shiko
                  </Link>
                  <Link className="btn" to={`/admin/posts/${p._id}`}>
                    Edito
                  </Link>
                  <button
                    className="btn"
                    onClick={() => togglePublish(p)}
                    type="button"
                  >
                    {p.status === "published" ? "Kthe në Draft" : "Publiko"}
                  </button>
                  <button
                    className="btn"
                    onClick={() => remove(p)}
                    type="button"
                  >
                    Fshi
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
