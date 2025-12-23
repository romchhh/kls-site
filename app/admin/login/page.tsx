"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Невірний email або пароль");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Сталася помилка. Спробуйте ще раз.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 font-segoe">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-teal-100 p-3">
              <LogIn className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="mb-2 text-3xl font-black text-slate-900">
              Вхід в адмін панель
            </h1>
            <p className="text-slate-600">
              Введіть ваші облікові дані для входу
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Пароль
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-teал-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Вхід...
                </span>
              ) : (
                "Увійти"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Розроблено{" "}
              <a
                href="https://new.telebots.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-teal-600 transition-colors hover:text-teal-700"
              >
                TeleBots
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

