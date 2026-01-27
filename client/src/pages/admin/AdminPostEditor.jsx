import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiAuthGet, apiAuthSend, apiAuthUpload, absUrl } from "../../lib/api.js";

function Icon({ name }) {
  const cls = "h-5 w-5";
  if (name === "save")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 5h11l3 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M7 5v6h10V8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 21v-6h8v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  if (name === "trash")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M6 7l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  if (name === "upload")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path d="M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M7 9l5-5 5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (name === "eye")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  if (name === "tag")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M20 13l-7 7-11-11V2h7l11 11z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M7 7h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  return null;
}

function Field({ label, hint, children }) {
  return (
    <div className="grid gap-1">
      <div className="flex items-end justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-900">{label}</div>
        {hint ? <div className="text-xs text-zinc-500">{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={[
        "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none",
        "focus:border-zinc-400",
        props.className || "",
      ].join(" ")}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none",
        "focus:border-zinc-400",
        props.className || "",
      ].join(" ")}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={[
        "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none",
        "focus:border-zinc-400",
        props.className || "",
      ].join(" ")}
    />
  );
}

function TagPill({ text, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-800">
      {text}
      <button
        type="button"
        className="rounded-full px-1 text-zinc-500 hover:text-zinc-900"
        onClick={onRemove}
        aria-label="Remove tag"
      >
        ×
      </button>
    </span>
  );
}

const CATEGORY_OPTIONS = [
  "Antikitet",
  "Apollonia",
  "Bylis",
  "Ardenica",
  "Shtegu",
  "Kulture",
  "Historik",
  "Natyrë",
  "Galeri",
  "Lajme",
];

const PLACE_OPTIONS = [
  { key: "", label: "— Pa vend (opsionale) —" },
  { key: "apollonia", label: "Apollonia" },
  { key: "bylis", label: "Bylis" },
  { key: "ardenica", label: "Ardenica" },
];

const PERIOD_OPTIONS = [
  { key: "", label: "— Pa periudhë (opsionale) —" },
  { key: "archaic", label: "Shek. VI p.e.s (archaic)" },
  { key: "hellenistic", label: "Periudha helenistike" },
  { key: "roman", label: "Periudha romake" },
  { key: "medieval", label: "Mesjeta" },
  { key: "modern", label: "Sot" },
];

function normalizeTag(s) {
  return String(s || "").trim();
}

function removeTagPrefix(tags, prefix) {
  return (tags || []).filter((t) => !String(t).toLowerCase().startsWith(prefix.toLowerCase()));
}

function getTagValue(tags, prefix) {
  const t = (tags || []).find((x) => String(x).toLowerCase().startsWith(prefix.toLowerCase()));
  if (!t) return "";
  const parts = String(t).split(":");
  return parts.slice(1).join(":").trim();
}

