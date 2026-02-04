// FILE: client/src/pages/PostDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";
import { apiGet, absUrl } from "../lib/api.js";

export default function PostDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ok = true;

    (async () => {
      try {
        setErr("");
        setPost(null);
        const data = await apiGet(`/api/posts/${slug}`);
        if (ok) setPost(data);
      } catch (e) {
        if (ok) setErr("Post not found");
      }
    })();

    return () => {
      ok = false;
    };
  }, [slug]);

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
    </main>
  );
}
