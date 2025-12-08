"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Building,
  Hash,
  Calendar,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import type { User } from "./types/userDetail.types";

interface UserEditFormProps {
  user: User;
  onSave: (data: {
    email: string;
    name: string;
    lastName?: string | null;
    middleName?: string | null;
    phone: string;
    companyName?: string | null;
  }) => Promise<void>;
  onSavePassword: (newPassword: string) => Promise<void>;
  saving: boolean;
  error?: string;
  success?: string;
}

export function UserEditForm({
  user,
  onSave,
  onSavePassword,
  saving,
  error,
  success,
}: UserEditFormProps) {
  const [formData, setFormData] = useState({
    email: user.email,
    name: user.name,
    lastName: user.lastName || "",
    middleName: user.middleName || "",
    phone: user.phone,
    companyName: user.companyName || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState<string | null>(user.password || null);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      email: formData.email,
      name: formData.name,
      lastName: formData.lastName || null,
      middleName: formData.middleName || null,
      phone: formData.phone,
      companyName: formData.companyName || null,
    });
  };

  const handleSavePassword = async () => {
    if (!newPassword || newPassword.trim() === "") return;
    if (newPassword.length < 6) return;

    setSavingPassword(true);
    try {
      await onSavePassword(newPassword);
      setNewPassword("");
      setShowPassword(true);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600">
          {success}
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Код клієнта
          </label>
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={user.clientCode}
              disabled
              className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Ім'я *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Прізвище (опціонально)
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            По батькові (опціонально)
          </label>
          <input
            type="text"
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Телефон
          </label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-500" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Пароль
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-500" />
              <div className="flex-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={userPassword || "Не встановлено"}
                  disabled
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 pr-10 text-slate-700 font-mono text-xs cursor-not-allowed"
                />
                {userPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    title={showPassword ? "Приховати пароль" : "Показати пароль"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введіть новий пароль"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <button
                type="button"
                onClick={handleSavePassword}
                disabled={savingPassword || !newPassword.trim()}
                className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100 disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Збереження...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" /> Зберегти пароль
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Пароль зберігається в хешованому вигляді. Введіть новий пароль та натисніть "Зберегти пароль".
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Назва компанії (опціонально)
          </label>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Дата створення
          </label>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            {new Date(user.createdAt).toLocaleString("uk-UA")}
          </div>
        </div>
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Збереження...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Зберегти зміни
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

