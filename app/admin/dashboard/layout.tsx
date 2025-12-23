"use client";

import { useSession } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-segoe">
      <AdminSidebar isSuperAdmin={isSuperAdmin} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

