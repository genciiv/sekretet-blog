import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import MapView from "../components/MapView.jsx";
import { apiGet, absUrl } from "../lib/api.js";

function hasTag(p, tag) {
  const t = String(tag || "").trim().toLowerCase();
  return (
    Array.isArray(p?.tags) &&
    p.tags.some((x) => String(x || "").trim().toLowerCase() === t)
  );
}

function isAntiquityCategory(p) {
  return String(p?.category || "").trim().toLowerCase() === "antikitet";
}

function getPeriodFromTags(p) {
  const tags = Array.isArray(p?.tags) ? p.tags : [];
  const found = tags
    .map((t) => String(t || "").trim().toLowerCase())
    .find((t) => t.startsWith("period:"));
  return found ? found.replace("period:", "").trim() : "";
}

function prettifyPeriodKey(key) {
  const k = String(key || "").trim().toLowerCase();
  const map = {
    archaic: "Shek. VI p.e.s",
    hellenistic: "Periudha helenistike",
    roman: "Periudha romake",
    medieval: "Mesjeta",
    modern: "Sot",
  };
  return map[k] || k || "Pa periudhë";
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
          className="h-32 w-full object-cover" // ↓ më e vogël
          loading="lazy"
        />
      ) : (
        <div className="flex h-32 items-center justify-center bg-zinc-50 text-xs text-zinc-500">
          Pa foto
        </div>
      )}

      <div className="p-4">
        <div className="text-xs text-zinc-500">{p?.category || "Antikitet"}</div>

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

export default function Antiquity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState("all");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts");
        if (ok) setItems(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => (ok = false);
  }, []);

  // Pikat kryesore: vetëm postet me category Antikitet
  const featuredAntiquityPosts = useMemo(() => {
    return (items || []).filter(isAntiquityCategory);
  }, [items]);

  // Dropdown: vetëm periudhat që ekzistojnë realisht
  const availablePeriods = useMemo(() => {
    const set = new Set();
    (items || []).forEach((p) => {
      const k = getPeriodFromTags(p);
      if (k) set.add(k);
    });

    const arr = Array.from(set);
    const order = ["archaic", "hellenistic", "roman", "medieval", "modern"];
    arr.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    return arr;
  }, [items]);

  const timelineItems = useMemo(() => {
    const list = items || [];
    if (period === "all") return list;
    return list.filter((p) => hasTag(p, `period:${period}`));
  }, [items, period]);

  // vetëm 6
  const visibleTimeline = useMemo(() => timelineItems.slice(0, 6), [timelineItems]);

  return (
    <main>
      <PageHeader
        kicker="Antikiteti"
        title="Antikiteti i zonës"
        subtitle="Postimet e kategorisë Antikitet + hartë dhe timeline me filtra."
      />

      {/* PIKAT KRYESORE */}
      <Section
        title="Pikat kryesore"
        subtitle="Shfaqen vetëm postimet me kategori: Antikitet."
      >
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : featuredAntiquityPosts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            S’ka postime me kategori <b>Antikitet</b>.
            <div className="mt-2 text-xs text-zinc-500">
              Te Admin → vendos te postimi <b>Category = Antikitet</b>.
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredAntiquityPosts.map((p) => (
              <PostMiniCard key={p._id || p.slug} p={p} />
            ))}
          </div>
        )}
      </Section>

      {/* HARTA */}
      <Section
        title="Harta e antikitetit"
        subtitle="Marker-at lidhen me postimet (place:*)."
      >
        <MapView />
      </Section>

      {/* TIMELINE */}
      <Section
        title="Timeline"
        subtitle="Filtro me dropdown sipas periudhës (period:*). Shfaq 6 postime."
      >
        <Card className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm font-semibold text-zinc-900">Filtro periudhën</div>

            <div className="w-full md:w-[320px]">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
              >
                <option value="all">Të gjitha</option>
                {availablePeriods.map((k) => (
                  <option key={k} value={k}>
                    {prettifyPeriodKey(k)}
                  </option>
                ))}
              </select>

              {availablePeriods.length === 0 ? (
                <div className="mt-2 text-xs text-zinc-500">
                  S’ka tags period:* te postimet. Shto p.sh. <b>period:roman</b>.
                </div>
              ) : null}
            </div>
          </div>

          {/* ✅ 3 kolona në desktop */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleTimeline.map((p) => (
              <PostMiniCard key={p._id || p.slug} p={p} />
            ))}
          </div>

          {timelineItems.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              S’ka postime për këtë filtër.
              <div className="mt-2 text-xs text-zinc-500">
                Sigurohu që postimi të jetë <b>published</b> dhe të ketë tag-un{" "}
                <b>period:{period === "all" ? "roman" : period}</b>.
              </div>
            </div>
          ) : null}

          {timelineItems.length > 6 ? (
            <div className="mt-4 text-xs text-zinc-500">
              Po shfaqen vetëm 6 nga {timelineItems.length}. Ndrysho filtrin për të parë të tjerat.
            </div>
          ) : null}
        </Card>
      </Section>
    </main>
  );
}
