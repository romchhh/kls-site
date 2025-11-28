import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UsersManagement } from "@/components/admin/UsersManagement";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role === "SUPERADMIN" || session.user.role === "ADMIN") {
    return <UsersManagement />;
  }

  redirect("/");
}

