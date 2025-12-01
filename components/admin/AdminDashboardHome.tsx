"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  Users, 
  Shield, 
  LogOut, 
  Activity,
  TrendingUp,
  Download,
  FileSpreadsheet
} from "lucide-react";

interface Admin {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  lastLogin?: string | null;
  actionsCount?: number;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  companyName?: string | null;
  clientCode: string;
  createdAt: string;
}

export function AdminDashboardHome() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPERADMIN";
  
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isSuperAdmin) {
        const adminsRes = await fetch("/api/admin/admins");
        const adminsData = await adminsRes.json();
        if (adminsRes.ok) {
          setAdmins(adminsData.admins);
        }
      }
      
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      if (usersRes.ok) {
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalActions = admins.reduce((sum, admin) => sum + (admin.actionsCount || 0), 0);
  const activeAdmins = admins.filter(admin => admin.lastLogin).length;
  const [exporting, setExporting] = useState(false);

  const handleExportToExcel = async () => {
    if (!isSuperAdmin) return;
    
    setExporting(true);
    try {
      const response = await fetch("/api/admin/export/excel");
      if (!response.ok) {
        throw new Error("Failed to export");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kls_database_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting:", error);
      alert("Помилка при вигрузці даних. Спробуйте пізніше.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {isSuperAdmin ? "Суперадмін панель" : "Адмін панель"}
              </h1>
              <p className="text-sm text-slate-600">
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Вийти
            </button>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          {isSuperAdmin && (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Всього адмінів</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {loading ? "..." : admins.length}
                    </p>
                  </div>
                  <div className="rounded-full bg-teal-100 p-3">
                    <Shield className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Активні адміни</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {loading ? "..." : activeAdmins}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Всього дій</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {loading ? "..." : totalActions}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Всього користувачів</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {loading ? "..." : users.length}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-black text-slate-900">
            Ласкаво просимо в адмін панель!
          </h2>
          <p className="text-slate-600">
            Використовуйте меню зліва для навігації між розділами.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-2 font-semibold text-slate-900">Користувачі</h3>
              <p className="text-sm text-slate-600">
                Управління користувачами системи, створення нових акаунтів та перегляд списку.
              </p>
            </div>
            {isSuperAdmin && (
              <>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-2 font-semibold text-slate-900">Адміни</h3>
                <p className="text-sm text-slate-600">
                  Управління адміністраторами, створення нових адмінів та перегляд статистики.
                </p>
              </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Вигрузка даних</h3>
                  <p className="mb-3 text-sm text-slate-600">
                    Вигрузка всієї бази даних в Excel файл для резервного копіювання.
                  </p>
                  <button
                    onClick={handleExportToExcel}
                    disabled={exporting}
                    className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exporting ? (
                      <>
                        <Activity className="h-4 w-4 animate-spin" />
                        Вигрузка...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4" />
                        Вигрузити в Excel
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

