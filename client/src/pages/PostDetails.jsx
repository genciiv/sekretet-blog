import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import { apiGet } from "../lib/api";
import { useI18n } from "../i18n/i18n.jsx";
import CommentsSection from "../components/Comments/CommentsSection";

export default function PostDetails() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setErr("");
        setLoading(true);
        const data = await apiGet(`/api/posts/${slug}`);
        setPost(data);
      } catch (e) {
        setErr(lang === "en" ? "Post not found." : "Postimi nuk u gjet.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, lang]);

  if (loading) {
    return (
      <main>
        <PageHeader kicker="Blog" title="..." subtitle="" />
        <Section title="" subtitle="">
          <Card className="p-6">
            <div className="h-4 w-2/3 rounded bg-zinc-100" />
            <div className="mt-3 h-3 w-full rounded bg-zinc-100" />
            <div className="mt-2 h-3 w-5/6 rounded bg-zinc-100" />
            <div className="mt-6 h-56 rounded-2xl bg-zinc-50" />
          </Card>
        </Section>
      </main>
    );
  }

  if (err || !post) {
    return (
      <main>
        <PageHeader kicker="Blog" title="404" subtitle={err || "Not found"} />
        <Section title="" subtitle="">
          <Link className="btn btn-ghost" to="/blog">
            ← {lang === "en" ? "Back to Blog" : "Kthehu te Blog"}
          </Link>
        </Section>
      </main>
    );
  }

  const title = lang === "en" ? post.title_en : post.title_sq;
  const excerpt = lang === "en" ? post.excerpt_en : post.excerpt_sq;
  const content = lang === "en" ? post.content_en : post.content_sq;

  return (
    <main>
      <PageHeader kicker={post.category || "Blog"} title={title} subtitle={excerpt} />

      <Section title="" subtitle="">
        <div className="mb-6">
          <Link className="btn btn-ghost" to="/blog">
            ← {lang === "en" ? "Back to Blog" : "Kthehu te Blog"}
          </Link>
        </div>

        <Card className="overflow-hidden">
          {post.coverImageUrl ? (
            <div className="h-72 w-full bg-zinc-50">
              <img src={post.coverImageUrl} alt={title} className="h-full w-full object-cover" />
            </div>
          ) : null}

          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map((tg) => (
                <span className="badge" key={tg}>
                  {tg}
                </span>
              ))}
            </div>

            <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-zinc-800">
              {content || (lang === "en" ? "Content coming soon." : "Përmbajtja do shtohet më vonë.")}
            </div>
          </div>
        </Card>

        <div className="mt-10">
          <CommentsSection postSlug={post.slug} />
        </div>
      </Section>
    </main>
  );
}
