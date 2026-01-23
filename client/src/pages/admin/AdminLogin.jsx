import { useState } from "react";
import PageHeader from "../../components/sections/PageHeader";
import Section from "../../components/sections/Section";
import Card from "../../components/ui/Card";
import { apiAuthSend, setAdminToken } from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    try {
      setErr("");
      setLoading(true);
      const data = await apiAuthSend("/api/admin/login", "POST", { email, password });
      setAdminToken(data.token);
      nav("/admin/posts");
    } catch (e) {
      setErr("Login failed. Kontrollo kredencialet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHeader kicker="Admin" title="Login" subtitle="Hyr për të menaxhuar postimet." />

      <Section title="" subtitle="">
        <Card className="p-6 max-w-xl">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-900">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-900">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
            </div>

            {err ? <div className="text-sm text-red-600">{err}</div> : null}

            <button className="btn btn-primary" onClick={onSubmit} disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </Card>
      </Section>
    </main>
  );
}
