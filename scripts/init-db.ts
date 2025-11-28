import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createSuperAdmin() {
  console.log("\n=== Створення суперадміна ===\n");

  const email = await question("Email суперадміна: ");
  const password = await question("Пароль суперадміна: ");
  const name = await question("Ім'я суперадміна: ");
  const phone = await question("Телефон суперадміна: ");

  if (!email || !password || !name || !phone) {
    console.log("❌ Всі поля обов'язкові!");
    rl.close();
    process.exit(1);
  }

  if (password.length < 6) {
    console.log("❌ Пароль повинен містити мінімум 6 символів!");
    rl.close();
    process.exit(1);
  }

  try {
    // Check if superadmin already exists
    const existing = await prisma.user.findFirst({
      where: { role: "SUPERADMIN" },
    });

    if (existing) {
      console.log("\n⚠️  Суперадмін вже існує!");
      const overwrite = await question("Перезаписати? (y/n): ");
      if (overwrite.toLowerCase() !== "y") {
        console.log("Скасовано.");
        rl.close();
        process.exit(0);
      }
      await prisma.user.delete({ where: { id: existing.id } });
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
    console.log(`   Ім'я: ${superAdmin.name}`);
    console.log(`   Роль: ${superAdmin.role}`);
    console.log(`\n🔑 Ви можете увійти на /admin/login\n`);
  } catch (error: any) {
    if (error.code === "P2002") {
      console.log("❌ Користувач з таким email вже існує!");
    } else {
      console.log("❌ Помилка:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createSuperAdmin();

