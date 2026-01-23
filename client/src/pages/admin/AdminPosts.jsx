import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/sections/PageHeader";
import Section from "../../components/sections/Section";
import Card from "../../components/ui/Card";
import { apiAuthGet, apiAuthSend, clearAdminToken, hasAdminToken } from "../../lib/api";

export default function AdminPosts() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const data = await apiAuthGet("/api/admin/posts");
      setItems(data.items || []);
    } catch (e) {
      setErr("Nuk u ngarkuan postimet (token mund të jetë i pavlefshëm).");
    }
  }

  useEffect(() => {
    if (!hasAdminToken()) nav("/admin/login");
    else load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createNew() {
    const body = {
      title_sq: "Titull i ri (SQ)",
      title_en: "New title (EN)",
      excerpt_sq: "",
      excerpt_en: "",
      content_sq: "",
      content_en: "",
      category: "Antikitet",
      tags: ["apollonia"],
      status: "draft",
      coverImageUrl: ""
    };

    const created = await apiAuthSend("/api/admin/posts", "POST", body);
    nav(`/admin/posts/${created._id}`);
  }

  function logout() {
    clearAdminToken();
    nav("/admin/login");
  }

  return (
    <main>
      <PageHeader
        kicker="Admin"
        title="Posts"
        subtitle="Krijo, edito dhe publiko artikuj."
        right={
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
            <button className="btn btn-primary" onClick={createNew}>+ New post</button>
          </div>
        }
      />

      <Section title="" subtitle="">
        {err ? (
          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">Error</div>
            <p className="mt-2 text-sm text-zinc-600">{err}</p>
          </Card>
        ) : null}

        <div className="grid gap-4">
          {items.map((p) => (
            <Card key={p.slug} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{p.title_sq}</div>
                  <div className="mt-1 text-xs text-zinc-600">{p.title_en}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="badge">{p.status}</span>
                    <span className="badge">{p.category || "General"}</span>
                    {(p.tags || []).slice(0, 4).map((t) => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-zinc-500">Slug: {p.slug}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Link className="btn btn-ghost" to={`/blog/${p.slug}`} target="_blank">
                    View
                  </Link>
                  <Link className="btn btn-primary" to={`/admin/posts/${p._id}`}>
                    Edit
                  </Link>
                </div>
              </div>
            </Card>
          ))}

          {items.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-zinc-600">Nuk ka postime. Krijo një post të ri.</p>
            </Card>
          ) : null}
        </div>
      </Section>
    </main>
  );
}
