import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@savarcf.com" },
    update: {},
    create: {
      name: "Savar CF Admin",
      email: "admin@savarcf.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());