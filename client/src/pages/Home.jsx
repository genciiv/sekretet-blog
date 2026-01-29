import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO.jsx";
import Section from "../components/sections/Section.jsx";
import Card from "../components/ui/Card.jsx";
import MapView from "../components/MapView.jsx";
import { useI18n } from "../i18n/i18n.jsx";
import { apiGet, absUrl } from "../lib/api.js";

const MAP_PREVIEW_IMG =
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80";

const PLACES = [
  { key: "apollonia", title: "Apollonia", subtitle: "Park arkeologjik" },
  { key: "bylis", title: "Bylis", subtitle: "Qytet antik" },
  { key: "ardenica", title: "Ardenica", subtitle: "Manastir & histori" },
];

const PERIODS = [
  { key: "all", label: "Të gjitha" },
  { key: "archaic", label: "Shek. VI p.e.s" },
  { key: "hellenistic", label: "Helenistike" },
  { key: "roman", label: "Romake" },
  { key: "medieval", label: "Mesjeta" },
  { key: "modern", label: "Sot" },
];

function hasTag(p, tag) {
  const t = String(tag || "").trim().toLowerCase();
  return Array.isArray(p?.tags) && p.tags.some((x) => String(x || "").trim().toLowerCase() === t);
}

function pickPostForPlace(items, placeKey) {
  const k = String(placeKey || "").toLowerCase();
  const byTag = (items || []).find((p) => hasTag(p, `place:${k}`));
  if (byTag) return byTag;

  const byCat = (items || []).find((p) => String(p?.category || "").toLowerCase() === k);
  if (byCat) return byCat;

  return null;
}

