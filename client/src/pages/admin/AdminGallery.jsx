import { useEffect, useState } from "react";
import { apiAuthGet, apiAuthUpload, apiAuthSend, absUrl } from "../../lib/api";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [titleSq, setTitleSq] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [place, setPlace] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("published");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await apiAuthGet("/api/admin/media");
    setItems(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload() {
    setErr("");
    setOk("");

    if (!file) {
      setErr("Zgjidh një foto.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("titleSq", titleSq);
      fd.append("titleEn", titleEn);
      fd.append("place", place);
      fd.append("tags", tags);
      fd.append("status", status);

      await apiAuthUpload("/api/admin/media", fd);

      setOk("Foto u shtua me sukses.");
      setFile(null);
      setTitleSq("");
      setTitleEn("");
      setPlace("");
      setTags("");
      setStatus("published");
      await load();
    } catch (e) {
      setErr("Upload dështoi. Kontrollo formatin/size (JPG/PNG/WEBP <= 6MB).");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Ta fshij këtë foto?")) return;
    setErr("");
    setOk("");
    try {
      await apiAuthSend(`/api/admin/media/${id}`, "DELETE");
      setOk("Foto u fshi.");
      await load();
    } catch (e) {
      setErr("Delete dështoi.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Admin • Galeria
        </h1>
        <p className="mt-2 text-zinc-600">Ngarko foto dhe menaxho galerinë.</p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-900">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full text-sm"
            />
            <p className="mt-2 text-xs text-zinc-500">JPG/PNG/WEBP, max 6MB.</p>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-900">
                  Title (SQ)
                </label>
                <input
                  value={titleSq}
                  onChange={(e) => setTitleSq(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-900">
                  Title (EN)
                </label>
                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-900">
                  Place
                </label>
                <input
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Apollonia / Bylis / Ardenica..."
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-900">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-400"
                >
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">
                Tags (me presje)
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="antikitet, apollonia, natyre"
                className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onUpload}
                disabled={loading}
                className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>

              {err ? <span className="text-sm text-red-600">{err}</span> : null}
              {ok ? <span className="text-sm text-green-700">{ok}</span> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it._id}
            className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="aspect-[4/3] bg-zinc-100">
              <img
                src={absUrl(it.imageUrl)}
                alt={it.titleSq || it.place || "photo"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-4">
              <div className="text-sm font-semibold text-zinc-900">
                {it.titleSq || it.place || "Foto"}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {it.place || "—"} •{" "}
                <span className="uppercase">{it.status}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(it.tags || []).slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <a
                  href={absUrl(it.imageUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-zinc-700 hover:underline"
                >
                  View
                </a>

                <button
                  onClick={() => onDelete(it._id)}
                  className="rounded-2xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
