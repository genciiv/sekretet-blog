// FILE: client/src/pages/admin/AdminContacts.jsx
import { useEffect, useMemo, useState } from "react";
import Card from "../../components/ui/Card.jsx";
import { apiAuthGet, apiAuthSend } from "../../lib/api.js";

function Badge({ children, tone = "zinc" }) {
  const map = {
    zinc: "bg-zinc-100 text-zinc-800 border-zinc-200",
    green: "bg-green-50 text-green-800 border-green-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-800 border-red-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        map[tone] || map.zinc,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function statusTone(s) {
  if (s === "new") return "amber";
  if (s === "answered") return "green";
  if (s === "closed") return "zinc";
  return "zinc";
}

export default function AdminContacts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [err, setErr] = useState("");

  const [openId, setOpenId] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("status", status);
      if (q.trim()) qs.set("q", q.trim());
      const data = await apiAuthGet(`/api/admin/contacts?${qs.toString()}`);
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // (opsionale) nëse do e përdorësh më vonë
  useMemo(() => items.find((x) => x._id === openId), [items, openId]);

  // ✅ RREGULLIM: emër tjetër (mos përplaset me setStatus të useState)
  async function updateContactStatus(id, next) {
    await apiAuthSend(`/api/admin/contacts/${id}`, "PUT", { status: next });
    await load();
  }

  async function remove(id) {
    const ok = confirm("Ta fshij këtë kontakt?");
    if (!ok) return;
    await apiAuthSend(`/api/admin/contacts/${id}`, "DELETE");
    setOpenId("");
    await load();
  }

  async function reply(id) {
    const subject = prompt("Subject i email-it:", "Përgjigje nga Sekretet");
    if (!subject) return;

    const body = prompt("Shkruaj përgjigjen (text):");
    if (!body) return;

    await apiAuthSend(`/api/admin/contacts/${id}/reply`, "POST", {
      subject,
      body,
    });
    await load();
    alert("U dërgua email-i.");
  }

  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input
              className="h-10 w-full md:w-80 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="Kërko emër / email / mesazh…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />

            <select
              className="h-10 rounded-xl border border-zinc-200 px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Të gjitha</option>
              <option value="new">New</option>
              <option value="answered">Answered</option>
              <option value="closed">Closed</option>
            </select>

            <button className="btn" onClick={load} type="button">
              Rifresko
            </button>
          </div>

          <div className="text-xs text-zinc-500">
            Total:{" "}
            <span className="font-semibold text-zinc-900">{items.length}</span>
          </div>
        </div>

        {err ? (
          <div className="mt-3 text-sm text-red-600">Gabim: {err}</div>
        ) : null}
      </Card>

      {loading ? (
        <div className="text-sm text-zinc-600">Loading…</div>
      ) : items.length === 0 ? (
        <Card className="p-6">
          <div className="text-sm font-semibold">S’ka kontakte</div>
          <div className="mt-1 text-sm text-zinc-600">
            Kur userat të dërgojnë nga /contact, do shfaqen këtu.
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((x) => (
            <Card key={x._id} className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-zinc-900">
                      {x.name || "Pa emër"}
                    </div>
                    <Badge tone={statusTone(x.status)}>{x.status}</Badge>
                    <div className="text-xs text-zinc-500">
                      {new Date(x.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-1 text-sm text-zinc-700">
                    <span className="font-medium">{x.email}</span>
                  </div>

                  <div className="mt-2 text-sm text-zinc-600 line-clamp-2">
                    {x.message}
                  </div>

                  {openId === x._id ? (
                    <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="text-xs text-zinc-500">
                        Mesazhi i plotë
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-800">
                        {x.message}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setOpenId(openId === x._id ? "" : x._id)}
                  >
                    {openId === x._id ? "Mbyll" : "Hap"}
                  </button>

                  <a
                    className="btn"
                    href={`mailto:${x.email}?subject=Sekretet%20-%20Përgjigje`}
                  >
                    Mailto
                  </a>

                  <button
                    className="btn"
                    type="button"
                    onClick={() => reply(x._id)}
                  >
                    Reply (SMTP)
                  </button>

                  {x.status !== "answered" ? (
                    <button
                      className="btn"
                      type="button"
                      onClick={() => updateContactStatus(x._id, "answered")}
                    >
                      Shëno Answered
                    </button>
                  ) : null}

                  {x.status !== "closed" ? (
                    <button
                      className="btn"
                      type="button"
                      onClick={() => updateContactStatus(x._id, "closed")}
                    >
                      Close
                    </button>
                  ) : null}

                  <button
                    className="btn"
                    type="button"
                    onClick={() => remove(x._id)}
                  >
                    Fshi
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
