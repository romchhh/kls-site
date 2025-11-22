import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../lib/translations";

const cabinetContent = {
  ua: {
    title: "Логістичний кабінет",
    description: "Увійдіть у свій кабінет для доступу до всіх послуг та відстеження вантажів.",
    login: "Увійти",
    register: "Зареєструватися",
  },
  ru: {
    title: "Логистический кабинет",
    description: "Войдите в свой кабинет для доступа ко всем услугам и отслеживания грузов.",
    login: "Войти",
    register: "Зарегистрироваться",
  },
  en: {
    title: "Logistics Cabinet",
    description: "Log in to your cabinet to access all services and track shipments.",
    login: "Log In",
    register: "Register",
  },
};

export default async function CabinetPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = cabinetContent[locale];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-md px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {content.title}
          </h1>
          <p className="mb-8 text-lg text-gray-600">{content.description}</p>

          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-teal-700"
              >
                {content.login}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              <a href="#" className="text-teal-600 hover:text-teal-700">
                {content.register}
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

