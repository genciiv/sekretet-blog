import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useMemo } from "react";
import { useI18n } from "../../i18n/i18n.jsx";

export default function PlacesMap({
  places = [],
  heightClass = "h-[360px]",
  showRoute = true,
}) {
  const { lang } = useI18n();

  const center = useMemo(() => {
    if (!places.length) return [40.7, 19.6];
    const avgLat = places.reduce((s, p) => s + p.lat, 0) / places.length;
    const avgLng = places.reduce((s, p) => s + p.lng, 0) / places.length;
    return [avgLat, avgLng];
  }, [places]);

  const route = useMemo(() => {
    if (!showRoute) return null;
    // Route order: Levan -> Shtyllas -> Apollonia (adjust later)
    const order = ["levan", "shtyllas", "apollonia"];
    const ordered = order
      .map((id) => places.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => [p.lat, p.lng]);

    return ordered.length >= 2 ? ordered : null;
  }, [places, showRoute]);

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white ${heightClass}`}>
      <MapContainer center={center} zoom={10} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {route ? <Polyline positions={route} /> : null}

        {places.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div className="space-y-1">
                <div className="text-sm font-semibold">
                  {lang === "en" ? p.name_en : p.name_sq}
                </div>
                <div className="text-xs text-zinc-600">
                  {lang === "en" ? p.blurb_en : p.blurb_sq}
                </div>
                <div className="pt-1 text-[11px] text-zinc-500">
                  {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
