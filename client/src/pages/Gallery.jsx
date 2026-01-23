import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";

export default function Gallery() {
  return (
    <main>
      <PageHeader
        kicker="Galeria"
        title="Foto & Momente"
        subtitle="Grid + lightbox (do ndërtohet në hapin pasues)."
      />

      <Section title="Grid" subtitle="Placeholder">
        <Card className="p-6">
          <div className="grid gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-zinc-50" />
            ))}
          </div>
        </Card>
      </Section>
    </main>
  );
}
