import { useEffect, useMemo, useState } from "react";
import { apiGet, absUrl } from "../lib/api";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const data = await apiGet("/api/media");
      setItems(data.items || []);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => {
      const hay =
        `${it.titleSq} ${it.titleEn} ${it.place} ${(it.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(s);
    });
  }, [items, q]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Galeria</h1>
          <p className="mt-2 text-zinc-600">
            Foto nga shtigjet dhe pikat kulturore.
          </p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Kërko (Apollonia, Bylis, ...)"
          className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-400"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => (
          <button
            key={it._id}
            onClick={() => setOpen(it)}
            className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white text-left shadow-sm transition hover:shadow-md"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
              <img
                src={absUrl(it.imageUrl)}
                alt={it.titleSq || it.place || "photo"}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>

            <div className="p-4">
              <div className="text-sm font-semibold text-zinc-900">
                {it.titleSq || it.place || "Foto"}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {it.place ? it.place : "—"}
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
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-900">
                  {open.titleSq || open.place || "Foto"}
                </div>
                <div className="text-xs text-zinc-500">{open.place || "—"}</div>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Mbyll
              </button>
            </div>

            <div className="bg-zinc-100">
              <img
                src={absUrl(open.imageUrl)}
                alt={open.titleSq || open.place || "photo"}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
