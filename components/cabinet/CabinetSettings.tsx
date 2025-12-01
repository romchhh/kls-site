"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Locale, getTranslations } from "@/lib/translations";
import { Mail, Lock, User, Phone } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

type CabinetSettingsProps = {
  locale: Locale;
};

export function CabinetSettings({ locale }: CabinetSettingsProps) {
  const { data: session } = useSession();
  const t = getTranslations(locale);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangePhone, setShowChangePhone] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Email успішно змінено");
        setShowChangeEmail(false);
        setNewEmail("");
        // Wait a bit before reloading to ensure DB update is complete
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setError(data.error || "Помилка зміни email");
      }
    } catch (error) {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/update-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPhone }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Телефон успішно змінено");
        setShowChangePhone(false);
        setNewPhone("");
        window.location.reload();
      } else {
        setError(data.error || "Помилка зміни телефону");
      }
    } catch {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Ім'я успішно змінено");
        setShowChangeName(false);
        setNewName("");
        window.location.reload();
      } else {
        setError(data.error || "Помилка зміни імені");
      }
    } catch {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    if (newPassword.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Пароль успішно змінено");
        setShowChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Помилка зміни пароля");
      }
    } catch (error) {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.settings || "Налаштування"}
      </h2>

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Info */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-teal-100 p-3">
              <User className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {session?.user?.name}
              </h3>
              <p className="text-sm text-slate-600">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Change Name */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-600" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  {t.cabinet?.changeName || "Змінити ім'я та прізвище"}
                </h3>
                <p className="text-sm text-slate-600">
                  Поточне ім'я: {session?.user?.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChangeName(!showChangeName)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              {showChangeName ? t.cabinet?.cancel : t.cabinet?.changeName || "Змінити ім'я"}
            </button>
          </div>

          {showChangeName && (
            <form onSubmit={handleChangeName} className="mt-4 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Нове ім'я та прізвище
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Введіть ім'я та прізвище"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.cabinet?.save || "Зберегти"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangeName(false);
                    setNewName("");
                    setError("");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {t.cabinet?.cancel || "Скасувати"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Email */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-600" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  {t.cabinet?.changeEmail || "Змінити email"}
                </h3>
                <p className="text-sm text-slate-600">
                  Поточний email: {session?.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChangeEmail(!showChangeEmail)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              {showChangeEmail ? t.cabinet?.cancel : t.cabinet?.changeEmail}
            </button>
          </div>

          {showChangeEmail && (
            <form onSubmit={handleChangeEmail} className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Новий email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.cabinet?.save || "Зберегти"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangeEmail(false);
                    setNewEmail("");
                    setError("");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {t.cabinet?.cancel || "Скасувати"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Phone */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-slate-600" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  Змінити номер телефону
                </h3>
                <p className="text-sm text-slate-600">
                  Поточний телефон: {session?.user?.phone || "не вказано"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChangePhone(!showChangePhone)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              {showChangePhone ? "Скасувати" : "Змінити телефон"}
            </button>
          </div>

          {showChangePhone && (
            <form onSubmit={handleChangePhone} className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Новий номер телефону
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Зберегти
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePhone(false);
                    setNewPhone("");
                    setError("");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Скасувати
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-slate-600" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  {t.cabinet?.changePassword || "Змінити пароль"}
                </h3>
                <p className="text-sm text-slate-600">
                  Оновіть свій пароль для безпеки
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              {showChangePassword ? t.cabinet?.cancel : t.cabinet?.changePassword}
            </button>
          </div>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Поточний пароль
                </label>
                <PasswordInput
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Новий пароль
                </label>
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  confirmPassword={confirmPassword}
                  showConfirmError={true}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Підтвердити пароль
                </label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  confirmPassword={newPassword}
                  showConfirmError={true}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.cabinet?.save || "Зберегти"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {t.cabinet?.cancel || "Скасувати"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

