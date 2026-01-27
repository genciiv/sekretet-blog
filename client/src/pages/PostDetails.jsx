import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import SEO from "../components/SEO.jsx";
import { apiGet, apiSend, absUrl } from "../lib/api.js";

function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleString("sq-AL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function PostDetails() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // comments
  const [comments, setComments] = useState([]);
  const [cLoading, setCLoading] = useState(true);
  const [cErr, setCErr] = useState("");
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState("");

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet(`/api/posts/${slug}`);
        if (ok) setPost(data);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => (ok = false);
  }, [slug]);

  async function loadComments() {
    setCLoading(true);
    setCErr("");
    try {
      const data = await apiGet(`/api/posts/${slug}/comments`);
      setComments(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setCErr(String(e?.message || e));
    } finally {
      setCLoading(false);
    }
  }

  useEffect(() => {
    let ok = true;
    (async () => {
      await loadComments();
      if (!ok) return;
    })();
    return () => (ok = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const title = useMemo(() => (post?.title_sq || "").trim(), [post]);
  const excerpt = useMemo(() => (post?.excerpt_sq || "").trim(), [post]);
  const content = useMemo(() => post?.content_sq || "", [post]);

  const metaDesc = useMemo(() => {
    const a = excerpt?.trim();
    if (a) return a;
    return stripHtml(content).slice(0, 160);
  }, [excerpt, content]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-sm text-zinc-600">Loading…</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-14">
        <SEO title="Nuk u gjet" description="Postimi nuk u gjet" noindex />
        <div className="text-sm text-zinc-600">Nuk u gjet.</div>
      </main>
    );
  }

  const ogImage = post.coverImageUrl ? absUrl(post.coverImageUrl) : "/og-default.jpg";

  async function submitComment(e) {
    e.preventDefault();
    setSentMsg("");
    setCErr("");

    const name = String(form.name || "").trim();
    const email = String(form.email || "").trim();
    const message = String(form.message || "").trim();

    if (!name || !email || !message) {
      setCErr("Plotëso emrin, email-in dhe mesazhin.");
      return;
    }

    setSending(true);
    try {
      await apiSend(`/api/posts/${slug}/comments`, "POST", { name, email, message });
      setForm({ name: "", email: "", message: "" });
      setSentMsg("U dërgua! Komenti do shfaqet pasi të aprovohet nga admin.");
      // nuk shfaqet menjëherë sepse është pending – por rifreskojmë listën:
      await loadComments();
    } catch (ex) {
      setCErr(String(ex?.message || ex));
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <SEO title={title || "Post"} description={metaDesc} image={ogImage} canonical={`/blog/${post.slug}`} />

      <PageHeader kicker={post.category || "Blog"} title={title || "Pa titull"} subtitle={excerpt} />

      <Section title="" subtitle="">
        <Card className="p-6">
          {post.coverImageUrl ? (
            <img
              src={absUrl(post.coverImageUrl)}
              alt={title || "cover"}
              className="mb-6 h-[320px] w-full rounded-2xl border border-zinc-200 object-cover"
              loading="lazy"
            />
          ) : null}

          <article className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-800">
              {stripHtml(content) ? content : "S’ka përmbajtje."}
            </div>
          </article>
        </Card>
      </Section>

      {/* COMMENTS */}
      <Section title="Komentet" subtitle="Komentet shfaqen vetëm pasi të aprovohen.">
        <div className="grid gap-4 md:grid-cols-[1fr_360px]">
          {/* List */}
          <Card className="p-6">
            {cLoading ? (
              <div className="text-sm text-zinc-600">Duke i ngarkuar komentet…</div>
            ) : cErr ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {cErr}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-sm text-zinc-600">S’ka komente ende.</div>
            ) : (
              <div className="grid gap-4">
                {comments.map((c) => (
                  <div key={c._id} className="rounded-2xl border border-zinc-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-zinc-900">{c.name || "Anonim"}</div>
                      <div className="text-xs text-zinc-500">{formatDate(c.createdAt)}</div>
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{c.message}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Form */}
          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">Lëre një koment</div>
            <p className="mt-1 text-xs text-zinc-500">
              Komenti shkon “pending” dhe shfaqet pasi ta aprovojë admin.
            </p>

            {sentMsg ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {sentMsg}
              </div>
            ) : null}

            {cErr ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {cErr}
              </div>
            ) : null}

            <form className="mt-4 grid gap-3" onSubmit={submitComment}>
              <input
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
                placeholder="Emri"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <textarea
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                rows={5}
                placeholder="Mesazhi"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />

              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {sending ? "Duke dërguar…" : "Dërgo koment"}
              </button>
            </form>
          </Card>
        </div>
      </Section>
    </main>
  );
}
