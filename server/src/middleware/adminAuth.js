import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.isAdmin)
      return res.status(403).json({ message: "Forbidden" });
    req.admin = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
