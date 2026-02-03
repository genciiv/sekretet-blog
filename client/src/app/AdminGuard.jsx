// FILE: client/src/app/AdminGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasAdminToken } from "../lib/api.js";

export default function AdminGuard() {
  const loc = useLocation();
  const ok = hasAdminToken();

  if (!ok) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }

  return <Outlet />;
}
