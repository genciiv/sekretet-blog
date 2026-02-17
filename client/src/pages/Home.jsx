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

// ✅ Partnerët (placeholder si te faqja Partners)
const PARTNERS = [
  {
    nameSq: "Bashkia Fier",
    nameEn: "Fier Municipality",
    descSq: "Përshkrimi do shtohet më vonë.",
    descEn: "Description will be added later.",
    logo: "/logos/stema.png"
  },
  {
    nameSq: "ZVAP Fier",
    nameEn: "ZVAP Fier",
    descSq: "Përshkrimi do shtohet më vonë.",
    descEn: "Description will be added later.",
    logo: "/logos/zvrp.png"
  },
  {
    nameSq: "Komuniteti",
    nameEn: "Community",
    descSq: "Përshkrimi do shtohet më vonë.",
    descEn: "Description will be added later.",
    logo: "/logos/fier.png"
  },
];

// ======================
// CLICK → LOCATION → DIRECTIONS (REAL LOCATION)
// ======================
const TRAIL_POINTS = {
  levani: {
    titleSq: "Nisja",
    titleEn: "Start",
    descSq: "Levan – pika hyrëse e itinerarit.",
    descEn: "Levan – entry point of the route.",
    lat: 40.6769,
    lng: 19.4876,
    label: "Levan",
  },
  shtyllas: {
    titleSq: "Natyrë & Ujëra",
    titleEn: "Nature & Water",
    descSq: "Shtyllas – reliev, shtigje dhe panorama.",
    descEn: "Shtyllas – terrain, trails and views.",
    lat: 40.6719,
    lng: 19.4548,
    label: "Shtyllas",
  },
  apollonia: {
    titleSq: "Histori",
    titleEn: "History",
    descSq: "Apollonia – trashëgimi arkeologjike.",
    descEn: "Apollonia – archaeological heritage.",
    lat: 40.7249,
    lng: 19.4737,
    label: "Apollonia",
  },
};

