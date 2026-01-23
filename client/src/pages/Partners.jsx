import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";

export default function Partners() {
  return (
    <main>
      <PageHeader
        kicker="Partnerët"
        title="Institucione & Bashkëpunëtorë"
        subtitle="Logo, përshkrim dhe roli në projekt (placeholder)."
      />

      <Section title="Partnerët" subtitle="Placeholder">
        <div className="grid gap-4 md:grid-cols-3">
          {["Bashkia Fier", "ZVAP Fier", "Komuniteti"].map((x) => (
            <Card key={x} className="p-6">
              <div className="text-sm font-semibold text-zinc-900">{x}</div>
              <p className="mt-2 text-sm text-zinc-600">Përshkrimi do shtohet më vonë.</p>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
