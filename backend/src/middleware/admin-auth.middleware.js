import prisma from "../config/prisma.js";
import { verifyAdminToken } from "../config/jwt.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success:false, message:"Authentication required." });
    }
    const payload = verifyAdminToken(header.slice(7).trim());
    const admin = await prisma.adminUser.findFirst({
      where: { id: Number(payload.sub), active: true },
      select: { id:true, name:true, email:true, role:true, active:true }
    });
    if (!admin) return res.status(401).json({success:false,message:"Admin account is inactive or does not exist."});
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({success:false,message:"Invalid or expired admin token."});
  }
};