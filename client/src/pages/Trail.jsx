import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import PlacesMap from "../components/Map/PlacesMap";
import TimelineTabs from "../components/timeline/TimelineTabs.jsx";

import { places } from "../data/places";

export default function Antiquity() {
  const antiquityPlaces = places.filter((p) => p.type === "antiquity");

  return (
    <main>
      <PageHeader
        kicker="Antikiteti"
        title="Antikiteti i zonës"
        subtitle="Pika kryesore, timeline dhe hartë (UNESCO-style)."
      />

      <Section title="Pikat kryesore" subtitle="(placeholder – do pasurohen me artikuj)">
        <div className="grid gap-4 md:grid-cols-3">
          {["Apollonia", "Byllis", "Objekte & Monumente"].map((x) => (
            <Card key={x} className="p-6">
              <div className="text-sm font-semibold text-zinc-900">{x}</div>
              <p className="mt-2 text-sm text-zinc-600">
                Këtu do futen përshkrime SQ/EN, foto dhe lidhje te postimet.
              </p>
              <div className="mt-4 h-20 rounded-xl bg-zinc-50" />
            </Card>
          ))}
        </div>
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
