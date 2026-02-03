// FILE: client/src/app/AdminGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasAdminToken } from "../lib/api.js";

export default function AdminGuard({ children }) {
  const loc = useLocation();
  const ok = hasAdminToken();

  // ✅ Nëse s’je logged in -> shko te /admin/login
  if (!ok) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: loc.pathname + loc.search }}
      />
    );
  }

  // ✅ Nëse përdoret si wrapper: <AdminGuard>...</AdminGuard>
  if (children) return children;

  // ✅ Nëse përdoret si Route element me children: kthen Outlet
  return <Outlet />;
}
