import jwt from "jsonwebtoken";

export const signAdminToken = (admin) => jwt.sign(
  { sub: String(admin.id), email: admin.email, role: admin.role, name: admin.name },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
);

export const verifyAdminToken = (token) => jwt.verify(token, process.env.JWT_SECRET);