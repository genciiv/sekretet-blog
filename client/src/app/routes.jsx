// FILE: client/src/app/routes.jsx
import Home from "../pages/Home.jsx";
import Trail from "../pages/Trail.jsx";
import Antiquity from "../pages/Antiquity.jsx";
import Blog from "../pages/Blog.jsx";
import Gallery from "../pages/Gallery.jsx";
import Partners from "../pages/Partners.jsx";
import Contact from "../pages/Contact.jsx";
import PostDetails from "../pages/PostDetails.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import NotFound from "../pages/NotFound.jsx";
import MapPage from "../pages/Map.jsx";
import About from "../pages/About.jsx";


// admin
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import AdminPosts from "../pages/admin/AdminPosts.jsx";
import AdminPostEditor from "../pages/admin/AdminPostEditor.jsx";
import AdminComments from "../pages/admin/AdminComments.jsx";
import AdminGallery from "../pages/admin/AdminGallery.jsx";
import AdminContacts from "../pages/admin/AdminContacts.jsx";

// ✅ GUARD (saktë, sepse file është te src/app/)
import AdminGuard from "./AdminGuard.jsx";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/trail", element: <Trail /> },
  { path: "/antiquity", element: <Antiquity /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <PostDetails /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/about", element: <About /> },

  { path: "/partners", element: <Partners /> },
  { path: "/contact", element: <Contact /> },
  { path: "/map", element: <MapPage /> },
  { path: "/verify-email", element: <VerifyEmail /> },

  // ✅ admin login (pa guard)
  { path: "/admin/login", element: <AdminLogin /> },

  // ✅ admin area (me guard)
  {
    path: "/admin",
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { path: "posts", element: <AdminPosts /> },
      { path: "posts/new", element: <AdminPostEditor /> },
      { path: "posts/:id", element: <AdminPostEditor /> },
      { path: "comments", element: <AdminComments /> },
      { path: "gallery", element: <AdminGallery /> },
      { path: "contacts", element: <AdminContacts /> },
    ],
  },

  { path: "*", element: <NotFound /> },
];
