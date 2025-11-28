import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminsManagement } from "@/components/admin/AdminsManagement";

export default async function AdminsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/admin/login");
  }

  return <AdminsManagement />;
}

