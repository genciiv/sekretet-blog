import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import { useI18n } from "../../i18n/i18n.jsx";
import L from "leaflet";

function FitBounds({ places }) {
  const map = useMap();

  useEffect(() => {
    if (!places || places.length === 0) return;

    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [places, map]);

  return null;
}

export default function PlacesMap({
  places = [],
  heightClass = "h-[360px]",
  showRoute = true,
}) {
  const { lang } = useI18n();

  const route = useMemo(() => {
    if (!showRoute) return null;
    const order = ["levan", "shtyllas", "apollonia"];
    const ordered = order
      .map((id) => places.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => [p.lat, p.lng]);
    return ordered.length >= 2 ? ordered : null;
  }, [places, showRoute]);

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white ${heightClass}`}>
      <MapContainer
        center={[40.7, 19.6]}
        zoom={10}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto-fit */}
        <FitBounds places={places} />

        {/* Route line */}
        {route ? <Polyline positions={route} /> : null}

        {/* Markers */}
        {places.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div className="space-y-2">
                <div className="text-sm font-semibold">
                  {lang === "en" ? p.name_en : p.name_sq}
                </div>
                <div className="text-xs text-zinc-600">
                  {lang === "en" ? p.blurb_en : p.blurb_sq}
                </div>

                {/* Google Maps */}
                <a
                  href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-zinc-900 hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
