// FILE: client/src/pages/Contact.jsx
import { useState } from "react";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import { apiSend } from "../lib/api.js";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();

    if (!em) return setErr("Email është i detyrueshëm.");
    if (msg.length < 5) return setErr("Mesazhi është shumë i shkurtër.");

    setSending(true);
    try {
      await apiSend("/api/contact", "POST", {
        name: n,
        email: em,
        message: msg,
      });
      setOk("Mesazhi u dërgua. Faleminderit!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (e2) {
      setErr(String(e2?.message || e2));
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <PageHeader
        kicker="Kontakt"
        title="Na kontakto"
        subtitle="Na shkruaj dhe do të të kthejmë përgjigje sa më shpejt."
      />

      <Section title="Forma">
        <Card className="p-6">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-zinc-900">Emri</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-sm font-medium text-zinc-900">
                Email *
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-900">
                Mesazhi *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-2 h-32 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
            </div>

            {err ? (
              <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            {ok ? (
              <div className="md:col-span-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                {ok}
              </div>
            ) : null}

            <div className="md:col-span-2">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={sending}
              >
                {sending ? "Duke dërguar…" : "Dërgo"}
              </button>
            </div>
          </form>
        </Card>
      </Section>
    </main>
  );
}
