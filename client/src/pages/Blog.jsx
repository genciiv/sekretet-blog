import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import SEO from "../components/SEO.jsx";
import { useI18n } from "../i18n/i18n.jsx";
import { apiGet } from "../lib/api.js";

export default function Blog() {
  const { isSQ } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts");
        if (ok) setItems(data.items || []);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => (ok = false);
  }, []);

  return (
    <main>
      <SEO
        title={isSQ ? "Blog" : "Blog"}
        description={
          isSQ
            ? "Artikuj turistikë dhe kulturorë për shtegun Levan–Shtyllas–Apolloni."
            : "Touristic and cultural posts for the Levan–Shtyllas–Apollonia trail."
        }
      />

      <PageHeader
        kicker={isSQ ? "Blog" : "Blog"}
        title={isSQ ? "Artikuj" : "Posts"}
        subtitle={
          isSQ
            ? "Histori, vende dhe këshilla për vizitorët."
            : "Stories, places, and tips for visitors."
        }
      />

      <Section title="" subtitle="">
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((p) => (
              <Card key={p._id} className="p-5">
                <div className="text-xs text-zinc-500">
                  {p.category || "General"}
                </div>
                <h3 className="mt-1 text-lg font-semibold">
                  {isSQ
                    ? p.title_sq || "Pa titull"
                    : p.title_en || p.title_sq || "Untitled"}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">
                  {isSQ
                    ? p.excerpt_sq || ""
                    : p.excerpt_en || p.excerpt_sq || ""}
                </p>
                <div className="mt-4">
                  <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
                    {isSQ ? "Lexo" : "Read"}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
