import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/sections/PageHeader";
import Section from "../../components/sections/Section";
import Card from "../../components/ui/Card";
import { apiAuthGet, apiAuthSend, hasAdminToken } from "../../lib/api";

export default function AdminComments() {
  const nav = useNavigate();
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  async function load(nextStatus = status) {
    try {
      setErr("");
      const data = await apiAuthGet(`/api/admin/comments?status=${encodeURIComponent(nextStatus)}`);
      setItems(data.items || []);
    } catch (e) {
      setErr("Nuk u ngarkuan komentet.");
    }
  }

  useEffect(() => {
    if (!hasAdminToken()) nav("/admin/login");
    else load("pending");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function approve(id) {
    await apiAuthSend(`/api/admin/comments/${id}/approve`, "PUT", {});
    load(status);
  }

  async function reject(id) {
    await apiAuthSend(`/api/admin/comments/${id}/reject`, "PUT", {});
    load(status);
  }

  async function remove(id) {
    if (!confirm("Delete comment?")) return;
    await apiAuthSend(`/api/admin/comments/${id}`, "DELETE", {});
    load(status);
  }

  return (
    <main>
      <PageHeader
        kicker="Admin"
        title="Comments"
        subtitle="Moderim: pending → approve (vetëm pasi email është verifikuar)."
        right={
          <div className="flex items-center gap-2">
            <button
              className={`btn btn-ghost ${status === "pending" ? "opacity-60" : ""}`}
              onClick={() => { setStatus("pending"); load("pending"); }}
            >
              Pending
            </button>
            <button
              className={`btn btn-ghost ${status === "approved" ? "opacity-60" : ""}`}
              onClick={() => { setStatus("approved"); load("approved"); }}
            >
              Approved
            </button>
            <button
              className={`btn btn-ghost ${status === "rejected" ? "opacity-60" : ""}`}
              onClick={() => { setStatus("rejected"); load("rejected"); }}
            >
              Rejected
            </button>
          </div>
        }
      />

      <Section title="" subtitle="">
        {err ? (
          <Card className="p-6">
            <p className="text-sm text-red-600">{err}</p>
          </Card>
        ) : null}

        <div className="grid gap-4">
          {items.map((c) => (
            <Card key={c._id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900">
                    {c.name} <span className="text-xs text-zinc-500">({c.email})</span>
                  </div>

                  <div className="mt-2 text-xs text-zinc-500">
                    Post: <span className="font-medium text-zinc-700">{c.postSlug}</span>
                    {" • "}
                    Verified: <span className="font-medium">{String(c.emailVerified)}</span>
                    {" • "}
                    Status: <span className="font-medium">{c.status}</span>
                  </div>

                  <div className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">
                    {c.message}
                  </div>

                  <div className="mt-2 text-xs text-zinc-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button className="btn btn-ghost" onClick={() => remove(c._id)}>Delete</button>

                  {c.status !== "approved" ? (
                    <button
                      className={`btn btn-primary ${!c.emailVerified ? "opacity-50" : ""}`}
                      onClick={() => approve(c._id)}
                      disabled={!c.emailVerified}
                      title={!c.emailVerified ? "Email not verified" : "Approve"}
                    >
                      Approve
                    </button>
                  ) : null}

                  {c.status !== "rejected" ? (
                    <button className="btn btn-ghost" onClick={() => reject(c._id)}>
                      Reject
                    </button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}

          {items.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-zinc-600">Nuk ka komente në këtë status.</p>
            </Card>
          ) : null}
        </div>
      </Section>
    </main>
  );
}
