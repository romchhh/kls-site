import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetSuperAdminPassword() {
  const email = "superadmin@gmail.com";
  const password = "superadmin";

  try {
    // Find superadmin by email
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (!existing) {
      console.log("❌ Користувач з таким email не знайдено!");
      console.log("Створюємо нового superadmin...");
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const superAdmin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "Super Admin",
          phone: "+380000000000",
          role: "SUPERADMIN",
          clientCode: "SUP1",
        },
      });

      console.log("\n✅ Суперадмін успішно створено!");
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Пароль: ${password}`);
      console.log(`   Роль: ${superAdmin.role}`);
    } else {
      console.log(`✅ Знайдено користувача: ${existing.email}`);
      console.log(`   Поточна роль: ${existing.role}`);
      
      // Update password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          password: hashedPassword,
          role: "SUPERADMIN", // Ensure role is SUPERADMIN
        },
      });

      console.log("\n✅ Пароль успішно оновлено!");
      console.log(`   Email: ${existing.email}`);
      console.log(`   Новий пароль: ${password}`);
      console.log(`   Роль: SUPERADMIN`);
    }

    console.log(`\n🔑 Ви можете увійти на /admin/login`);
    console.log(`   Email: ${email}`);
    console.log(`   Пароль: ${password}\n`);
  } catch (error: any) {
    console.log("❌ Помилка:", error.message);
    if (error.code === "P2002") {
      console.log("❌ Користувач з таким email вже існує!");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetSuperAdminPassword();

