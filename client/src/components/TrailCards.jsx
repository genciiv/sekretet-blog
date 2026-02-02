import React from "react";

const PLACES = {
  nisja: {
    title: "Nisja",
    subtitle: "Levan – pika hyrëse e itinerarit.",
    // ✅ vendos koordinatat reale të Levanit (këto janë shembull)
    lat: 40.6769,
    lng: 19.4876,
    label: "Levan",
  },
  natyre: {
    title: "Natyrë & Ujëra",
    subtitle: "Shtyllas – reliev, shtigje dhe panorama.",
    // ✅ vendos koordinatat reale të Shtyllasit (shembull)
    lat: 40.6719,
    lng: 19.4548,
    label: "Shtyllas",
  },
  histori: {
    title: "Histori",
    subtitle: "Apollonia – trashëgimi arkeologjike.",
    // ✅ Apollonia (afërsisht)
    lat: 40.7249,
    lng: 19.4737,
    label: "Apollonia",
  },
};

function openGoogleMapsDirections({ origin, dest }) {
  const url =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(dest)}` +
    `&travelmode=driving`;
  window.open(url, "_blank", "noopener,noreferrer");
}

async function getUserCoords() {
  // ✅ në localhost punon; në production duhet HTTPS që geolocation të lejohet
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  });
}

export default function TrailCards() {
  async function handleClick(key) {
    const p = PLACES[key];
    const dest = `${p.lat},${p.lng}`;

    try {
      const me = await getUserCoords();
      const origin = `${me.lat},${me.lng}`;
      openGoogleMapsDirections({ origin, dest });
    } catch (e) {
      // nëse user s’e lejon Location → hap vetëm destinacionin
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  const cardCls =
    "rounded-3xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md hover:border-zinc-300";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Object.entries(PLACES).map(([key, p]) => (
        <button key={key} className={cardCls} onClick={() => handleClick(key)} type="button">
          <div className="text-sm font-semibold text-zinc-900">{p.title}</div>
          <div className="mt-1 text-sm text-zinc-600">{p.subtitle}</div>
          <div className="mt-3 text-xs text-zinc-500">
            Kliko → hap rrugën për {p.label}
          </div>
        </button>
      ))}
    </div>
  );
}
