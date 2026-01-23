import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import SEO from "../components/SEO.jsx";
import { useI18n } from "../i18n/i18n.jsx";
import { apiGet } from "../lib/api.js";

function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function PostDetails() {
  const { slug } = useParams();
  const { isSQ } = useI18n();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <SEO title="Not found" description="Post not found" noindex />
        <div className="text-sm text-zinc-600">Not found.</div>
      </main>
    );
  }

  const title = isSQ
    ? post.title_sq || ""
    : post.title_en || post.title_sq || "";
  const excerpt = isSQ
    ? post.excerpt_sq || ""
    : post.excerpt_en || post.excerpt_sq || "";
  const content = isSQ
    ? post.content_sq || ""
    : post.content_en || post.content_sq || "";

  const metaDesc = excerpt?.trim() || stripHtml(content).slice(0, 160);

  // Nëse ti ruan coverImageUrl te post, e përdorim për OG
  const ogImage = post.coverImageUrl || "/og-default.jpg";

  return (
    <main>
      <SEO
        title={title}
        description={metaDesc}
        image={ogImage}
        canonical={`/blog/${post.slug}`}
      />

      <PageHeader
        kicker={post.category || (isSQ ? "Blog" : "Blog")}
        title={title}
        subtitle={excerpt}
      />

      <Section title="" subtitle="">
        <Card className="p-6">
          {/* Cover image optional */}
          {post.coverImageUrl ? (
            <img
              src={post.coverImageUrl}
              alt={title}
              className="mb-6 w-full rounded-2xl border border-zinc-200 object-cover"
            />
          ) : null}

          {/* Content */}
          <article className="prose max-w-none">
            {/* Nëse ruan HTML, mund ta përdorësh dangerouslySetInnerHTML.
                Për tani po e shfaqim si text. */}
            <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-800">
              {stripHtml(content)
                ? content
                : isSQ
                  ? "S’ka përmbajtje."
                  : "No content."}
            </div>
          </article>
        </Card>
      </Section>

      {/* Komentet i ke veç. Nuk i prekim këtu. */}
    </main>
  );
}
