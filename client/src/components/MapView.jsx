import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { apiGet } from "../lib/api.js";
import { useI18n } from "../i18n/i18n.jsx";

// Fix ikonat default të Leaflet në Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const PLACES = [
  { key: "apollonia", labelSQ: "Apollonia", labelEN: "Apollonia", lat: 40.7287, lng: 19.4806 },
  { key: "bylis", labelSQ: "Bylis", labelEN: "Byllis", lat: 40.6069, lng: 19.7354 },
  { key: "ardenica", labelSQ: "Ardenica", labelEN: "Ardenica", lat: 40.7753, lng: 19.6697 },
];

// shteg (placeholder i bukur) – mund ta zëvendësosh me GPX më vonë
const TRAIL_LINE = [
  [40.7287, 19.4806],
  [40.745, 19.57],
  [40.7753, 19.6697],
  [40.6069, 19.7354],
];

function pickPostForPlace(items, placeKey) {
  const k = String(placeKey).toLowerCase();

  // 1) tag place:xxx
  const byTag = items.find((p) =>
    Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase() === `place:${k}`)
  );
  if (byTag) return byTag;

  // 2) category match (Apollonia/Bylis/Ardenica)
  const byCat = items.find((p) => String(p.category || "").toLowerCase() === k);
  if (byCat) return byCat;

  // 3) fallback: asgjë
  return null;
}

export default function MapView() {
  const { lang } = useI18n();
  const isSQ = lang === "sq";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const center = useMemo(() => [40.72, 19.62], []);

  if (loading) {
    return <div className="text-sm text-zinc-600">Loading map…</div>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
      <div className="h-[360px]">
        <MapContainer center={center} zoom={9} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline positions={TRAIL_LINE} />

          {PLACES.map((pl) => {
            const post = pickPostForPlace(items, pl.key);
            const label = isSQ ? pl.labelSQ : pl.labelEN;

            return (
              <Marker key={pl.key} position={[pl.lat, pl.lng]}>
                <Popup>
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold">{label}</div>

                    {post ? (
                      <>
                        <div className="text-xs text-zinc-600">
                          {isSQ ? (post.excerpt_sq || "") : (post.excerpt_en || post.excerpt_sq || "")}
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-3 py-2 text-xs font-semibold text-white"
                        >
                          {isSQ ? "Hap artikullin" : "Open post"}
                        </Link>
                      </>
                    ) : (
                      <div className="text-xs text-zinc-600">
                        {isSQ ? "S’ka post ende për këtë pikë." : "No post yet for this place."}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="border-t border-zinc-200 p-4 text-xs text-zinc-600">
        {isSQ
          ? "Kliko një marker për të hapur artikullin përkatës."
          : "Click a marker to open the related post."}
      </div>
    </div>
  );
}
