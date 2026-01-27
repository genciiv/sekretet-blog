import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  apiAuthGet,
  apiAuthSend,
  apiAuthUpload,
  absUrl,
} from "../../lib/api.js";

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
        <path
          d="M4 7h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 11v6M14 11v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
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
        <path
          d="M12 16V4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M7 9l5-5 5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 20h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
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
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
          stroke="currentColor"
          strokeWidth="2"
        />
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

export default function AdminPostEditor() {
  const nav = useNavigate();
  const { id } = useParams();

  const isNew = !id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [post, setPost] = useState({
    title_sq: "",
    title_en: "",
    excerpt_sq: "",
    excerpt_en: "",
    content_sq: "",
    content_en: "",
    category: "Antikitet",
    tags: [],
    coverImageUrl: "",
    status: "draft",
  });

  const [tagInput, setTagInput] = useState("");

  const previewUrl = useMemo(() => {
    // preview funksionon vetëm kur ka slug (pas save/create)
    return post?.slug ? `/blog/${post.slug}` : "";
  }, [post?.slug]);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setErr("");
        if (isNew) {
          if (ok) setLoading(false);
          return;
        }
        const data = await apiAuthGet(`/api/admin/posts/${id}`);
        if (ok) {
          setPost({
            title_sq: data.title_sq || "",
            title_en: data.title_en || "",
            excerpt_sq: data.excerpt_sq || "",
            excerpt_en: data.excerpt_en || "",
            content_sq: data.content_sq || "",
            content_en: data.content_en || "",
            category: data.category || "Antikitet",
            tags: Array.isArray(data.tags) ? data.tags : [],
            coverImageUrl: data.coverImageUrl || "",
            status: data.status || "draft",
            slug: data.slug,
            _id: data._id,
          });
          setLoading(false);
        }
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
    const v = String(raw || "").trim();
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

  async function uploadCover(file) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title_sq", post.title_sq || "cover");
    fd.append("title_en", post.title_en || post.title_sq || "cover");
    fd.append("place", post.category || "");
    fd.append("tags", "cover");
    fd.append("status", "published");

    const created = await apiAuthUpload("/api/admin/media", fd);
    // created.url = "/uploads/..."
    setField("coverImageUrl", created?.url || "");
  }

  function validate() {
    if (!post.title_sq.trim()) return "Titulli (SQ) është i detyrueshëm.";
    // EN mund të jetë bosh (do e mbushim automatik)
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
        ...post,
        // fallback logjik: nëse s’ke EN, përdor SQ
        title_en: post.title_en?.trim() ? post.title_en : post.title_sq,
        excerpt_en: post.excerpt_en?.trim() ? post.excerpt_en : post.excerpt_sq,
        content_en: post.content_en?.trim() ? post.content_en : post.content_sq,
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

  if (loading) {
    return <div className="text-sm text-zinc-600">Loading…</div>;
  }

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
              <span className="font-medium text-zinc-900">
                {post.status || "draft"}
              </span>
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
              <Icon name="save" /> Save Draft
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
              disabled={saving}
              onClick={() => save("published")}
            >
              <Icon name="save" /> Publish
            </button>

            {!isNew ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                disabled={saving}
                onClick={remove}
              >
                <Icon name="trash" /> Delete
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
      <div className="grid gap-4 md:grid-cols-[1fr_340px]">
        {/* Left */}
        <div className="grid gap-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <div className="text-sm font-semibold text-zinc-900">SQ</div>
            <div className="mt-4 grid gap-4">
              <Field label="Titulli (SQ)" hint="duhet">
                <Input
                  value={post.title_sq}
                  onChange={(e) => setField("title_sq", e.target.value)}
                  placeholder="p.sh. Amfiteatri i Apollonisë"
                />
              </Field>

              <Field label="Përshkrim i shkurtër (SQ)">
                <Textarea
                  rows={3}
                  value={post.excerpt_sq}
                  onChange={(e) => setField("excerpt_sq", e.target.value)}
                  placeholder="2-3 rreshta për listimin e blogut…"
                />
              </Field>

              <Field label="Përmbajtja (SQ)" hint="HTML ose tekst i thjeshtë">
                <Textarea
                  rows={12}
                  value={post.content_sq}
                  onChange={(e) => setField("content_sq", e.target.value)}
                  placeholder="Shkruaj artikullin këtu…"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <div className="text-sm font-semibold text-zinc-900">EN</div>
            <div className="mt-4 grid gap-4">
              <Field label="Title (EN)" hint="opsionale (nëse bosh → merret nga SQ)">
                <Input
                  value={post.title_en}
                  onChange={(e) => setField("title_en", e.target.value)}
                  placeholder="Optional"
                />
              </Field>

              <Field label="Excerpt (EN)" hint="opsionale">
                <Textarea
                  rows={3}
                  value={post.excerpt_en}
                  onChange={(e) => setField("excerpt_en", e.target.value)}
                  placeholder="Optional"
                />
              </Field>

              <Field label="Content (EN)" hint="opsionale">
                <Textarea
                  rows={10}
                  value={post.content_en}
                  onChange={(e) => setField("content_en", e.target.value)}
                  placeholder="Optional"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="grid gap-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5">
            <div className="text-sm font-semibold text-zinc-900">
              Settings
            </div>

            <div className="mt-4 grid gap-4">
              <Field label="Category">
                <Select
                  value={post.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={post.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </Select>
              </Field>

              <Field label="Tags" hint="p.sh: place:apollonia, period:roman">
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
                  <img
                    src={absUrl(post.coverImageUrl)}
                    alt="cover"
                    className="h-44 w-full object-cover"
                  />
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
                  Remove
                </button>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-600">
                <div className="font-semibold text-zinc-900">Këshillë</div>
                <div className="mt-1">
                  Për lidhje me hartë/timeline përdor tags si:
                  <div className="mt-2 grid gap-1">
                    <div>• <span className="font-semibold">place:apollonia</span></div>
                    <div>• <span className="font-semibold">place:bylis</span></div>
                    <div>• <span className="font-semibold">place:ardenica</span></div>
                    <div>• <span className="font-semibold">period:archaic</span> / hellenistic / roman / medieval / modern</div>
                  </div>
                </div>
              </div>

              <Link
                to="/admin/posts"
                className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
              >
                ← Back to posts list
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
