import Home from "../pages/Home";
import Trail from "../pages/Trail";
import Antiquity from "../pages/Antiquity";
import Blog from "../pages/Blog";
import Gallery from "../pages/Gallery";
import Partners from "../pages/Partners";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/trail", element: <Trail /> },
  { path: "/antiquity", element: <Antiquity /> },
  { path: "/blog", element: <Blog /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/partners", element: <Partners /> },
  { path: "/contact", element: <Contact /> },
  { path: "*", element: <NotFound /> },
];
