import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";

export default function Blog() {
  return (
    <main>
      <PageHeader
        kicker="Blog"
        title="Artikuj & Story"
        subtitle="Postime në shqip dhe anglisht, me kategori, tags dhe kërkim."
      />

      <Section title="Postimet e fundit" subtitle="Placeholder (Hapi 3 do i lidhim me backend)">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="text-sm font-semibold text-zinc-900">Post #{i}</div>
              <p className="mt-2 text-sm text-zinc-600">Përmbledhje e shkurtër…</p>
              <div className="mt-4 h-24 rounded-xl bg-zinc-50" />
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
