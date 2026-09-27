import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.js";

async function main(){
  const email=process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password=process.env.ADMIN_PASSWORD;
  const name=process.env.ADMIN_NAME||"Revital Yoga Admin";
  if(!email||!password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  if(password.length<8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  const passwordHash=await bcrypt.hash(password,12);
  await prisma.adminUser.upsert({
    where:{email},
    update:{name,passwordHash,active:true},
    create:{name,email,passwordHash,role:"ADMIN",active:true}
  });
  console.log(`Admin account ready: ${email}`);
}
main().catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());