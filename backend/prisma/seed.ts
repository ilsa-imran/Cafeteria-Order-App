import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const staffPasswordHash = await bcrypt.hash("staff12345", 10);
  const adminPasswordHash = await bcrypt.hash("admin12345", 10);
  const studentPasswordHash = await bcrypt.hash("student12345", 10);

  await prisma.user.upsert({
    where: { email: "staff@cafeteria.test" },
    update: {},
    create: {
      name: "Cafeteria Staff",
      email: "staff@cafeteria.test",
      passwordHash: staffPasswordHash,
      role: "STAFF",
    },
  });

  await prisma.user.upsert({
    where: { email: "manager@cafeteria.test" },
    update: {},
    create: {
      name: "Cafeteria Manager",
      email: "manager@cafeteria.test",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "student@university.test" },
    update: {},
    create: {
      name: "Sample Student",
      email: "student@university.test",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
  });

  const menuItems = [
    { name: "Chicken Biryani", price: 250, available: true },
    { name: "Beef Burger", price: 300, available: true },
    { name: "Club Sandwich", price: 220, available: false },
    { name: "Fresh Juice", price: 120, available: true },
    { name: "Matcha Chiller", price: 180, available: true },
    { name: "Cherry Tart", price: 200, available: true },
    { name: "Blueberry Shake", price: 220, available: true },
    { name: "Loaded Tater Tots", price: 150, available: true },
    { name: "Chicken Shawarma Bowl", price: 320, available: true },
    { name: "Creamy Cajun Alfredo", price: 280, available: true },
  ];

  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.menuItem.create({ data: item });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
