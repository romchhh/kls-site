import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createSuperAdmin() {
  // Для production використовуйте init-db.ts з інтерактивним вводом
  // Цей скрипт для швидкого створення тестового суперадміна
  const email = process.env.SUPERADMIN_EMAIL || "superadmin@gmail.com";
  const password = process.env.SUPERADMIN_PASSWORD || "superadmin";
  const name = process.env.SUPERADMIN_NAME || "Super Admin";
  const phone = process.env.SUPERADMIN_PHONE || "+380000000000";

  try {
    // Check if superadmin already exists
    const existing = await prisma.user.findFirst({
      where: { role: "SUPERADMIN" },
    });

    if (existing) {
      console.log("⚠️  Суперадмін вже існує!");
      console.log(`   Email: ${existing.email}`);
      await prisma.$disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: "SUPERADMIN",
        clientCode: "SUP1",
      },
    });

    console.log("\n✅ Суперадмін успішно створено!");
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Пароль: ${password}`);
    console.log(`   Ім'я: ${superAdmin.name}`);
    console.log(`   Роль: ${superAdmin.role}`);
    console.log(`\n🔑 Ви можете увійти на http://localhost:3000/admin/login\n`);
  } catch (error: any) {
    if (error.code === "P2002") {
      console.log("❌ Користувач з таким email вже існує!");
    } else {
      console.log("❌ Помилка:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();

