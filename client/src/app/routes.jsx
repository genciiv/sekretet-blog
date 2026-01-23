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

// admin
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import AdminPosts from "../pages/admin/AdminPosts.jsx";
import AdminPostEditor from "../pages/admin/AdminPostEditor.jsx";
import AdminComments from "../pages/admin/AdminComments.jsx";
import AdminGallery from "../pages/admin/AdminGallery.jsx";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/trail", element: <Trail /> },
  { path: "/antiquity", element: <Antiquity /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <PostDetails /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/partners", element: <Partners /> },
  { path: "/contact", element: <Contact /> },
  { path: "/map", element: <MapPage /> },
  { path: "/verify-email", element: <VerifyEmail /> },

  // admin
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin", element: <AdminLayout /> },
  {
    path: "/admin/posts",
    element: (
      <AdminLayout>
        <AdminPosts />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/posts/new",
    element: (
      <AdminLayout>
        <AdminPostEditor />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/posts/:id",
    element: (
      <AdminLayout>
        <AdminPostEditor />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/comments",
    element: (
      <AdminLayout>
        <AdminComments />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/gallery",
    element: (
      <AdminLayout>
        <AdminGallery />
      </AdminLayout>
    ),
  },

  { path: "*", element: <NotFound /> },
];
