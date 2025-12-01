import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiTokens } from "@/components/admin/ApiTokens";

export default async function ApiTokensPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <ApiTokens />;
}

