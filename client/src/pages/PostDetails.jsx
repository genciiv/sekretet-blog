import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import SEO from "../components/SEO.jsx";
import { apiGet, apiSend } from "../lib/api.js";

export default function PostDetails() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    let ok = true;

    (async () => {
      try {
        const p = await apiGet(`/api/posts/${slug}`);
        const c = await apiGet(`/api/posts/${slug}/comments`);

        if (ok) {
          setPost(p);
          setComments(c.items || []);
        }
      } finally {
        if (ok) setLoading(false);
      }
    })();

    return () => (ok = false);
  }, [slug]);

  async function submitComment(e) {
    e.preventDefault();
    setMsg("");

    try {
      await apiSend(`/api/posts/${slug}/comments`, "POST", form);
      setMsg("Komenti u dërgua dhe është në pritje aprovimi.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setMsg("Gabim gjatë dërgimit të komentit.");
    }
  }

  if (loading) return <div className="p-8">Loading…</div>;
  if (!post) return <div className="p-8">Post not found</div>;

  return (
    <main>
      <SEO title={post.title_sq} description={post.excerpt_sq} />

      <PageHeader
        kicker={post.category}
        title={post.title_sq}
        subtitle={post.excerpt_sq}
      />

      <Section>
        <Card className="p-6">
          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              className="mb-6 w-full rounded-xl object-cover"
            />
          )}

          <div className="whitespace-pre-wrap text-sm text-zinc-800">
            {post.content_sq}
          </div>
        </Card>
      </Section>

      {/* COMMENTS */}
      <Section title="Komentet">
        <div className="grid gap-4">
          {comments.length === 0 && (
            <div className="text-sm text-zinc-500">Ende nuk ka komente.</div>
          )}

          {comments.map((c) => (
            <Card key={c._id} className="p-4">
              <div className="text-sm font-semibold">{c.name}</div>
              <div className="text-sm text-zinc-600 mt-1">{c.message}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* COMMENT FORM */}
      <Section title="Lëre një koment">
        <Card className="p-6">
          <form onSubmit={submitComment} className="grid gap-3">
            <input
              className="input"
              placeholder="Emri"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              className="textarea"
              placeholder="Komenti"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button className="btn btn-primary">Dërgo</button>

            {msg && <div className="text-sm text-zinc-600">{msg}</div>}
          </form>
        </Card>
      </Section>
    </main>
  );
}
