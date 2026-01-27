import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import SEO from "../components/SEO.jsx";
import { useI18n } from "../i18n/i18n.jsx";
import { apiGet, absUrl } from "../lib/api.js";

function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function Lightbox({ open, src, alt, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full rounded-2xl border border-white/10 object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <button
        type="button"
        className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
        onClick={onClose}
      >
        Mbyll
      </button>
    </div>
  );
}

export default function PostDetails() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const isSQ = lang === "sq";

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [lbOpen, setLbOpen] = useState(false);
  const [lbSrc, setLbSrc] = useState("");
  const [lbAlt, setLbAlt] = useState("");

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

  const title = useMemo(() => {
    if (!post) return "";
    return isSQ ? post.title_sq || "" : post.title_en || post.title_sq || "";
  }, [post, isSQ]);

  const excerpt = useMemo(() => {
    if (!post) return "";
    return isSQ ? post.excerpt_sq || "" : post.excerpt_en || post.excerpt_sq || "";
  }, [post, isSQ]);

  const content = useMemo(() => {
    if (!post) return "";
    return isSQ ? post.content_sq || "" : post.content_en || post.content_sq || "";
  }, [post, isSQ]);

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

  const metaDesc = (excerpt || "").trim() || stripHtml(content).slice(0, 160);
  const ogImage = post.coverImageUrl ? absUrl(post.coverImageUrl) : "";

  const images = Array.isArray(post.images) ? post.images : [];

  function openLightbox(url, caption) {
    setLbSrc(absUrl(url));
    setLbAlt(caption || title || "image");
    setLbOpen(true);
  }

  return (
    <main>
      <SEO
        title={title}
        description={metaDesc}
        image={ogImage}
        canonical={`/blog/${post.slug}`}
        lang={lang}
      />

      <PageHeader
        kicker={post.category || "Blog"}
        title={title}
        subtitle={excerpt}
      />

      <Section title="" subtitle="">
        <Card className="p-6">
          {/* ✅ Cover (fix: përdor absUrl) */}
          {post.coverImageUrl ? (
            <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-200">
              <img
                src={absUrl(post.coverImageUrl)}
                alt={title}
                className="h-[320px] w-full object-cover"
                loading="lazy"
                onClick={() => openLightbox(post.coverImageUrl, title)}
                style={{ cursor: "zoom-in" }}
              />
            </div>
          ) : null}

          {/* ✅ Galeria e postimit */}
          {images.length ? (
            <div className="mb-6">
              <div className="mb-3 text-sm font-semibold text-zinc-900">
                {isSQ ? "Galeria" : "Gallery"}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img, idx) => (
                  <button
                    key={img.url + idx}
                    type="button"
                    className="group overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 text-left"
                    onClick={() => openLightbox(img.url, img.caption_sq)}
                  >
                    <img
                      src={absUrl(img.url)}
                      alt={img.caption_sq || title}
                      className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    {img.caption_sq ? (
                      <div className="px-3 py-2 text-xs text-zinc-700">
                        {img.caption_sq}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Content */}
          <article className="prose max-w-none">
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

      <Lightbox open={lbOpen} src={lbSrc} alt={lbAlt} onClose={() => setLbOpen(false)} />
    </main>
  );
}
