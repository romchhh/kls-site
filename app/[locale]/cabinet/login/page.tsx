"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2, HelpCircle, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { Locale, getTranslations } from "@/lib/translations";
import { PasswordInput } from "@/components/ui/PasswordInput";

type CabinetLoginPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default function CabinetLoginPage({ params }: CabinetLoginPageProps) {
  const [locale, setLocale] = useState<Locale>("ua");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  const t = getTranslations(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isHuman) {
      setError("Підтвердіть, що ви не робот");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
          email: code, // we treat this as client code on backend as well
          password,
          redirect: false,
      });

      if (result?.error) {
        setError(
          t.cabinet?.loginError || "Невірний код або пароль"
        );
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push(`/${locale}/cabinet`);
        router.refresh();
      }
    } catch (error) {
      setError(
        t.cabinet?.loginError ||
          "Сталася помилка. Спробуйте ще раз."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-segoe">
      {/* Logo */}
      <Link
        href={`/${locale}`}
        className="fixed left-4 top-4 z-20 inline-flex items-center justify-center rounded-full bg-white/90 px-3 py-1 shadow-md backdrop-blur-sm md:left-8 md:top-6"
      >
        <Image
          src="/turquoise-transparent-2x.png"
          alt="KLS Logistics"
          width={192}
          height={192}
          className="h-auto w-28 md:w-36"
        />
      </Link>

      {/* Help icon in top-right corner */}
      <Link
        href={`/${locale}/cabinet/help`}
        className="fixed right-4 top-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-md backdrop-blur-sm hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 md:right-8 md:top-6"
        aria-label={t.cabinet?.helpAria || "Як увійти в кабінет"}
      >
        <HelpCircle className="h-6 w-6" />
      </Link>

      <main className="flex min-h-[calc(100vh-120px)] flex-col md:flex-row">
        {/* Left image panel */}
        <div className="relative hidden w-full overflow-hidden bg-black md:block md:w-1/2">
          <Image
            src="/pramo-nad-kommerceskim-dokom 1.png"
            alt="KLS Logistics"
            fill
            priority
            className="scale-105 object-cover blur-sm"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
          <div className="relative flex h-full flex-col justify-between px-10 pb-10 pt-32 text-slate-50">
            <div className="max-w-md space-y-3">
              <h2 className="text-3xl font-black leading-tight md:text-4xl">
                {t.hero?.titleShort || "Ваш вантаж. Ваш кабінет. Ваш контроль."}
              </h2>
              <p className="text-sm text-slate-200/85">
                {t.cabinet?.heroDescription ||
                  "Входьте в особистий кабінет, щоб відстежувати відправлення, рахунки та фінанси в одному місці 24/7."}
              </p>
            </div>
            <div className="text-[11px] text-slate-400/90">
              <p>
                {t.cabinet?.heroFooter ||
                  "Захищений клієнтський кабінет · Шифроване з'єднання · Підтримка щодня"}
              </p>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex w-full items-stretch bg-slate-50 md:w-1/2">
          <div className="flex w-full items-start justify-center px-4 pt-16 pb-16 md:items-start md:px-14 md:pt-24">
            <div className="w-full max-w-lg space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 rounded-full bg-teal-50 px-4 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500">
                    <LogIn className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h1 className="text-[2.1rem] font-black text-slate-900 md:text-[2.4rem]">
                  {t.cabinet?.loginTitle || "Вхід до кабінету клієнта"}
                  </h1>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[0.9rem] text-slate-600">
                  <p>
                    {t.cabinet?.loginDescription ||
                      "Увійдіть, щоб керувати відправленнями та платежами."}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-slate-500">
                      {t.cabinet?.noProfileQuestion || "Не маєш профілю?"}
                    </span>
                <Link
                  href={`/${locale}/cabinet/help`}
                      className="font-semibold text-teal-600 hover:text-teal-700"
                >
                      {t.cabinet?.registration || "Реєстрація"}
                </Link>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="space-y-2.5">
                  <label
                    htmlFor="code"
                    className="block text-[0.95rem] font-semibold text-slate-700"
                  >
                    {t.cabinet?.clientCode || "Код клієнта"}
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[0.95rem] text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                    placeholder={
                      t.cabinet?.clientCodePlaceholder || "Наприклад, 1234"
                    }
                  />
                </div>

                <div className="space-y-2.5">
                  <label
                    htmlFor="password"
                    className="block text-[0.95rem] font-semibold text-slate-700"
                  >
                    {t.cabinet?.password || "Пароль"}
                  </label>
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-2xl px-4 py-3 text-[0.95rem]"
                    placeholder={
                      t.cabinet?.passwordPlaceholder || "Введіть пароль"
                    }
                  />
                </div>

                {/* Simple captcha styled similar to reCAPTCHA */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5">
                  <label className="flex items-center gap-3 text-[0.9rem] text-slate-700">
                    <input
                      type="checkbox"
                      checked={isHuman}
                      onChange={(e) => setIsHuman(e.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      {t.cabinet?.notRobotLabel || "Я не робот"}
                    </span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-200">
                      <span className="text-[11px] font-bold text-slate-700">
                        re
                  </span>
                    </div>
                    <div className="leading-tight">
                      <p className="font-semibold">
                        {t.cabinet?.recaptchaTitle || "reCAPTCHA"}
                      </p>
                      <p className="text-[9px]">
                        {t.cabinet?.recaptchaPrivacy || "Конфіденційність · Умови"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-teal-500 px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-teal-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t.cabinet?.loggingIn || "Вхід..."}
                    </span>
                  ) : (
                    t.cabinet?.login || "Войти"
                  )}
                </button>

                <div className="mt-4 border-t border-slate-200 pt-3 space-y-2">
                  <div className="flex justify-start">
                    <Link
                      href={`/${locale}/cabinet/help#forgot-password`}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      {t.cabinet?.forgotPassword || "Не пам'ятаю пароль"}
                    </Link>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {t.cabinet?.managerInfo ||
                      "Реєстрація нового клієнта, відновлення паролю та зміна даних здійснюються через вашого персонального менеджера KLS."}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Floating chat button */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-teal-300 shadow-xl hover:bg-slate-800"
        aria-label="Написати в підтримку"
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <SiteFooter locale={locale} />
    </div>
  );
}

