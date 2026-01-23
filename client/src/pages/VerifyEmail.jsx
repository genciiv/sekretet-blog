import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function VerifyEmail() {
  const [sp] = useSearchParams();
  const token = sp.get("token") || "";
  const [state, setState] = useState({ loading: true, ok: false, msg: "" });

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch(`${API_BASE}/api/comments/verify?token=${encodeURIComponent(token)}`);
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Verify failed");
        }
        setState({ loading: false, ok: true, msg: "Email u verifikua me sukses!" });
      } catch (e) {
        setState({ loading: false, ok: false, msg: "Linku është i pavlefshëm ose ka skaduar." });
      }
    }
    if (token) run();
    else setState({ loading: false, ok: false, msg: "Token mungon." });
  }, [token]);

  return (
    <main>
      <PageHeader kicker="Verify" title="Verifikim email" subtitle="Konfirmo email-in për komentin." />
      <Section title="" subtitle="">
        <Card className="p-6">
          <div className="text-sm font-semibold text-zinc-900">
            {state.loading ? "Duke verifikuar..." : state.ok ? "Sukses ✅" : "Gabim ❌"}
          </div>
          <p className="mt-2 text-sm text-zinc-600">{state.msg}</p>

          <div className="mt-6 flex gap-2">
            <Link to="/blog" className="btn btn-primary">Shko te Blog</Link>
            <Link to="/" className="btn btn-ghost">Ballina</Link>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            Komenti do shfaqet publik pasi të aprovohet nga admin.
          </p>
        </Card>
      </Section>
    </main>
  );
}