export default function AdminPostEditor() {
  const nav = useNavigate();
  const { id } = useParams();
  const isNew = !id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [post, setPost] = useState({
    title_sq: "",
    excerpt_sq: "",
    content_sq: "",
    category: "Antikitet",
    tags: [],
    coverImageUrl: "",
    status: "draft",
    slug: "",
    _id: "",
  });

  // Dropdown “lidhjet”
  const [place, setPlace] = useState("");
  const [period, setPeriod] = useState("");
  const [tagInput, setTagInput] = useState("");

  const previewUrl = useMemo(() => (post?.slug ? `/blog/${post.slug}` : ""), [post?.slug]);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setErr("");
        if (isNew) {
          if (ok) {
            setLoading(false);
            // init nga tags (bosh)
            setPlace("");
            setPeriod("");
          }
          return;
        }

        const data = await apiAuthGet(`/api/admin/posts/${id}`);
        if (!ok) return;

        const tags = Array.isArray(data.tags) ? data.tags : [];

        setPost({
          title_sq: data.title_sq || "",
          excerpt_sq: data.excerpt_sq || "",
          content_sq: data.content_sq || "",
          category: data.category || "Antikitet",
          tags,
          coverImageUrl: data.coverImageUrl || "",
          status: data.status || "draft",
          slug: data.slug || "",
          _id: data._id || "",
        });

        setPlace(getTagValue(tags, "place:"));
        setPeriod(getTagValue(tags, "period:"));

        setLoading(false);
      } catch (e) {
        if (ok) {
          setErr(String(e?.message || e));
          setLoading(false);
        }
      }
    })();
    return () => (ok = false);
  }, [id, isNew]);

  function setField(key, value) {
    setPost((p) => ({ ...p, [key]: value }));
  }

  function addTag(raw) {
    const v = normalizeTag(raw);
    if (!v) return;
    setPost((p) => {
      const exists = (p.tags || []).some((t) => String(t).toLowerCase() === v.toLowerCase());
      if (exists) return p;
      return { ...p, tags: [...(p.tags || []), v] };
    });
  }

  function removeTag(t) {
    setPost((p) => ({ ...p, tags: (p.tags || []).filter((x) => x !== t) }));
  }

  function setPlaceTag(nextPlace) {
    const key = String(nextPlace || "").trim().toLowerCase();
    setPlace(key);
    setPost((p) => {
      const base = removeTagPrefix(p.tags || [], "place:");
      if (!key) return { ...p, tags: base };
      return { ...p, tags: [...base, `place:${key}`] };
    });
  }

  function setPeriodTag(nextPeriod) {
    const key = String(nextPeriod || "").trim().toLowerCase();
    setPeriod(key);
    setPost((p) => {
      const base = removeTagPrefix(p.tags || [], "period:");
      if (!key) return { ...p, tags: base };
      return { ...p, tags: [...base, `period:${key}`] };
    });
  }

  async function uploadCover(file) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title_sq", post.title_sq || "cover");
    fd.append("title_en", post.title_sq || "cover");
    fd.append("place", post.category || "");
    fd.append("tags", "cover");
    fd.append("status", "published");

    const created = await apiAuthUpload("/api/admin/media", fd);
    setField("coverImageUrl", created?.url || "");
  }

  function validate() {
    if (!post.title_sq.trim()) return "Titulli është i detyrueshëm.";
    if ((post.excerpt_sq || "").trim().length < 10)
      return "Përshkrimi i shkurtër duhet të ketë të paktën 10 karaktere.";
    if ((post.content_sq || "").trim().length < 30)
      return "Përmbajtja duhet të ketë të paktën 30 karaktere.";
    return "";
  }

  async function save(nextStatus) {
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setSaving(true);
    setErr("");
    try {
      const payload = {
        title_sq: post.title_sq,
        title_en: post.title_sq, // ✅ e mbajmë një-gjuhë
        excerpt_sq: post.excerpt_sq,
        excerpt_en: post.excerpt_sq,
        content_sq: post.content_sq,
        content_en: post.content_sq,
        category: post.category,
        tags: Array.isArray(post.tags) ? post.tags : [],
        coverImageUrl: post.coverImageUrl || "",
        status: nextStatus || post.status || "draft",
      };

      let saved;
      if (isNew) {
        saved = await apiAuthSend("/api/admin/posts", "POST", payload);
        nav(`/admin/posts/${saved._id}`, { replace: true });
      } else {
        saved = await apiAuthSend(`/api/admin/posts/${id}`, "PUT", payload);
      }

      setPost((p) => ({
        ...p,
        slug: saved.slug,
        _id: saved._id,
        status: saved.status,
        publishedAt: saved.publishedAt || p.publishedAt,
      }));
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!post?._id) return;
    const ok = confirm("Je i sigurt që do ta fshish këtë postim?");
    if (!ok) return;

    setSaving(true);
    setErr("");
    try {
      await apiAuthSend(`/api/admin/posts/${post._id}`, "DELETE");
      nav("/admin/posts");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-zinc-600">Loading…</div>;

  return (
    <div className="grid gap-5">
      {/* Top bar */}
      <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              {isNew ? "Krijo Postim" : "Edito Postim"}
            </div>
            <div className="text-xs text-zinc-500">
              Status:{" "}
              <span className="font-medium text-zinc-900">{post.status || "draft"}</span>
              {post?.slug ? (
                <>
                  {" "}
                  • Slug: <span className="font-medium">{post.slug}</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {previewUrl ? (
              <Link
                to={previewUrl}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                target="_blank"
              >
                <Icon name="eye" /> Preview
              </Link>
            ) : null}

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
              disabled={saving}
              onClick={() => save("draft")}
            >
              <Icon name="save" /> Ruaj Draft
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
              disabled={saving}
              onClick={() => save("published")}
            >
              <Icon name="save" /> Publiko
            </button>

            {!isNew ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                disabled={saving}
                onClick={remove}
              >
                <Icon name="trash" /> Fshi
              </button>
            ) : null}
          </div>
        </div>

        {err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}
      </div>

      {/* Form */}
      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        {/* Left */}
        <div className="grid gap-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <div className="text-sm font-semibold text-zinc-900">Përmbajtja (Shqip)</div>
            <div className="mt-4 grid gap-4">
              <Field label="Titulli" hint="duhet">
                <Input
                  value={post.title_sq}
                  onChange={(e) => setField("title_sq", e.target.value)}
                  placeholder="p.sh. Amfiteatri i Apollonisë"
                />
              </Field>

              <Field label="Përshkrim i shkurtër" hint="shfaqet në Blog / Timeline">
                <Textarea
                  rows={3}
                  value={post.excerpt_sq}
                  onChange={(e) => setField("excerpt_sq", e.target.value)}
                  placeholder="2-3 rreshta për listimin…"
                />
              </Field>

              <Field label="Përmbajtja" hint="tekst i thjeshtë (ose HTML)">
                <Textarea
                  rows={14}
                  value={post.content_sq}
                  onChange={(e) => setField("content_sq", e.target.value)}
                  placeholder="Shkruaj artikullin këtu…"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <div className="text-sm font-semibold text-zinc-900">
              <span className="inline-flex items-center gap-2">
                <Icon name="tag" /> Lidhje me Antikitet / Harta / Timeline
              </span>
            </div>

            <div className="mt-4 grid gap-4">
              <Field label="Vend (place:*)" hint="për kartat e Antikitetit + marker-at në hartë">
                <Select value={place} onChange={(e) => setPlaceTag(e.target.value)}>
                  {PLACE_OPTIONS.map((x) => (
                    <option key={x.key} value={x.key}>
                      {x.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Periudha (period:*)" hint="për filtrin Timeline">
                <Select value={period} onChange={(e) => setPeriodTag(e.target.value)}>
                  {PERIOD_OPTIONS.map((x) => (
                    <option key={x.key} value={x.key}>
                      {x.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-600">
                <div className="font-semibold text-zinc-900">Si funksionon</div>
                <div className="mt-1">
                  Kur zgjedh Vend/Periudhë, ky editor vendos automatikisht tags:
                  <div className="mt-2 grid gap-1">
                    <div>• <span className="font-semibold">place:apollonia</span> / bylis / ardenica</div>
                    <div>• <span className="font-semibold">period:roman</span> / archaic / hellenistic / medieval / modern</div>
                  </div>
                  Këto përdoren nga faqja “Antikiteti” dhe “Timeline”.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="grid gap-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <div className="text-sm font-semibold text-zinc-900">Settings</div>

            <div className="mt-4 grid gap-4">
              <Field label="Category" hint="shfaqet si label në listime">
                <Select value={post.category} onChange={(e) => setField("category", e.target.value)}>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Status">
                <Select value={post.status} onChange={(e) => setField("status", e.target.value)}>
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </Select>
              </Field>

              <Field label="Tags shtesë" hint="p.sh: featured, beach, museum (opsionale)">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Shkruaj tag dhe Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(tagInput);
                        setTagInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-xl border border-zinc-200 px-3 text-sm font-semibold hover:bg-zinc-100"
                    onClick={() => {
                      addTag(tagInput);
                      setTagInput("");
                    }}
                  >
                    +
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(post.tags || []).map((t) => (
                    <TagPill key={t} text={t} onRemove={() => removeTag(t)} />
                  ))}
                </div>
              </Field>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <div className="text-sm font-semibold text-zinc-900">Cover</div>

            <div className="mt-4 grid gap-3">
              {post.coverImageUrl ? (
                <div className="overflow-hidden rounded-2xl border border-zinc-200">
                  <img src={absUrl(post.coverImageUrl)} alt="cover" className="h-44 w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
                  No cover image
                </div>
              )}

              <Field label="Cover URL (opsionale)">
                <Input
                  value={post.coverImageUrl}
                  onChange={(e) => setField("coverImageUrl", e.target.value)}
                  placeholder="/uploads/xxx.jpg ose https://…"
                />
              </Field>

              <div className="flex items-center justify-between gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold hover:bg-zinc-100">
                  <Icon name="upload" />
                  Upload cover
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        setErr("");
                        await uploadCover(f);
                      } catch (ex) {
                        setErr(String(ex?.message || ex));
                      } finally {
                        e.target.value = "";
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold hover:bg-zinc-100"
                  onClick={() => setField("coverImageUrl", "")}
                >
                  Hiq
                </button>
              </div>

              <Link to="/admin/posts" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
                ← Kthehu te lista e postimeve
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
