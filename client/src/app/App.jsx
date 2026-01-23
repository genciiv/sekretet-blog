import { Routes, Route, useLocation } from "react-router-dom";
import { routes } from "./routes";
import Header from "../components/Header";
import Footer from "../components/Footer";

function renderRoutes(routeList) {
  return routeList.map((r) => {
    const hasChildren = Array.isArray(r.children) && r.children.length > 0;

    return (
      <Route key={r.path || "index"} path={r.path} element={r.element}>
        {hasChildren ? renderRoutes(r.children) : null}
      </Route>
    );
  });
}

export default function App() {
  const { pathname } = useLocation();

  // Mos shfaq Header/Footer në admin
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {!isAdmin && <Header />}

      <div className={!isAdmin ? "min-h-[60vh]" : ""}>
        <Routes>{renderRoutes(routes)}</Routes>
      </div>

      {!isAdmin && <Footer />}
    </div>
  );
}
