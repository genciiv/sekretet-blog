import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/sections/PageHeader";
import Section from "../../components/sections/Section";
import Card from "../../components/ui/Card";
import { apiAuthGet, apiAuthSend, hasAdminToken } from "../../lib/api";

export default function AdminPostEditor() {
  const nav = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hasAdminToken()) {
      nav("/admin/login");
      return;
    }
    async function load() {
      try {
        setErr("");
        const data = await apiAuthGet(`/api/admin/posts/${id}`);
        setPost(data);
      } catch (e) {
        setErr("Post not found.");
      }
    }
    load();
  }, [id, nav]);

  const tagsString = useMemo(() => (post?.tags || []).join(", "), [post]);

  function setField(key, value) {
    setPost((p) => ({ ...p, [key]: value }));
  }

  async function save(statusOverride) {
    try {
      setSaving(true);
      setErr("");

      const payload = {
        slug: post.slug,
        title_sq: post.title_sq,
        title_en: post.title_en,
        excerpt_sq: post.excerpt_sq,
        excerpt_en: post.excerpt_en,
        content_sq: post.content_sq,
        content_en: post.content_en,
        coverImageUrl: post.coverImageUrl,
        category: post.category,
        tags: tagsString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        status: statusOverride || post.status
      };

      const updated = await apiAuthSend(`/api/admin/posts/${id}`, "PUT", payload);
      setPost(updated);
    } catch (e) {
      setErr("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this post?")) return;
    await apiAuthSend(`/api/admin/posts/${id}`, "DELETE", {});
    nav("/admin/posts");
  }

  if (!post) {
    return (
      <main>
        <PageHeader kicker="Admin" title="Edit post" subtitle={err || "Loading..."} />
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        kicker="Admin"
        title="Edit post"
        subtitle={`Status: ${post.status} • Slug: ${post.slug}`}
        right={
          <div className="flex items-center gap-2">
            <Link className="btn btn-ghost" to="/admin/posts">← Back</Link>
            <Link className="btn btn-ghost" to={`/blog/${post.slug}`} target="_blank">View</Link>
            <button className="btn btn-ghost" onClick={remove}>Delete</button>
            <button className="btn btn-ghost" onClick={() => save("draft")} disabled={saving}>
              Save draft
            </button>
            <button className="btn btn-primary" onClick={() => save("published")} disabled={saving}>
              Publish
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
          <Card className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-900">Slug</label>
                <input
                  value={post.slug || ""}
                  onChange={(e) => setField("slug", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-900">Category</label>
                <input
                  value={post.category || ""}
                  onChange={(e) => setField("category", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-zinc-900">Tags (comma separated)</label>
                <input
                  value={tagsString}
                  onChange={(e) =>
                    setPost((p) => ({ ...p, tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-zinc-900">Cover image URL</label>
                <input
                  value={post.coverImageUrl || ""}
                  onChange={(e) => setField("coverImageUrl", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-900">Title (SQ)</label>
                <input
                  value={post.title_sq || ""}
                  onChange={(e) => setField("title_sq", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-900">Title (EN)</label>
                <input
                  value={post.title_en || ""}
                  onChange={(e) => setField("title_en", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-900">Excerpt (SQ)</label>
                <textarea
                  value={post.excerpt_sq || ""}
                  onChange={(e) => setField("excerpt_sq", e.target.value)}
                  className="mt-2 h-28 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-900">Excerpt (EN)</label>
                <textarea
                  value={post.excerpt_en || ""}
                  onChange={(e) => setField("excerpt_en", e.target.value)}
                  className="mt-2 h-28 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-900">Content (SQ)</label>
                <textarea
                  value={post.content_sq || ""}
                  onChange={(e) => setField("content_sq", e.target.value)}
                  className="mt-2 h-64 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-900">Content (EN)</label>
                <textarea
                  value={post.content_en || ""}
                  onChange={(e) => setField("content_en", e.target.value)}
                  className="mt-2 h-64 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                />
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
