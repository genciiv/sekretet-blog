import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { useI18n } from "../i18n/i18n.jsx";

export default function Blog() {
  const { lang } = useI18n();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const title = lang === "en" ? "Articles & Stories" : "Artikuj & Story";
  const subtitle =
    lang === "en"
      ? "Published posts in Albanian and English."
      : "Postime të publikuara në shqip dhe anglisht.";

  async function load(page = 1) {
    try {
      setErr("");
      setLoading(true);
      const qs = new URLSearchParams({ page: String(page), limit: "9" });
      if (q.trim()) qs.set("q", q.trim());
      const data = await apiGet(`/api/posts?${qs.toString()}`);
      setItems(data.items || []);
      setMeta({ page: data.page, pages: data.pages, total: data.total });
    } catch (e) {
      setErr("Nuk u ngarkuan postimet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emptyText = lang === "en" ? "No posts yet." : "S’ka postime ende.";

  const canPrev = meta.page > 1;
  const canNext = meta.page < meta.pages;

  return (
    <main>
      <PageHeader
        kicker="Blog"
        title={title}
        subtitle={subtitle}
        right={
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "en" ? "Search..." : "Kërko..."}
              className="w-56 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-400"
            />
            <button className="btn btn-primary" onClick={() => load(1)}>
              {lang === "en" ? "Search" : "Kërko"}
            </button>
          </div>
        }
      />

      <Section title={lang === "en" ? "Latest" : "Të fundit"} subtitle="">
        {err ? (
          <Card className="p-6">
            <div className="text-sm font-semibold text-zinc-900">Error</div>
            <p className="mt-2 text-sm text-zinc-600">{err}</p>
          </Card>
        ) : null}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="h-4 w-2/3 rounded bg-zinc-100" />
                <div className="mt-3 h-3 w-full rounded bg-zinc-100" />
                <div className="mt-2 h-3 w-5/6 rounded bg-zinc-100" />
                <div className="mt-5 h-28 rounded-xl bg-zinc-50" />
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card className="p-6">
            <p className="text-sm text-zinc-600">{emptyText}</p>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {items.map((p) => {
                const t = lang === "en" ? p.title_en : p.title_sq;
                const ex = lang === "en" ? p.excerpt_en : p.excerpt_sq;
                return (
                  <Card key={p.slug} className="overflow-hidden">
                    <div className="h-40 w-full bg-zinc-50">
                      {p.coverImageUrl ? (
                        <img
                          src={p.coverImageUrl}
                          alt={t}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="badge">{p.category || "General"}</span>
                        {(p.tags || []).slice(0, 2).map((tg) => (
                          <span key={tg} className="badge">
                            {tg}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 text-base font-semibold text-zinc-900 line-clamp-2">
                        {t}
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 line-clamp-3">{ex}</p>

                      <Link
                        to={`/blog/${p.slug}`}
                        className="mt-4 inline-flex text-sm font-semibold text-zinc-900 hover:underline"
                      >
                        {lang === "en" ? "Read →" : "Lexo →"}
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                className={`btn btn-ghost ${!canPrev ? "opacity-50" : ""}`}
                onClick={() => canPrev && load(meta.page - 1)}
                disabled={!canPrev}
              >
                {lang === "en" ? "Prev" : "Para"}
              </button>
              <div className="text-sm text-zinc-600">
                {meta.page} / {meta.pages}
              </div>
              <button
                className={`btn btn-ghost ${!canNext ? "opacity-50" : ""}`}
                onClick={() => canNext && load(meta.page + 1)}
                disabled={!canNext}
              >
                {lang === "en" ? "Next" : "Tjetër"}
              </button>
            </div>
          </>
        )}
      </Section>
    </main>
  );
}