function openGoogleMapsDirections(origin, dest) {
  const url =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(dest)}` +
    `&travelmode=driving`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openGoogleMapsPlace(dest) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dest
  )}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function getUserCoords() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  });
}

function hasTag(p, tag) {
  const t = String(tag || "").trim().toLowerCase();
  return (
    Array.isArray(p?.tags) &&
    p.tags.some((x) => String(x || "").trim().toLowerCase() === t)
  );
}

function pickPostForPlace(items, placeKey) {
  const k = String(placeKey || "").toLowerCase();
  const byTag = (items || []).find((p) => hasTag(p, `place:${k}`));
  if (byTag) return byTag;

  const byCat = (items || []).find(
    (p) => String(p?.category || "").toLowerCase() === k
  );
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
const desc2 = isSQ
  ? "Një eksperiencë kulturore që lidh natyrën me historinë."
  : "A cultural experience connecting nature with history.";
  // Postimet (published)
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts");
        if (ok) setPosts(Array.isArray(data?.items) ? data.items : []);
      } catch {
        if (ok) setPosts([]);
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

  async function goToPoint(key) {
    const p = TRAIL_POINTS[key];
    if (!p) return;

    const dest = `${p.lat},${p.lng}`;

    try {
      const me = await getUserCoords();
      const origin = `${me.lat},${me.lng}`;
      openGoogleMapsDirections(origin, dest);
    } catch {
      openGoogleMapsPlace(dest);
    }
  }

  //----- Ardit Code Change --- (Image carusel) 

function ImageCarousel() {
const images = [
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
];

const [index, setIndex] = useState(0);

function prev() {
  setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
}

function next() {
  setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
}

return (
  <div className="relative w-full h-[420px]"> {/* match map height */}

    {/* Image */}
    <img
      src={images[index]}
      alt="Gallery"
      className="w-full h-full object-cover rounded-2xl transition-opacity duration-300"
    />

    {/* Left Arrow */}
    <button
      onClick={prev}
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-9 h-9 rounded-full hover:bg-black/60 transition"
    >
      ‹
    </button>

    {/* Right Arrow */}
    <button
      onClick={next}
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-9 h-9 rounded-full hover:bg-black/60 transition"
    >
      ›
    </button>

    {/* Dots */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {images.map((_, i) => (
        <button
          key={i}
          onClick={() => setIndex(i)}
          className={`h-2.5 w-2.5 rounded-full transition ${
            i === index ? "bg-white" : "bg-white/40"
          }`}
        />
      ))}
    </div>
  </div>
);
}

  return (
    <main className="font-sans bg-white text-zinc-900">
      <SEO title={title} description={desc} lang={lang} />
  {/* HERO */}
  <section className="border-b border-zinc-200">
    <div className="mx-auto max-w-5xl px-6 py-24 text-center">

      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs tracking-wide text-zinc-600">
        <span className="h-2 w-2 rounded-full bg-zinc-900" />
        {isSQ ? "Turizëm & Kulturë" : "Tourism & Culture"}
      </div>

      <h1 className="mt-8 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
        {title}
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-xl font-light leading-relaxed text-zinc-600">
        {desc2}
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
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

    </div>
  </section>


      {/* SHTEGU
      <Section
        title={isSQ ? "Shtegu" : "Trail"}
        subtitle={
          isSQ
            ? "Përmbledhje e shpejtë – kliko kartat për të hapur rrugën reale në Google Maps."
            : "Quick overview – click cards to open real directions in Google Maps."
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["levani", "shtyllas", "apollonia"].map((key) => {
            const p = TRAIL_POINTS[key];

            return (
              <button key={key} type="button" onClick={() => goToPoint(key)} className="text-left">
                <Card className="p-5 transition hover:shadow-md">
                  <div className="text-sm font-semibold text-zinc-900">
                    {isSQ ? p.titleSq : p.titleEn}
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">
                    {isSQ ? p.descSq : p.descEn}
                  </p>
                  <div className="mt-3 text-xs text-zinc-500">
                    {isSQ ? "Kliko → hap rrugën në Google Maps" : "Click → open directions in Google Maps"}
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <Link to="/trail" className="btn btn-primary">
            {isSQ ? "Shiko Shtegun" : "Explore Trail"}
          </Link>
        </div>
      </Section> */}

      {/* ANTIKITETI
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
                      <img
                        src={img}
                        alt={pl.title}
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-zinc-50 text-xs text-zinc-500">
                        {isSQ ? "Pa foto" : "No image"}
                      </div>
                    )}

                    <div className="p-5">
                      <div className="text-sm font-semibold text-zinc-900">{pl.title}</div>
                      <div className="mt-1 text-xs text-zinc-600">{pl.subtitle}</div>

                      <div className="mt-3 text-sm text-zinc-600">
                        {p
                          ? p.excerpt_sq || ""
                          : isSQ
                          ? "S’ka post të publikuar ende për këtë vend."
                          : "No published post yet for this place."}
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
                            <>
                              Këshillë: publiko një post me tag <b>place:{pl.key}</b>
                            </>
                          ) : (
                            <>
                              Tip: publish a post with tag <b>place:{pl.key}</b>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-6 p-6">
              <div className="text-sm font-semibold text-zinc-900">
                {isSQ ? "Timeline (mini)" : "Timeline (mini)"}
              </div>

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
      </Section> */}

      {/* HARTA (Ballina) */}
      <Section
        title={isSQ ? "Harta Interaktive" : "Interactive Map"}
        subtitle={
          isSQ ? "Kliko pikat për të hapur artikullin përkatës." : "Click markers to open the related post."
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <MapView />

          {/* <Card className="overflow-hidden">
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
          </Card> */}
          <Card className="overflow-hidden">
            <ImageCarousel />
         </Card>
        </div>
      </Section>

      {/* ✅ PARTNERËT (POSHTË NË KRYEFAQE) */}
      <Section
        title={isSQ ? "Partnerët" : "Partners"}
        subtitle={
          isSQ
            ? "Institucione dhe bashkëpunëtorë ."
            : "Institutions and collaborators ."
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 items-center text-center">
          {PARTNERS.map((p) => (
            <Card key={p.nameSq} className="p-8 flex flex-col items-center gap-4">

              {/* Logo */}
              {p.logo && (
                <img
                  src={p.logo}
                  alt={isSQ ? p.nameSq : p.nameEn}
                  className="h-14 object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              )}

              {/* Name */}
              <div className="text-sm font-medium text-zinc-900">
                {isSQ ? p.nameSq : p.nameEn}
              </div>

              {/* Description */}
              <div className="text-sm text-zinc-600">
                {isSQ ? p.descSq : p.descEn}
              </div>

            </Card>
              ))}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <Link to="/contact" className="btn btn-primary">
            {isSQ ? "Kontakto" : "Contact"}
          </Link>

          {/* Nëse e mban ende faqen /partners, kjo i çon aty opsionale */}
          <Link to="/partners" className="btn btn-outline">
            {isSQ ? "Shiko më shumë" : "See more"}
          </Link>
        </div>
      </Section>
      
    </main>
  );
}
