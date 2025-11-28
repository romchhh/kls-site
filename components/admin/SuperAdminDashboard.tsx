"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  Users, 
  UserPlus, 
  LogOut, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  Loader2,
  Edit,
  Trash2,
  Activity,
  Clock,
  TrendingUp,
  X
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

export function SuperAdminDashboard() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editFormData, setEditFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (res.ok) {
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowAddAdmin(false);
        setFormData({ email: "", password: "", name: "", phone: "" });
        fetchAdmins();
        // Log action
        await fetch("/api/admin/log-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionType: "CREATE_ADMIN",
            targetType: "ADMIN",
            targetId: data.admin?.id,
            description: `Created admin ${formData.email}`,
          }),
        });
      } else {
        setError(data.error || "Помилка створення адміна");
      }
    } catch (error) {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditFormData({
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
      password: "",
    });
    setShowEditModal(true);
    setError("");
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setError("");
    setSubmitting(true);

    try {
      const updateData: any = {
        email: editFormData.email,
        name: editFormData.name,
        phone: editFormData.phone,
      };
      
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const res = await fetch(`/api/admin/admins/${editingAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowEditModal(false);
        setEditingAdmin(null);
        setEditFormData({ email: "", name: "", phone: "", password: "" });
        fetchAdmins();
      } else {
        setError(data.error || "Помилка оновлення адміна");
      }
    } catch (error) {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (adminId: string) => {
    setDeletingAdminId(adminId);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAdminId) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/admins/${deletingAdminId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeletingAdminId(null);
        fetchAdmins();
      } else {
        const data = await res.json();
        setError(data.error || "Помилка видалення адміна");
      }
    } catch (error) {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalActions = admins.reduce((sum, admin) => sum + (admin.actionsCount || 0), 0);
  const activeAdmins = admins.filter(admin => admin.lastLogin).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Суперадмін панель
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
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
        </div>

        {/* Actions */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddAdmin(!showAddAdmin)}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-teal-700 hover:shadow-lg"
          >
            <UserPlus className="h-5 w-5" />
            Додати адміна
          </button>
        </div>

        {/* Add Admin Form */}
        {showAddAdmin && (
          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-black text-slate-900">
              Створити нового адміна
            </h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Ім'я
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Створення...
                    </span>
                  ) : (
                    "Створити адміна"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAdmin(false);
                    setFormData({ email: "", password: "", name: "", phone: "" });
                    setError("");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admins List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-black text-slate-900">Список адмінів</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="px-6 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <Shield className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-slate-900">{admin.name}</p>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                            {admin.role}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {admin.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {admin.phone}
                          </span>
                          {admin.lastLogin && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Останній вхід: {new Date(admin.lastLogin).toLocaleString("uk-UA")}
                            </span>
                          )}
                          {admin.actionsCount !== undefined && (
                            <span className="flex items-center gap-1">
                              <Activity className="h-4 w-4" />
                              Дій: {admin.actionsCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <p className="text-xs text-slate-500">
                          <Calendar className="mr-1 inline h-3 w-3" />
                          {new Date(admin.createdAt).toLocaleDateString("uk-UA")}
                        </p>
                      </div>
                      {admin.id !== session?.user?.id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(admin)}
                            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 hover:border-teal-300"
                            title="Редагувати"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(admin.id)}
                            className="rounded-lg border border-red-300 bg-white p-2 text-red-600 transition-colors hover:bg-red-50"
                            title="Видалити"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Редагувати адміна
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAdmin(null);
                  setEditFormData({ email: "", name: "", phone: "", password: "" });
                  setError("");
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ім'я
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Новий пароль (залиште порожнім, щоб не змінювати)
                </label>
                <input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, password: e.target.value })
                  }
                  minLength={6}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Оновлення...
                    </span>
                  ) : (
                    "Зберегти"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAdmin(null);
                    setEditFormData({ email: "", name: "", phone: "", password: "" });
                    setError("");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAdminId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-black text-slate-900">
              Підтвердження видалення
            </h2>
            <p className="mb-6 text-slate-600">
              Ви впевнені, що хочете видалити цього адміна? Цю дію неможливо скасувати.
            </p>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="flex-1 rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Видалення...
                  </span>
                ) : (
                  "Видалити"
                )}
              </button>
              <button
                onClick={() => {
                  setDeletingAdminId(null);
                  setError("");
                }}
                disabled={submitting}
                className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
