// import PageHeader from "../components/sections/PageHeader";
// import Section from "../components/sections/Section";
// import Card from "../components/ui/Card";
// import PlacesMap from "../components/Map/PlacesMap";
// import TimelineTabs from "../components/timeline/TimelineTabs.jsx";

// import { places } from "../data/places";

// export default function Antiquity() {
//   const antiquityPlaces = places.filter((p) => p.type === "antiquity");

//   return (
//     <main>
//       <PageHeader
//         kicker="Antikiteti"
//         title="Antikiteti i zonës"
//         subtitle="Pika kryesore, timeline dhe hartë (UNESCO-style)."
//       />

//       <Section title="Pikat kryesore" subtitle="(placeholder – do pasurohen me artikuj)">
//         <div className="grid gap-4 md:grid-cols-3">
//           {["Apollonia", "Byllis", "Objekte & Monumente"].map((x) => (
//             <Card key={x} className="p-6">
//               <div className="text-sm font-semibold text-zinc-900">{x}</div>
//               <p className="mt-2 text-sm text-zinc-600">
//                 Këtu do futen përshkrime SQ/EN, foto dhe lidhje te postimet.
//               </p>
//               <div className="mt-4 h-20 rounded-xl bg-zinc-50" />
//             </Card>
//           ))}
//         </div>
//       </Section>

//       <Section title="Harta e antikitetit" subtitle="Pika arkeologjike dhe historike">
//         <Card className="p-6">
//           <PlacesMap places={antiquityPlaces} heightClass="h-[420px]" showRoute={false} />
//         </Card>
//       </Section>

//       <Section
//   title="Timeline"
//   subtitle="Kliko periudhën dhe shfaqen vetëm postet përkatëse (tags: period:*)."
// >
//   <TimelineTabs defaultPeriod="archaic" limit={6} />
// </Section>
//     </main>
//   );
// }


// --- Ardit Code ---
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import { useI18n } from "../i18n/i18n.jsx";

const TRAIL_POINTS = {
  levani: {
    titleSq: "Nisja",
    titleEn: "Start",
    descSq: "Levan – pika hyrëse e itinerarit.",
    descEn: "Levan – entry point of the route.",
    lat: 40.6769,
    lng: 19.4876,
  },
  shtyllas: {
    titleSq: "Natyrë & Ujëra",
    titleEn: "Nature & Water",
    descSq: "Shtyllas – reliev, shtigje dhe panorama.",
    descEn: "Shtyllas – terrain, trails and views.",
    lat: 40.6719,
    lng: 19.4548,
  },
  apollonia: {
    titleSq: "Histori",
    titleEn: "History",
    descSq: "Apollonia – trashëgimi arkeologjike.",
    descEn: "Apollonia – archaeological heritage.",
    lat: 40.7249,
    lng: 19.4737,
  },
};

function goToPoint(key) {
  const p = TRAIL_POINTS[key];
  if (!p) return;

  const url = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function Trail() {
  const { lang } = useI18n();
  const isSQ = lang === "sq";

  return (
    <main>
      <PageHeader
        kicker={isSQ ? "Shtegu" : "Trail"}
        title={isSQ ? "Itinerari Levan – Shtyllas – Apolloni" : "Levan – Shtyllas – Apollonia Route"}
        subtitle={
          isSQ
            ? "Kliko kartat për të hapur vendndodhjen reale në Google Maps."
            : "Click cards to open real location in Google Maps."
        }
      />

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {["levani", "shtyllas", "apollonia"].map((key) => {
            const p = TRAIL_POINTS[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => goToPoint(key)}
                className="text-left"
              >
                <Card className="p-5 transition hover:shadow-md">
                  <div className="text-sm font-semibold text-zinc-900">
                    {isSQ ? p.titleSq : p.titleEn}
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">
                    {isSQ ? p.descSq : p.descEn}
                  </p>
                  <div className="mt-3 text-xs text-zinc-500">
                    {isSQ
                      ? "Kliko → hap rrugën në Google Maps"
                      : "Click → open location in Google Maps"}
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </Section>
    </main>
  );
}
