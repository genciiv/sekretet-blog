import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";

export default function Contact() {
  return (
    <main>
      <PageHeader
        kicker="Kontakt"
        title="Na kontakto"
        subtitle="Formë kontakti + informacione (placeholder)."
      />

      <Section title="Forma" subtitle="(Hapi 4 do e lidhim me backend)">
        <Card className="p-6">
          <form className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-zinc-900">Emri</label>
              <input className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400" />
            </div>
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-zinc-900">Email</label>
              <input className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-900">Mesazhi</label>
              <textarea className="mt-2 h-32 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400" />
            </div>
            <div className="md:col-span-2">
              <button className="btn btn-primary" type="button">
                Dërgo
              </button>
            </div>
          </form>
        </Card>
      </Section>
    </main>
  );
}
