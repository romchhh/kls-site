"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Shield, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  Loader2,
  Edit,
  Trash2,
  Activity,
  Clock,
  X
} from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

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

export function AdminsManagement() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editAdminFormData, setEditAdminFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
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

    if (adminFormData.password !== adminFormData.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    if (adminFormData.password.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminFormData.email,
          password: adminFormData.password,
          name: adminFormData.name,
          phone: adminFormData.phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowAddAdmin(false);
        setAdminFormData({ 
          email: "", 
          password: "", 
          confirmPassword: "",
          name: "", 
          phone: "" 
        });
        fetchAdmins();
        await fetch("/api/admin/log-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionType: "CREATE_ADMIN",
            targetType: "ADMIN",
            targetId: data.admin?.id,
            description: `Created admin ${adminFormData.email}`,
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

  const handleEditAdminClick = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditAdminFormData({
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
      password: "",
      confirmPassword: "",
    });
    setShowEditAdminModal(true);
    setError("");
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setError("");

    if (editAdminFormData.password) {
      if (editAdminFormData.password !== editAdminFormData.confirmPassword) {
        setError("Паролі не співпадають");
        return;
      }
      if (editAdminFormData.password.length < 6) {
        setError("Пароль повинен містити мінімум 6 символів");
        return;
      }
    }

    setSubmitting(true);

    try {
      const updateData: any = {
        email: editAdminFormData.email,
        name: editAdminFormData.name,
        phone: editAdminFormData.phone,
      };
      
      if (editAdminFormData.password) {
        updateData.password = editAdminFormData.password;
      }

      const res = await fetch(`/api/admin/admins/${editingAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowEditAdminModal(false);
        setEditingAdmin(null);
        setEditAdminFormData({ 
          email: "", 
          name: "", 
          phone: "", 
          password: "",
          confirmPassword: "",
        });
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

  const handleDeleteAdminClick = (adminId: string) => {
    setDeletingAdminId(adminId);
  };

  const handleDeleteAdminConfirm = async () => {
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Управління адмінами
              </h1>
              <p className="text-sm text-slate-600">
                Створення та управління адміністраторами системи
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
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
                    Ім'я *
                  </label>
                  <input
                    type="text"
                    value={adminFormData.name}
                    onChange={(e) =>
                      setAdminFormData({ ...adminFormData, name: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={adminFormData.email}
                    onChange={(e) =>
                      setAdminFormData({ ...adminFormData, email: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={adminFormData.phone}
                    onChange={(e) =>
                      setAdminFormData({ ...adminFormData, phone: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Пароль *
                  </label>
                  <PasswordInput
                    value={adminFormData.password}
                    onChange={(e) =>
                      setAdminFormData({ ...adminFormData, password: e.target.value })
                    }
                    required
                    minLength={6}
                    confirmPassword={adminFormData.confirmPassword}
                    showConfirmError={true}
                    className="focus:border-teal-500 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Підтвердити пароль *
                  </label>
                  <PasswordInput
                    value={adminFormData.confirmPassword}
                    onChange={(e) =>
                      setAdminFormData({ ...adminFormData, confirmPassword: e.target.value })
                    }
                    required
                    minLength={6}
                    confirmPassword={adminFormData.password}
                    showConfirmError={true}
                    className="focus:border-teal-500 focus:ring-teal-500/20"
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
                    setAdminFormData({ 
                      email: "", 
                      password: "", 
                      confirmPassword: "",
                      name: "", 
                      phone: "" 
                    });
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
                            onClick={() => handleEditAdminClick(admin)}
                            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 hover:border-teal-300"
                            title="Редагувати"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdminClick(admin.id)}
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

      {/* Edit Admin Modal */}
      {showEditAdminModal && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Редагувати адміна
              </h2>
              <button
                onClick={() => {
                  setShowEditAdminModal(false);
                  setEditingAdmin(null);
                  setEditAdminFormData({ 
                    email: "", 
                    name: "", 
                    phone: "", 
                    password: "",
                    confirmPassword: "",
                  });
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
                  value={editAdminFormData.name}
                  onChange={(e) =>
                    setEditAdminFormData({ ...editAdminFormData, name: e.target.value })
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
                  value={editAdminFormData.email}
                  onChange={(e) =>
                    setEditAdminFormData({ ...editAdminFormData, email: e.target.value })
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
                  value={editAdminFormData.phone}
                  onChange={(e) =>
                    setEditAdminFormData({ ...editAdminFormData, phone: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Новий пароль (залиште порожнім, щоб не змінювати)
                </label>
                <PasswordInput
                  value={editAdminFormData.password}
                  onChange={(e) =>
                    setEditAdminFormData({ ...editAdminFormData, password: e.target.value })
                  }
                  minLength={6}
                  confirmPassword={editAdminFormData.confirmPassword}
                  showConfirmError={true}
                  className="focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              {editAdminFormData.password && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Підтвердити новий пароль
                  </label>
                  <PasswordInput
                    value={editAdminFormData.confirmPassword}
                    onChange={(e) =>
                      setEditAdminFormData({ ...editAdminFormData, confirmPassword: e.target.value })
                    }
                    minLength={6}
                    confirmPassword={editAdminFormData.password}
                    showConfirmError={true}
                    className="focus:border-teal-500 focus:ring-teal-500/20"
                  />
                </div>
              )}
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
                    setShowEditAdminModal(false);
                    setEditingAdmin(null);
                    setEditAdminFormData({ 
                      email: "", 
                      name: "", 
                      phone: "", 
                      password: "",
                      confirmPassword: "",
                    });
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

      {/* Delete Admin Confirmation Modal */}
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
                onClick={handleDeleteAdminConfirm}
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

