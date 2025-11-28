import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminDashboardHome } from "@/components/admin/AdminDashboardHome";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role === "SUPERADMIN" || session.user.role === "ADMIN") {
    return <AdminDashboardHome />;
  }

  redirect("/");
}
