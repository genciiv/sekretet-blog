import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import SEO from "../components/SEO.jsx";
import { apiGet, absUrl } from "../lib/api.js";

export default function Blog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts");
        if (ok) setItems(Array.isArray(data.items) ? data.items : []);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => (ok = false);
  }, []);

  return (
    <main>
      <SEO
        title="Blog"
        description="Artikuj turistikë dhe kulturorë për shtegun Levan–Shtyllas–Apolloni."
        lang="sq"
      />

      <PageHeader
        kicker="Blog"
        title="Artikuj"
        subtitle="Histori, vende dhe këshilla për vizitorët."
      />

      <Section title="" subtitle="">
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const title = (p.title_sq || "").trim();
              const excerpt = (p.excerpt_sq || "").trim();

              return (
                <Card key={p._id || p.slug} className="overflow-hidden p-0">
                  {p.coverImageUrl ? (
                    <img
                      src={absUrl(p.coverImageUrl)}
                      alt={title || "Cover"}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="p-4">
                    <div className="text-xs text-zinc-500">
                      {p.category || "General"}
                    </div>

                    <h3 className="mt-1 text-base font-semibold">
                      {title || "Pa titull"}
                    </h3>

                    <p className="mt-2 text-[13px] text-zinc-600">
                      {excerpt || ""}
                    </p>

                    <div className="mt-4">
                      <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
                        Lexo
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </main>
  );
}
