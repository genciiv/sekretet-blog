import { useEffect, useState } from "react";
import Card from "../ui/Card";
import { useI18n } from "../../i18n/i18n.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function CommentsSection({ postSlug }) {
  const { lang } = useI18n();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState({ loading: true, sending: false, msg: "", err: "" });

  async function load() {
    try {
      setState((s) => ({ ...s, loading: true, err: "" }));
      const res = await fetch(`${API_BASE}/api/posts/${postSlug}/comments`);
      const data = await res.json();
      setItems(data.items || []);
      setState((s) => ({ ...s, loading: false }));
    } catch (e) {
      setState((s) => ({ ...s, loading: false, err: "Nuk u ngarkuan komentet." }));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postSlug]);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setState((s) => ({ ...s, err: "", msg: "" }));
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setState((s) => ({ ...s, err: lang === "en" ? "Fill all fields." : "Plotëso të gjitha fushat." }));
      return;
    }

    try {
      setState((s) => ({ ...s, sending: true }));
      const res = await fetch(`${API_BASE}/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed");
      }

      setForm({ name: "", email: "", message: "" });
      setState((s) => ({
        ...s,
        sending: false,
        msg:
          lang === "en"
            ? "Check your email to verify. Comment will appear after admin approval."
            : "Kontrollo email-in për verifikim. Komenti shfaqet pasi ta aprovojë admin-i.",
      }));
    } catch (e) {
      setState((s) => ({
        ...s,
        sending: false,
        err: lang === "en" ? "Failed to send comment." : "Dështoi dërgimi i komentit.",
      }));
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="text-sm font-semibold text-zinc-900">
          {lang === "en" ? "Comments" : "Komente"}
        </div>
        <p className="mt-2 text-sm text-zinc-600">
          {lang === "en"
            ? "To prevent fake emails: comments require email verification and admin approval."
            : "Për të shmangur email-e fake: komentet kërkojnë verifikim me email dhe aprovim nga admin-i."}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-900">{lang === "en" ? "Name" : "Emri"}</label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-900">Email</label>
            <input
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-zinc-900">{lang === "en" ? "Message" : "Mesazhi"}</label>
            <textarea
              value={form.message}
              onChange={(e) => setField("message", e.target.value)}
              className="mt-2 h-28 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <button className="btn btn-primary" type="button" onClick={submit} disabled={state.sending}>
              {state.sending ? (lang === "en" ? "Sending..." : "Duke dërguar...") : (lang === "en" ? "Send" : "Dërgo")}
            </button>
            <button className="btn btn-ghost" type="button" onClick={load}>
              {lang === "en" ? "Refresh" : "Rifresko"}
            </button>
          </div>
        </div>

        {state.err ? <div className="mt-4 text-sm text-red-600">{state.err}</div> : null}
        {state.msg ? <div className="mt-4 text-sm text-green-700">{state.msg}</div> : null}
      </Card>

      <Card className="p-6">
        <div className="text-sm font-semibold text-zinc-900">
          {lang === "en" ? "Approved comments" : "Komentet e aprovuara"}
        </div>

        {state.loading ? (
          <p className="mt-2 text-sm text-zinc-600">{lang === "en" ? "Loading..." : "Duke ngarkuar..."}</p>
        ) : items.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">{lang === "en" ? "No comments yet." : "S’ka komente ende."}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {items.map((c, idx) => (
              <div key={idx} className="rounded-2xl border border-zinc-200 p-4">
                <div className="text-sm font-semibold text-zinc-900">{c.name}</div>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{c.message}</div>
                <div className="mt-2 text-xs text-zinc-500">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
