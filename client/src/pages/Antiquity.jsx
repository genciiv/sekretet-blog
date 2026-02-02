import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import PlacesMap from "../components/Map/PlacesMap";
import TimelineTabs from "../components/timeline/TimelineTabs.jsx";

import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { apiGet, absUrl } from "../lib/api";

import { places } from "../data/places";

// ======================
// CLICK → LOCATION → DIRECTIONS (REAL LOCATION)
// ======================
function openGoogleMapsDirections(origin, dest) {
  const url =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(dest)}` +
    `&travelmode=driving`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openGoogleMapsPlace(dest) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest)}`;
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
  return Array.isArray(p?.tags) && p.tags.some((x) => String(x || "").trim().toLowerCase() === t);
}

function pickPostForPlace(items, placeKey) {
  const k = String(placeKey || "").trim().toLowerCase();
  return (items || []).find((p) => hasTag(p, `place:${k}`)) || null;
}

// ⚠️ Ndrysho lat/lng me koordinatat reale
const ANTIQUITY_CARDS = [
  {
    key: "apollonia",
    title: "Apollonia",
    fallbackText: "Park arkeologjik – histori, rrënoja dhe muze.",
    lat: 40.7249,
    lng: 19.4737,
  },
  {
    key: "bylis",
    title: "Byllis",
    fallbackText: "Qytet antik – mure, bazilika dhe panorama.",
    lat: 40.5485,
    lng: 19.7402,
  },
  {
    key: "monumente",
    title: "Objekte & Monumente",
    fallbackText: "Pika dhe objekte historike përgjatë zonës.",
    lat: 40.6769,
    lng: 19.4876,
  },
];

export default function Antiquity() {
  const antiquityPlaces = places.filter((p) => p.type === "antiquity");

  // Merr postimet published që të ushqejmë kartat
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

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

  const cards = useMemo(() => {
    return ANTIQUITY_CARDS.map((c) => ({
      ...c,
      post: pickPostForPlace(posts, c.key),
    }));
  }, [posts]);

  async function goToPoint(lat, lng) {
    const dest = `${lat},${lng}`;
    try {
      const me = await getUserCoords();
      const origin = `${me.lat},${me.lng}`;
      openGoogleMapsDirections(origin, dest);
    } catch {
      openGoogleMapsPlace(dest);
    }
  }

  return (
    <main>
      <PageHeader
        kicker="Antikiteti"
        title="Antikiteti i zonës"
        subtitle="Pika kryesore, timeline dhe hartë (UNESCO-style)."
      />

      <Section title="Pikat kryesore" subtitle="Kliko për hartë / ose lexo artikullin">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => {
            const p = c.post;
            const title = c.title;
            const img = p?.coverImageUrl ? absUrl(p.coverImageUrl) : "";
            const excerpt = (p?.excerpt_sq || "").trim();

            return (
              <Card key={c.key} className="overflow-hidden p-0">
                {img ? (
                  <img src={img} alt={title} className="h-40 w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-zinc-50 text-xs text-zinc-500">
                    Pa foto
                  </div>
                )}

                <div className="p-5">
                  <div className="text-sm font-semibold text-zinc-900">{title}</div>

                  <p className="mt-2 text-sm text-zinc-600">
                    {p ? (excerpt || "Kliko ‘Lexo’ për detaje.") : c.fallbackText}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => goToPoint(c.lat, c.lng)}
                    >
                      Hap në hartë
                    </button>

                    {p ? (
                      <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
                        Lexo artikullin
                      </Link>
                    ) : (
                      <Link className="btn btn-primary" to="/admin/posts">
                        Shto nga Admin
                      </Link>
                    )}
                  </div>

                  {!p ? (
                    <div className="mt-3 text-xs text-zinc-500">
                      Këshillë: publiko një post me tag <b>place:{c.key}</b>
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>

        {loadingPosts ? (
          <div className="mt-4 text-sm text-zinc-600">Duke ngarkuar postimet…</div>
        ) : null}
      </Section>

      <Section title="Harta e antikitetit" subtitle="Pika arkeologjike dhe historike">
        <Card className="p-6">
          <PlacesMap places={antiquityPlaces} heightClass="h-[420px]" showRoute={false} />
        </Card>
      </Section>

      <Section
        title="Timeline"
        subtitle="Kliko periudhën dhe shfaqen vetëm postet përkatëse (tags: period:*)."
      >
        <TimelineTabs defaultPeriod="archaic" limit={6} />
      </Section>
    </main>
  );
}
