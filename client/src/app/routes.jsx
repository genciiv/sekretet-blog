import Home from "../pages/Home";
import Trail from "../pages/Trail";
import Antiquity from "../pages/Antiquity";
import Blog from "../pages/Blog";
import Gallery from "../pages/Gallery";
import Partners from "../pages/Partners";
import Contact from "../pages/Contact";
import PostDetails from "../pages/PostDetails";
import VerifyEmail from "../pages/VerifyEmail";
import NotFound from "../pages/NotFound";

import AdminLayout from "../pages/admin/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminPosts from "../pages/admin/AdminPosts";
import AdminPostEditor from "../pages/admin/AdminPostEditor";
import AdminComments from "../pages/admin/AdminComments";
import AdminGallery from "../pages/admin/AdminGallery";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/trail", element: <Trail /> },
  { path: "/antiquity", element: <Antiquity /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <PostDetails /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/partners", element: <Partners /> },
  { path: "/contact", element: <Contact /> },

  { path: "/admin/login", element: <AdminLogin /> },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPosts /> },
      { path: "posts", element: <AdminPosts /> },
      { path: "posts/:id", element: <AdminPostEditor /> },
      { path: "comments", element: <AdminComments /> },
      { path: "gallery", element: <AdminGallery /> },
    ],
  },

  { path: "*", element: <NotFound /> },
];
