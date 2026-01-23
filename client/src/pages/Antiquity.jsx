import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";

export default function Antiquity() {
  return (
    <main>
      <PageHeader
        kicker="Antikiteti"
        title="Antikiteti i zonës"
        subtitle="Pika kryesore, timeline dhe përmbajtje UNESCO-style (SQ/EN)."
      />

      <Section title="Pikat kryesore" subtitle="Apollonia, Byllis, Ardenica (placeholder)">
        <div className="grid gap-4 md:grid-cols-3">
          {["Apollonia", "Byllis", "Ardenica"].map((x) => (
            <Card key={x} className="p-6">
              <div className="text-sm font-semibold text-zinc-900">{x}</div>
              <p className="mt-2 text-sm text-zinc-600">Detajet do shtohen më vonë.</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Timeline" subtitle="Shek. VI p.e.s → Romakët → Mesjeta → Sot">
        <Card className="p-6">
          <div className="h-40 rounded-2xl bg-zinc-50" />
        </Card>
      </Section>
    </main>
  );
}
