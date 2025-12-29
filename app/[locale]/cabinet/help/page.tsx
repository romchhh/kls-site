import { Locale } from "@/lib/translations";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

const helpContent: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    stepsTitle: string;
    steps: string[];
    note: string;
  }
> = {
  ua: {
    title: "Як увійти в кабінет",
    subtitle:
      "Для входу вам потрібен персональний код клієнта (4 цифри) та пароль, який ви отримали від менеджера.",
    stepsTitle: "Кроки для входу:",
    steps: [
      "Знайдіть свій код клієнта (4 цифри), який зазначений у листуванні з менеджером або в договорі.",
      "Перейдіть на сторінку входу в кабінет.",
      "У полі \"Код клієнта\" введіть ваш 4-значний код (наприклад, 2491).",
      "У полі \"Пароль\" введіть пароль, який вам надіслав менеджер.",
      "Поставте позначку \"Я не робот\" та натисніть кнопку \"Увійти\".",
    ],
    note: "Якщо ви забули код або пароль — зверніться до вашого персонального менеджера, і ми оперативно відновимо доступ.",
  },
  ru: {
    title: "Как войти в кабинет",
    subtitle:
      "Для входа вам нужен персональный код клиента (4 цифры) и пароль, который вы получили от менеджера.",
    stepsTitle: "Шаги для входа:",
    steps: [
      "Найдите свой код клиента (4 цифры) в переписке с менеджером или в договоре.",
      "Перейдите на страницу входа в кабинет.",
      "В поле \"Код клиента\" введите ваш 4-значный код (например, 2491).",
      "В поле \"Пароль\" введите пароль, который вам отправил менеджер.",
      "Отметьте \"Я не робот\" и нажмите кнопку \"Войти\".",
    ],
    note: "Если вы забыли код или пароль — свяжитесь с вашим персональным менеджером, и мы быстро восстановим доступ.",
  },
  en: {
    title: "How to log in to your cabinet",
    subtitle:
      "To log in you need your personal client code (4 digits) and the password provided by your manager.",
    stepsTitle: "Steps to log in:",
    steps: [
      "Find your client code (4 digits) in the message from your manager or in your agreement.",
      "Go to the login page of the client cabinet.",
      "In the \"Client code\" field, enter your 4-digit code (for example, 2491).",
      "In the \"Password\" field, enter the password you received from your manager.",
      "Check \"I’m not a robot\" and click the \"Log in\" button.",
    ],
    note: "If you forgot your code or password, please contact your personal manager and we will quickly restore your access.",
  },
};

export default async function CabinetHelpPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = helpContent[locale] || helpContent.ua;

  return (
    <div className="min-h-screen bg-white font-segoe">
      <Navigation locale={locale} />

      <main className="mx-auto flex min-h-[calc(100vh-200px)] max-w-3xl flex-col px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-slate-500">
          <Link
            href={`/${locale}/cabinet/login`}
            className="text-teal-600 hover:text-teal-700"
          >
            ← Повернутися до входу
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {content.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {content.subtitle}
          </p>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {content.stepsTitle}
          </h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-700 sm:text-base">
            {content.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-semibold text-teal-600">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-teal-600">
            {content.note}
          </p>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}


