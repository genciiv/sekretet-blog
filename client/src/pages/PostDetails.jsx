// FILE: client/src/pages/PostDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { apiGet, apiSend, absUrl } from "../lib/api.js";

export default function PostDetails() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");

  // comments
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [formOk, setFormOk] = useState("");

  async function loadPost() {
    setErr("");
    setPost(null);
    const data = await apiGet(`/api/posts/${slug}`);
    setPost(data);
  }

  async function loadComments() {
    setLoadingComments(true);
    try {
      const data = await apiGet(`/api/posts/${slug}/comments`);
      setComments(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        await loadPost();
        if (ok) await loadComments();
      } catch {
        if (ok) setErr("Post not found");
      }
    })();
    return () => (ok = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function submitComment(e) {
    e.preventDefault();
    setFormErr("");
    setFormOk("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormErr("Plotëso emrin, emailin dhe mesazhin.");
      return;
    }

    setSending(true);
    try {
      await apiSend(`/api/posts/${slug}/comments`, "POST", {
        name,
        email,
        message,
      });

      setFormOk("Koment u dërgua. Do shfaqet pasi të aprovohet.");
      setName("");
      setEmail("");
      setMessage("");
      // s’ka nevojë reload menjëherë se është pending
      await loadComments();
    } catch (e2) {
      setFormErr("S’u dërgua komenti. Kontrollo emailin dhe provo përsëri.");
    } finally {
      setSending(false);
    }
  }

  if (err) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-lg font-semibold text-zinc-900">{err}</div>
        <div className="mt-4">
          <Link className="btn btn-outline" to="/blog">
            Kthehu te Blog
          </Link>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-sm text-zinc-600">Loading…</div>
      </main>
    );
  }

  const title = post.title_sq || post.title_en || "Post";
  const desc = post.excerpt_sq || post.excerpt_en || "";
  const img = post.coverImageUrl ? absUrl(post.coverImageUrl) : "";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <SEO title={title} description={desc} />

      {img ? (
        <div className="mb-6 overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100">
          <img
            src={img}
            alt={title}
            className="h-[280px] w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h1>

      {desc ? <p className="mt-4 text-zinc-600">{desc}</p> : null}

      <article className="prose prose-zinc mt-8 max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: post.content_sq || post.content_en || "",
          }}
        />
      </article>

      {/* COMMENTS */}
      <div className="mt-12 border-t border-zinc-200 pt-8">
        <h2 className="text-xl font-semibold text-zinc-900">Komentet</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Komentet shfaqen pasi të aprovohen nga admin.
        </p>

        {/* LIST */}
        <div className="mt-6 space-y-3">
          {loadingComments ? (
            <div className="text-sm text-zinc-600">Loading comments…</div>
          ) : comments.length === 0 ? (
            <div className="text-sm text-zinc-600">S’ka komente ende.</div>
          ) : (
            comments.map((c) => (
              <div
                key={c._id}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <div className="text-sm font-semibold text-zinc-900">
                  {c.name || "Anonim"}
                </div>
                <div className="mt-2 text-sm text-zinc-700">{c.message}</div>
              </div>
            ))
          )}
        </div>

        {/* FORM */}
        <form
          onSubmit={submitComment}
          className="mt-8 rounded-3xl border border-zinc-200 bg-white p-5"
        >
          <div className="text-sm font-semibold text-zinc-900">
            Lëre një koment
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Emri"
              className="w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-zinc-400"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Komenti..."
            rows={4}
            className="mt-3 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-zinc-400"
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              disabled={sending}
              className="btn btn-primary disabled:opacity-60"
              type="submit"
            >
              {sending ? "Duke dërguar..." : "Dërgo koment"}
            </button>

            {formErr ? (
              <span className="text-sm text-red-600">{formErr}</span>
            ) : null}

            {formOk ? (
              <span className="text-sm text-green-700">{formOk}</span>
            ) : null}
          </div>
        </form>
      </div>
    </main>
  );
}
