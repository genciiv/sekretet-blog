import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import MapView from "../components/MapView.jsx";
import { apiGet, absUrl } from "../lib/api.js";

const PLACES = [
  { key: "apollonia", title: "Apollonia" },
  { key: "bylis", title: "Bylis" },
  { key: "ardenica", title: "Ardenica" },
];

const PERIODS = [
  { key: "all", label: "Të gjitha" },
  { key: "archaic", label: "Shek. VI p.e.s" },
  { key: "hellenistic", label: "Periudha helenistike" },
  { key: "roman", label: "Periudha romake" },
  { key: "medieval", label: "Mesjeta" },
  { key: "modern", label: "Sot" },
];

function hasTag(p, tag) {
  const t = String(tag || "")
    .trim()
    .toLowerCase();
  return (
    Array.isArray(p?.tags) &&
    p.tags.some(
      (x) =>
        String(x || "")
          .trim()
          .toLowerCase() === t,
    )
  );
}

function pickPostForPlace(items, placeKey) {
  const k = String(placeKey || "").toLowerCase();

  // 1) prefer tag place:xxx
  const byTag = (items || []).find((p) => hasTag(p, `place:${k}`));
  if (byTag) return byTag;

  // 2) fallback: category == placeKey
  const byCat = (items || []).find(
    (p) => String(p?.category || "").toLowerCase() === k,
  );
  if (byCat) return byCat;

  return null;
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
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-zinc-50 text-xs text-zinc-500">
          Pa foto
        </div>
      )}

      <div className="p-4">
        <div className="text-xs text-zinc-500">
          {p?.category || "Antikitet"}
        </div>
        <div className="mt-1 text-sm font-semibold text-zinc-900">{title}</div>
        {excerpt ? (
          <div className="mt-2 text-sm text-zinc-600">{excerpt}</div>
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

export default function Antiquity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState("all");
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts"); // kthen vetëm published
        if (ok) setItems(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => (ok = false);
  }, []);

  const featuredPlaces = useMemo(() => {
    return PLACES.map((pl) => ({
      ...pl,
      post: pickPostForPlace(items, pl.key),
    }));
  }, [items]);

  const timelineItems = useMemo(() => {
    const list = items || [];
    if (period === "all") return list;
    return list.filter((p) => hasTag(p, `period:${period}`));
  }, [items, period]);

  // reset limit kur ndryshon filtri
  useEffect(() => {
    setLimit(8);
  }, [period]);

  return (
    <main>
      <PageHeader
        kicker="Antikiteti"
        title="Antikiteti i zonës"
        subtitle="Pika kryesore, hartë dhe timeline – të lidhura me postimet."
      />

      {/* PIKAT KRYESORE */}
      <Section
        title="Pikat kryesore"
        subtitle="Kartat lidhen automatikisht me postimet (place:* ose category)."
      >
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {featuredPlaces.map((pl) => {
              const p = pl.post;

              if (!p) {
                return (
                  <Card key={pl.key} className="overflow-hidden p-0">
                    <div className="p-5">
                      <div className="text-sm font-semibold text-zinc-900">
                        {pl.title}
                      </div>
                      <div className="mt-2 text-sm text-zinc-600">
                        S’ka postim të publikuar ende për këtë vend.
                      </div>
                      <div className="mt-3 text-xs text-zinc-500">
                        Këshillë: publiko një post me tag <b>place:{pl.key}</b>
                      </div>
                    </div>
                  </Card>
                );
              }

              const img = p.coverImageUrl ? absUrl(p.coverImageUrl) : "";
              const title = (p.title_sq || "").trim() || pl.title;

              return (
                <Card key={pl.key} className="overflow-hidden p-0">
                  {img ? (
                    <img
                      src={img}
                      alt={title}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-zinc-50 text-xs text-zinc-500">
                      Pa foto
                    </div>
                  )}

                  <div className="p-5">
                    <div className="text-xs text-zinc-500">Antikitet</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-900">
                      {title}
                    </div>

                    {p.excerpt_sq ? (
                      <div className="mt-2 text-sm text-zinc-600">
                        {p.excerpt_sq}
                      </div>
                    ) : null}

                    <div className="mt-4">
                      <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
                        Lexo
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      {/* HARTA */}
      <Section
        title="Harta e antikitetit"
        subtitle="Marker-at lidhen me postimet (nga komponenti MapView)."
      >
        <MapView />
      </Section>

      {/* TIMELINE */}
      <Section
        title="Timeline"
        subtitle="Filtro sipas periudhës me tags: period:archaic / hellenistic / roman / medieval / modern"
      >
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            {PERIODS.map((x) => (
              <button
                key={x.key}
                type="button"
                className={[
                  "h-9 rounded-full border px-4 text-sm font-medium",
                  period === x.key
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white hover:bg-zinc-100",
                ].join(" ")}
                onClick={() => setPeriod(x.key)}
              >
                {x.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {timelineItems.slice(0, limit).map((p) => (
              <PostMiniCard key={p._id || p.slug} p={p} />
            ))}
          </div>

          {timelineItems.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              S’ka postime të publikuara për këtë periudhë.
              <div className="mt-2 text-xs text-zinc-500">
                Kontrollo që postimi të jetë <b>published</b> dhe të ketë tag-un
                p.sh. <b>period:{period === "all" ? "roman" : period}</b>
              </div>
            </div>
          ) : null}

          {timelineItems.length > limit ? (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold hover:bg-zinc-100"
                onClick={() => setLimit((n) => n + 8)}
              >
                Shfaq më shumë
              </button>
            </div>
          ) : null}
        </Card>
      </Section>
    </main>
  );
}
