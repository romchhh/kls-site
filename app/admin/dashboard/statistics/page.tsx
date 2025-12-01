import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Statistics } from "@/components/admin/Statistics";

export default async function StatisticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <Statistics />;
}

