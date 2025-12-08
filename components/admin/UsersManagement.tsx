"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Building,
  Hash,
  Search,
} from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  companyName?: string | null;
  clientCode: string;
  createdAt: string;
}

export function UsersManagement() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    companyName: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (userFormData.password !== userFormData.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    if (userFormData.password.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userFormData.email,
          password: userFormData.password,
          name: userFormData.name,
          phone: userFormData.phone,
          companyName: userFormData.companyName || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowAddUser(false);
        setUserFormData({ 
          email: "", 
          password: "", 
          confirmPassword: "",
          name: "", 
          phone: "", 
          companyName: "" 
        });
        fetchUsers();
        await fetch("/api/admin/log-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionType: "CREATE_USER",
            targetType: "USER",
            targetId: data.user?.id,
            description: `Created user ${userFormData.email} with code ${data.user?.clientCode}`,
          }),
        });
      } else {
        setError(data.error || "Помилка створення користувача");
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
                Управління користувачами
              </h1>
              <p className="text-sm text-slate-600">
                Створення та управління користувачами системи
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Actions */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Пошук користувачів (ім'я, email, телефон, код клієнта, компанія)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-lg"
          >
            <UserPlus className="h-5 w-5" />
            Додати користувача
          </button>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-black text-slate-900">
              Створити нового користувача
            </h2>
            <form onSubmit={handleAddUser} className="space-y-4">
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
                    value={userFormData.name}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, name: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, email: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={userFormData.phone}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, phone: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Назва компанії (опціонально)
                  </label>
                  <input
                    type="text"
                    value={userFormData.companyName}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, companyName: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Пароль *
                  </label>
                  <PasswordInput
                    value={userFormData.password}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, password: e.target.value })
                    }
                    required
                    minLength={6}
                    confirmPassword={userFormData.confirmPassword}
                    showConfirmError={true}
                    className="focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Підтвердити пароль *
                  </label>
                  <PasswordInput
                    value={userFormData.confirmPassword}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, confirmPassword: e.target.value })
                    }
                    required
                    minLength={6}
                    confirmPassword={userFormData.password}
                    showConfirmError={true}
                    className="focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
                <p className="font-semibold">ℹ️ Код клієнта буде автоматично згенеровано (4 цифри)</p>
                <p className="mt-1 text-xs">Цей код буде використовуватися для маркування коробок</p>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Створення...
                    </span>
                  ) : (
                    "Створити користувача"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUser(false);
                    setUserFormData({ 
                      email: "", 
                      password: "", 
                      confirmPassword: "",
                      name: "", 
                      phone: "", 
                      companyName: "" 
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

        {/* Users List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-black text-slate-900">Список користувачів</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {(() => {
                const filteredUsers = users.filter((user) => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.phone.toLowerCase().includes(query) ||
                    user.clientCode.toLowerCase().includes(query) ||
                    (user.companyName && user.companyName.toLowerCase().includes(query))
                  );
                });

                if (filteredUsers.length === 0) {
                  return (
                    <div className="px-6 py-12 text-center text-slate-500">
                      <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                      <p>
                        {searchQuery.trim()
                          ? "Користувачів не знайдено"
                          : "Користувачів поки немає"}
                      </p>
                    </div>
                  );
                }

                return filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => router.push(`/admin/dashboard/users/${user.id}`)}
                    className="w-full text-left px-6 py-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-slate-900">
                              {user.name}
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                              <Hash className="h-3 w-3" />
                              {user.clientCode}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </span>
                            {user.companyName && (
                              <span className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {user.companyName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          <Calendar className="mr-1 inline h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                        </p>
                      </div>
                    </div>
                  </button>
                ));
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

