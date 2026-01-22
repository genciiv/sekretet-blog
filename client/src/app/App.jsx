import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <div className="min-h-[60vh]">
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