function PostMini({ p }) {
  const title = (p?.title_sq || "").trim() || "Pa titull";
  const excerpt = (p?.excerpt_sq || "").trim();
  const img = p?.coverImageUrl ? absUrl(p.coverImageUrl) : "";

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {img ? (
        <img src={img} alt={title} className="h-40 w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-40 items-center justify-center bg-zinc-50 text-xs text-zinc-500">
          Pa foto
        </div>
      )}

      <div className="p-4">
        <div className="text-xs text-zinc-500">{p?.category || "Blog"}</div>
        <div className="mt-1 text-sm font-semibold text-zinc-900">{title}</div>
        {excerpt ? <div className="mt-2 text-sm text-zinc-600">{excerpt}</div> : null}

        <div className="mt-3">
          <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
            Lexo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { lang } = useI18n();
  const isSQ = lang === "sq";

  const title = isSQ ? "Sekretet e Harresës" : "Secrets of Harresë";
  const desc = isSQ
    ? "Shteg turistik-kulturor Levan – Shtyllas – Apolloni, me histori, antikitet, galeri dhe hartë interaktive."
    : "A cultural route connecting Levan – Shtyllas – Apollonia, with stories, antiquity, gallery and an interactive map.";

  // Marrim postimet published që të ushqejmë “Antikitet” + Timeline preview
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts");
        if (ok) setPosts(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (ok) setLoadingPosts(false);
      }
    })();
    return () => (ok = false);
  }, []);

  const featured = useMemo(() => {
    return PLACES.map((pl) => ({ ...pl, post: pickPostForPlace(posts, pl.key) }));
  }, [posts]);

  const timelinePreview = useMemo(() => {
    const list = posts || [];
    if (period === "all") return list.slice(0, 4);
    return list.filter((p) => hasTag(p, `period:${period}`)).slice(0, 4);
  }, [posts, period]);

  return (
    <main>
      <SEO title={title} description={desc} lang={lang} />

      {/* HERO */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-zinc-900" />
                {isSQ ? "Turizëm & Kulturë" : "Tourism & Culture"}
              </div>

              {/* ↓ më normal */}
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
                {title}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600">{desc}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/trail" className="btn btn-primary">
                  {isSQ ? "Shiko Shtegun" : "Explore Trail"}
                </Link>
                <Link to="/antiquity" className="btn btn-outline">
                  {isSQ ? "Antikiteti" : "Antiquity"}
                </Link>
                <Link to="/map" className="btn btn-outline">
                  {isSQ ? "Harta" : "Map"}
                </Link>
              </div>

              <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">Shteg</div>
                  <div className="text-xs text-zinc-600">{isSQ ? "Levan–Shtyllas–Apolloni" : "Levan–Shtyllas–Apollonia"}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">{isSQ ? "Antikitet" : "Antiquity"}</div>
                  <div className="text-xs text-zinc-600">{isSQ ? "Pika & periudha" : "Places & periods"}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">{isSQ ? "Harta" : "Map"}</div>
                  <div className="text-xs text-zinc-600">{isSQ ? "Interaktive" : "Interactive"}</div>
                </Card>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 shadow-sm">
                <img
                  src={MAP_PREVIEW_IMG}
                  alt="Preview"
                  className="h-[320px] w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">Apollonia</div>
                  <div className="mt-1 text-xs text-zinc-600">{isSQ ? "Park arkeologjik" : "Archaeological park"}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-semibold text-zinc-900">Bylis</div>
                  <div className="mt-1 text-xs text-zinc-600">{isSQ ? "Qytet antik" : "Ancient city"}</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHTEGU (preview) */}
      <Section
        title={isSQ ? "Shtegu" : "Trail"}
        subtitle={
          isSQ
            ? "Përmbledhje e shpejtë – hyr në faqen e shtegut për detaje."
            : "Quick overview – open the trail page for full details."
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="text-sm font-semibold text-zinc-900">{isSQ ? "Nisja" : "Start"}</div>
            <p className="mt-2 text-sm text-zinc-600">
              {isSQ ? "Levan – pika hyrëse e itinerarit." : "Levan – entry point of the route."}
            </p>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-zinc-900">{isSQ ? "Natyrë & Ujëra" : "Nature & Water"}</div>
            <p className="mt-2 text-sm text-zinc-600">
              {isSQ ? "Shtyllas – reliev, shtigje dhe panorama." : "Shtyllas – terrain, trails and views."}
            </p>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold text-zinc-900">{isSQ ? "Histori" : "History"}</div>
            <p className="mt-2 text-sm text-zinc-600">
              {isSQ ? "Apollonia – trashëgimi arkeologjike." : "Apollonia – archaeological heritage."}
            </p>
          </Card>
        </div>

        <div className="mt-5">
          <Link to="/trail" className="btn btn-primary">
            {isSQ ? "Shiko Shtegun" : "Explore Trail"}
          </Link>
        </div>
      </Section>

      {/* ANTIKITETI (preview + timeline mini) */}
      <Section
        title={isSQ ? "Antikiteti" : "Antiquity"}
        subtitle={
          isSQ
            ? "Kartat dhe timeline ushqehen automatikisht nga postimet (tags: place:* dhe period:*)."
            : "Cards and timeline are fed automatically from posts (tags: place:* and period:*)."
        }
      >
        {loadingPosts ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {featured.map((pl) => {
                const p = pl.post;
                const img = p?.coverImageUrl ? absUrl(p.coverImageUrl) : "";

                return (
                  <Card key={pl.key} className="overflow-hidden p-0">
                    {img ? (
                      <img src={img} alt={pl.title} className="h-40 w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-zinc-50 text-xs text-zinc-500">
                        {isSQ ? "Pa foto" : "No image"}
                      </div>
                    )}

                    <div className="p-5">
                      <div className="text-sm font-semibold text-zinc-900">{pl.title}</div>
                      <div className="mt-1 text-xs text-zinc-600">{pl.subtitle}</div>

                      <div className="mt-3 text-sm text-zinc-600">
                        {p ? (p.excerpt_sq || "") : (isSQ ? "S’ka post të publikuar ende për këtë vend." : "No published post yet for this place.")}
                      </div>

                      <div className="mt-4">
                        {p ? (
                          <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
                            {isSQ ? "Lexo" : "Read"}
                          </Link>
                        ) : (
                          <Link className="btn btn-outline" to="/admin/posts">
                            {isSQ ? "Shto nga Admin" : "Add in Admin"}
                          </Link>
                        )}
                      </div>

                      {!p ? (
                        <div className="mt-3 text-xs text-zinc-500">
                          {isSQ ? (
                            <>Këshillë: publiko një post me tag <b>place:{pl.key}</b></>
                          ) : (
                            <>Tip: publish a post with tag <b>place:{pl.key}</b></>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-6 p-6">
              <div className="text-sm font-semibold text-zinc-900">{isSQ ? "Timeline (mini)" : "Timeline (mini)"}</div>

              <div className="mt-3 flex flex-wrap gap-2">
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

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {timelinePreview.map((p) => (
                  <PostMini key={p._id || p.slug} p={p} />
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/antiquity" className="btn btn-primary">
                  {isSQ ? "Hap Antikitetin" : "Open Antiquity"}
                </Link>
                <Link to="/blog" className="btn btn-outline">
                  {isSQ ? "Të gjitha postimet" : "All posts"}
                </Link>
              </div>
            </Card>
          </>
        )}
      </Section>

      {/* HARTA (Ballina) */}
      <Section
        title={isSQ ? "Harta Interaktive" : "Interactive Map"}
        subtitle={
          isSQ
            ? "Kliko pikat për të hapur artikullin përkatës."
            : "Click markers to open the related post."
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <MapView />

          <Card className="overflow-hidden">
            <img
              src={MAP_PREVIEW_IMG}
              alt="Route preview"
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <div className="text-sm font-semibold text-zinc-900">
                {isSQ ? "Pikat kryesore" : "Route highlights"}
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {isSQ
                  ? "Apollonia, Bylis dhe Ardenica në një eksperiencë interaktive—hap hartën për detaje."
                  : "Apollonia, Bylis and Ardenica in one interactive experience—open the map for details."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/map" className="btn btn-primary">
                  {isSQ ? "Hap hartën e plotë" : "Open full map"}
                </Link>
                <Link to="/blog" className="btn btn-outline">
                  {isSQ ? "Lexo postimet" : "Read posts"}
                </Link>
              </div>

              <div className="mt-5 text-xs text-zinc-500">
                {isSQ ? "Tip: Përdor zoom dhe kliko pikat." : "Tip: Use zoom and click markers."}
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
