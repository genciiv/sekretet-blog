import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";

export default function Trail() {
  return (
    <main>
      <PageHeader
        kicker="Shtegu"
        title="Levan – Shtyllas – Apolloni"
        subtitle="Itinerar, etapë pas etape, këshilla për vizitorët dhe hartë."
      />

      <Section title="Info të shpejta" subtitle="(do plotësohen më vonë)">
        <div className="grid gap-4 md:grid-cols-3">
          {["Distanca", "Kohë mesatare", "Vështirësia"].map((x) => (
            <Card key={x} className="p-6">
              <div className="text-sm font-semibold text-zinc-900">{x}</div>
              <p className="mt-2 text-sm text-zinc-600">—</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Harta" subtitle="Route + pika (Hapi 2)">
        <Card className="p-6">
          <div className="aspect-[16/7] w-full rounded-2xl bg-zinc-50" />
        </Card>
      </Section>
    </main>
  );
}
