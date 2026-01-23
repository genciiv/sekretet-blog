import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { MAP_POINTS, MAP_ROUTE_POLYLINE } from "../data/mapPoints.js";
import { useI18n } from "../i18n/i18n.jsx";

export default function MapView() {
  const nav = useNavigate();
  const { lang } = useI18n();

  const center = [40.67, 19.6];
  const zoom = 10;

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Shtegu (polyline) */}
        <Polyline positions={MAP_ROUTE_POLYLINE} />

        {/* Pikat */}
        {MAP_POINTS.map((p) => {
          const title = lang === "en" ? p.name_en : p.name_sq;
          const sub = lang === "en" ? p.subtitle_en : p.subtitle_sq;

          return (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <div className="min-w-[220px]">
                  <div className="text-sm font-semibold text-zinc-900">
                    {title}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600">{sub}</div>

                  <button
                    type="button"
                    onClick={() => nav(p.to)}
                    className="mt-3 inline-flex h-9 items-center rounded-full bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800"
                  >
                    Hap
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
