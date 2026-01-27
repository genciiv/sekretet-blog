import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import MapView from "../components/MapView.jsx";
import { apiGet } from "../lib/api.js";
import { useI18n } from "../i18n/i18n.jsx";

const PLACES = [
  { key: "apollonia", titleSQ: "Apollonia", titleEN: "Apollonia" },
  { key: "bylis", titleSQ: "Bylis", titleEN: "Byllis" },
  { key: "ardenica", titleSQ: "Ardenica", titleEN: "Ardenica" },
];

const PERIODS = [
  { key: "archaic", titleSQ: "Shek. VI p.e.s", titleEN: "6th c. BC" },
  { key: "hellenistic", titleSQ: "Periudha helenistike", titleEN: "Hellenistic period" },
  { key: "roman", titleSQ: "Periudha romake", titleEN: "Roman period" },
  { key: "medieval", titleSQ: "Mesjeta", titleEN: "Middle Ages" },
  { key: "modern", titleSQ: "Sot", titleEN: "Modern" },
];

function hasTag(p, tag) {
  return Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase() === String(tag).toLowerCase());
}

function pickPostForPlace(items, placeKey) {
  const k = String(placeKey).toLowerCase();

  // tag place:xxx
  const byTag = items.find((p) => hasTag(p, `place:${k}`));
  if (byTag) return byTag;

  // category match
  const byCat = items.find((p) => String(p.category || "").toLowerCase() === k);
  if (byCat) return byCat;

  return null;
}

export default function Antiquity() {
  const { lang } = useI18n();
  const isSQ = lang === "sq";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts");
        if (ok) setItems(data.items || []);
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
    const published = items || [];
    if (period === "all") return published;
    return published.filter((p) => hasTag(p, `period:${period}`));
  }, [items, period]);

  return (
    <main>
      <PageHeader
        kicker={isSQ ? "Antikiteti" : "Antiquity"}
        title={isSQ ? "Antikiteti i zonës" : "Antiquity of the area"}
        subtitle={
          isSQ
            ? "Pika kryesore, timeline dhe hartë (të lidhura direkt me artikujt)."
            : "Key places, timeline and map (linked directly to posts)."
        }
      />

      <Section
        title={isSQ ? "Pikat kryesore" : "Key places"}
        subtitle={isSQ ? "Kliko kartën për të hapur artikullin." : "Click a card to open the post."}
      >
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {featuredPlaces.map((pl) => {
              const title = isSQ ? pl.titleSQ : pl.titleEN;
              const p = pl.post;

              return (
                <Card key={pl.key} className="overflow-hidden">
                  <div className="p-6">
                    <div className="text-sm font-semibold text-zinc-900">{title}</div>

                    {p ? (
                      <>
                        <div className="mt-2 text-sm text-zinc-600">
                          {isSQ ? (p.excerpt_sq || "") : (p.excerpt_en || p.excerpt_sq || "")}
                        </div>
                        <div className="mt-4">
                          <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
                            {isSQ ? "Hap artikullin" : "Open post"}
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="mt-2 text-sm text-zinc-600">
                        {isSQ
                          ? "S’ka post ende. Krijoje nga Admin → Posts."
                          : "No post yet. Create it from Admin → Posts."}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      <Section
        title={isSQ ? "Harta e antikitetit" : "Antiquity map"}
        subtitle={isSQ ? "Marker-at lidhen me postimet (place:* ose category)." : "Markers link to posts (place:* or category)."}
      >
        <MapView />
      </Section>

      <Section
        title={isSQ ? "Timeline" : "Timeline"}
        subtitle={
          isSQ
            ? "Filtro sipas periudhës me tags: period:archaic / hellenistic / roman / medieval / modern"
            : "Filter by period using tags: period:archaic / hellenistic / roman / medieval / modern"
        }
      >
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={[
                "h-9 rounded-full border px-4 text-sm font-medium",
                period === "all"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white hover:bg-zinc-100",
              ].join(" ")}
              onClick={() => setPeriod("all")}
              type="button"
            >
              {isSQ ? "Të gjitha" : "All"}
            </button>

            {PERIODS.map((x) => (
              <button
                key={x.key}
                className={[
                  "h-9 rounded-full border px-4 text-sm font-medium",
                  period === x.key
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white hover:bg-zinc-100",
                ].join(" ")}
                onClick={() => setPeriod(x.key)}
                type="button"
              >
                {isSQ ? x.titleSQ : x.titleEN}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {(timelineItems || []).slice(0, 8).map((p) => (
              <div
                key={p._id}
                className="rounded-2xl border border-zinc-200 p-4"
              >
                <div className="text-xs text-zinc-500">{p.category || "General"}</div>
                <div className="mt-1 text-sm font-semibold text-zinc-900">
                  {isSQ ? (p.title_sq || "Pa titull") : (p.title_en || p.title_sq || "Untitled")}
                </div>
                <div className="mt-2 text-sm text-zinc-600">
                  {isSQ ? (p.excerpt_sq || "") : (p.excerpt_en || p.excerpt_sq || "")}
                </div>
                <div className="mt-3">
                  <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
                    {isSQ ? "Lexo" : "Read"}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {timelineItems.length === 0 ? (
            <div className="mt-4 text-sm text-zinc-600">
              {isSQ ? "S’ka postime për këtë periudhë." : "No posts for this period."}
            </div>
          ) : null}
        </Card>
      </Section>
    </main>
  );
}
