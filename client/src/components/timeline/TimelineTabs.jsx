import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { apiGet, absUrl } from "../../lib/api.js";

const PERIODS = [
  { key: "archaic", label: "Shek. VI p.e.s" },
  { key: "hellenistic", label: "Periudha helenistike" },
  { key: "roman", label: "Periudha romake" },
  { key: "medieval", label: "Mesjeta" },
  { key: "modern", label: "Sot" },
];

function hasTag(p, tag) {
  const t = String(tag || "").trim().toLowerCase();
  return (
    Array.isArray(p?.tags) &&
    p.tags.some((x) => String(x || "").trim().toLowerCase() === t)
  );
}

function PostMiniCard({ p }) {
  const title = (p?.title_sq || "").trim() || "Pa titull";
  const excerpt = (p?.excerpt_sq || "").trim();
  const img = p?.coverImageUrl ? absUrl(p.coverImageUrl) : "";

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {img ? (
        <img
          src={img}
          alt={title}
          className="h-32 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-32 items-center justify-center bg-zinc-50 text-xs text-zinc-500">
          Pa foto
        </div>
      )}

      <div className="p-4">
        <div className="text-xs text-zinc-500">{p?.category || "Post"}</div>
        <div className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-900">
          {title}
        </div>

        {excerpt ? (
          <div className="mt-2 line-clamp-2 text-sm text-zinc-600">{excerpt}</div>
        ) : null}

        <div className="mt-3">
          <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
            Lexo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TimelineTabs({
  defaultPeriod = "archaic",
  limit = 6,
  onlyCategory = "", // opsionale: p.sh. "Antikitet"
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState(defaultPeriod);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts"); // vetëm published
        if (ok) setItems(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => (ok = false);
  }, []);

  const filtered = useMemo(() => {
    let list = items || [];

    // nëse do vetëm një kategori (opsionale)
    if (onlyCategory) {
      const cat = String(onlyCategory).trim().toLowerCase();
      list = list.filter((p) => String(p?.category || "").trim().toLowerCase() === cat);
    }

    // filtro sipas periudhës me tag period:xxx
    list = list.filter((p) => hasTag(p, `period:${period}`));
    return list;
  }, [items, period, onlyCategory]);

  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

  return (
    <Card className="p-6">
      {/* TABS */}
      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setPeriod(x.key)}
            className={[
              "h-9 rounded-full border px-4 text-sm font-medium transition",
              period === x.key
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white hover:bg-zinc-100",
            ].join(" ")}
          >
            {x.label}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="mt-6">
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            S’ka postime për këtë periudhë.
            <div className="mt-2 text-xs text-zinc-500">
              Te Admin → te postimi shto tag: <b>period:{period}</b> dhe sigurohu që është{" "}
              <b>published</b>.
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <PostMiniCard key={p._id || p.slug} p={p} />
            ))}
          </div>
        )}

        {!loading && filtered.length > limit ? (
          <div className="mt-4 text-xs text-zinc-500">
            Po shfaqen vetëm {limit} nga {filtered.length} për këtë periudhë.
          </div>
        ) : null}
      </div>
    </Card>
  );
}
