import { useEffect, useMemo, useState } from "react";
import { apiAuthGet, apiAuthSend } from "../../lib/api.js";

function Icon({ name }) {
  const cls = "h-5 w-5";
  if (name === "check")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (name === "x")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M18 6L6 18M6 6l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  if (name === "clock")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 6v6l4 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (name === "refresh")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M20 12a8 8 0 1 1-2.34-5.66"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 4v6h-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return null;
}

function Badge({ status }) {
  const s = String(status || "pending").toLowerCase();
  const base =
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold";
  if (s === "approved")
    return (
      <span
        className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}
      >
        <Icon name="check" /> approved
      </span>
    );
  if (s === "rejected")
    return (
      <span className={`${base} border-red-200 bg-red-50 text-red-700`}>
        <Icon name="x" /> rejected
      </span>
    );
  return (
    <span className={`${base} border-amber-200 bg-amber-50 text-amber-700`}>
      <Icon name="clock" /> pending
    </span>
  );
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso || "";
  }
}

export default function AdminComments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filter: pending / approved / rejected / all
  const [filter, setFilter] = useState("pending");

  // për “disable” gjatë actions
  const [busyId, setBusyId] = useState("");

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((x) => x.status === "pending").length;
    const approved = items.filter((x) => x.status === "approved").length;
    const rejected = items.filter((x) => x.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [items]);

  async function fetchComments(nextFilter = filter) {
    setLoading(true);
    setErr("");
    try {
      const q =
        nextFilter && nextFilter !== "all" ? `?status=${nextFilter}` : "";
      const data = await apiAuthGet(`/api/admin/comments${q}`);
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComments(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function setStatus(id, status) {
    if (!id) return;
    setBusyId(id);
    setErr("");
    try {
      await apiAuthSend(`/api/admin/comments/${id}`, "PATCH", { status });

      // ✅ RIFRESKO LISTËN (LIVE)
      await fetchComments(filter);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Komentet</div>
            <div className="mt-1 text-xs text-zinc-500">
              Total:{" "}
              <span className="font-semibold text-zinc-900">{stats.total}</span>{" "}
              • Pending:{" "}
              <span className="font-semibold text-zinc-900">
                {stats.pending}
              </span>{" "}
              • Approved:{" "}
              <span className="font-semibold text-zinc-900">
                {stats.approved}
              </span>{" "}
              • Rejected:{" "}
              <span className="font-semibold text-zinc-900">
                {stats.rejected}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="all">all</option>
            </select>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold hover:bg-zinc-100"
              onClick={() => fetchComments(filter)}
              disabled={loading}
            >
              <Icon name="refresh" /> Rifresko
            </button>
          </div>
        </div>

        {err ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}
      </div>

      {/* List */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-600">
            S’ka komente për këtë filter.
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((c) => {
              const disabled = busyId === c._id;

              return (
                <div
                  key={c._id}
                  className="rounded-2xl border border-zinc-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-[240px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-zinc-900">
                          {c.name || "Anonim"}
                        </div>
                        <Badge status={c.status} />
                      </div>

                      <div className="mt-1 text-xs text-zinc-500">
                        {c.email ? <span>{c.email}</span> : null}
                        {c.email ? " • " : ""}
                        {c.createdAt ? (
                          <span>{formatDate(c.createdAt)}</span>
                        ) : null}
                      </div>

                      {c.slug ? (
                        <div className="mt-1 text-xs text-zinc-500">
                          Post:{" "}
                          <span className="font-medium text-zinc-700">
                            {c.slug}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
                        onClick={() => setStatus(c._id, "approved")}
                        disabled={disabled}
                      >
                        <Icon name="check" /> Approve
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-100 disabled:opacity-60"
                        onClick={() => setStatus(c._id, "rejected")}
                        disabled={disabled}
                      >
                        <Icon name="x" /> Reject
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 disabled:opacity-60"
                        onClick={() => setStatus(c._id, "pending")}
                        disabled={disabled}
                      >
                        <Icon name="clock" /> Pending
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">
                    {c.message || ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
