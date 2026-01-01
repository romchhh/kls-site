"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Package,
  FileText,
  DollarSign,
  Warehouse,
  Settings,
  Hash,
  MessageCircle,
  LogOut,
  Globe,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  Bot,
} from "lucide-react";
import { SiteFooter } from "../SiteFooter";
import { Locale, getTranslations, locales } from "@/lib/translations";
import { CabinetShipments } from "./CabinetShipments";
import { CabinetInvoices } from "./CabinetInvoices";
import { CabinetFinances } from "./CabinetFinances";
import { CabinetWarehouses } from "./CabinetWarehouses";
import { CabinetSettings } from "./CabinetSettings";
import { CabinetInfo } from "./CabinetInfo";

type UserCabinetProps = {
  locale: Locale;
};

type TabType =
  | "shipments"
  | "invoices"
  | "finances"
  | "warehouses"
  | "settings"
  | "info";

export function UserCabinet({ locale }: UserCabinetProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "shipments";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved === "true";
    }
    return false;
  });
  const router = useRouter();
  const pathname = usePathname();
  const t = getTranslations(locale);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", String(newState));
    }
  };

  const tabs = [
    { id: "shipments" as TabType, label: t.cabinet?.shipments || "Вантаж", icon: Package },
    { id: "invoices" as TabType, label: t.cabinet?.invoices || "Рахунки", icon: FileText },
    { id: "finances" as TabType, label: t.cabinet?.finances || "Фінанси", icon: DollarSign },
    { id: "warehouses" as TabType, label: t.cabinet?.warehouses || "Склади", icon: Warehouse },
    { id: "info" as TabType, label: t.cabinet?.info || "Інфо", icon: Info },
    { id: "settings" as TabType, label: t.cabinet?.settings || "Налаштування", icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    if (!pathname || nextLocale === locale) {
      return;
    }

    const segments = pathname.split("?");
    const basePath = segments[0];
    const query = segments[1];
    const pathParts = basePath.split("/");
    if (pathParts.length > 1) {
      pathParts[1] = nextLocale;
      const base = pathParts.join("/") || `/${nextLocale}/cabinet`;
      const tabParam = `tab=${activeTab}`;
      const nextPath = query ? `${base}?${tabParam}` : `${base}?${tabParam}`;
      router.push(nextPath);
    } else {
      router.push(`/${nextLocale}/cabinet?tab=${activeTab}`);
    }

    setIsLangOpen(false);
  };

  const [managerLink, setManagerLink] = useState<string | null>(null);

  useEffect(() => {
    const loadManagerLink = async () => {
      try {
        const res = await fetch(`/api/user/site-settings?locale=${locale}`);
        if (res.ok) {
          const data = await res.json();
          setManagerLink(data.managerLink);
        }
      } catch {
        // ignore
      }
    };

    loadManagerLink();
  }, [locale]);

  const handleTelegramContact = () => {
    if (managerLink) {
      window.open(managerLink, "_blank");
    } else {
      window.open("https://t.me/klslogistics", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-md lg:px-10 lg:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative h-7 w-auto flex-shrink-0 md:h-8">
                <Image
                  src="/logos/ЛОГО(1).png"
                  alt="KLS Logo"
                  width={120}
                  height={36}
                  className="h-7 w-auto md:h-8 object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 lg:text-[2.2rem]">
                  {t.cabinet?.welcome || "Ласкаво просимо"}, {session?.user?.name}
                </h1>
                <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-2 text-sm text-teal-700 shadow-sm lg:text-base">
                  <Hash className="h-4 w-4" />
                  <span className="font-extrabold tracking-wide">
                    {t.cabinet?.yourCode || "Ваш код клієнта"}:{" "}
                    <span className="text-lg lg:text-xl">{session?.user?.clientCode}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
                >
                  <Globe className="h-4 w-4" />
                  <span>{locale.toUpperCase()}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-150 ${
                      isLangOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isLangOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-32 rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleLocaleChange(loc)}
                        className={`block w-full px-3 py-2 text-left text-sm transition ${
                          loc === locale
                            ? "font-semibold text-teal-700"
                            : "text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                        }`}
                      >
                        {loc === "ua" ? "UA" : loc === "ru" ? "RU" : "EN"}
                      </button>
                    ))}
                  </div>
                )}
            </div>
            <button
              onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
                {t.cabinet?.logout || "Вийти"}
            </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className={`transition-all duration-300 ${isSidebarCollapsed ? "lg:col-span-1" : "lg:col-span-2"}`}>
            <div className={`mb-4 flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
              {!isSidebarCollapsed && (
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.nav?.cabinet || "Кабінет"}
                </div>
              )}
              <button
                onClick={toggleSidebar}
                className={`flex h-8 w-8 items-center justify-center ${
                  isSidebarCollapsed ? "rounded-full" : "ml-auto rounded-lg"
                } border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900`}
                title={isSidebarCollapsed ? "Розгорнути меню" : "Згорнути меню"}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (pathname) {
                        const basePath = pathname.split("?")[0];
                        const nextPath = `${basePath}?tab=${tab.id}`;
                        router.push(nextPath);
                      }
                    }}
                    className={`group relative flex w-full items-center ${
                      isSidebarCollapsed 
                        ? "justify-center rounded-full p-3" 
                        : "gap-3 rounded-xl px-4 py-3.5"
                    } text-left text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-lg"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center ${
                        isSidebarCollapsed 
                          ? "h-10 w-10" 
                          : "h-9 w-9 rounded-xl"
                      } ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                      <Icon className="h-4 w-4" />
                    </span>
                    {!isSidebarCollapsed && (
                      <>
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute inset-y-1 right-1 w-1 rounded-full bg-white/70 lg:right-1.5" />
                        )}
                      </>
                    )}
                    {/* Tooltip for collapsed sidebar */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-2 z-50 hidden group-hover:block">
                        <div className="relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                          <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white whitespace-nowrap shadow-xl">
                            {tab.label}
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Contact */}
            {!isSidebarCollapsed && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                {t.cabinet?.quickContact || "Швидкий зв'язок"}
              </h3>
              <p className="mb-3 text-xs text-slate-600">
                {t.cabinet?.managerInfo ||
                  "Реєстрація, зміна даних та складні питання вирішуються через вашого персонального менеджера."}
              </p>
              <button
                onClick={handleTelegramContact}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-teal-700 hover:shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                {t.cabinet?.contactTelegram || "Telegram"}
              </button>
                <button
                  onClick={() => window.open("https://t.me/KlsInternationalBot", "_blank")}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-teal-600 bg-white px-4 py-2.5 text-sm font-semibold text-teal-600 transition-all duration-300 hover:bg-teal-50 hover:shadow-md"
                >
                  <Bot className="h-5 w-5" />
                  Підключити телеграм бота
                </button>
              </div>
            )}
            {isSidebarCollapsed && (
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleTelegramContact}
                  className="group relative flex w-full items-center justify-center rounded-full bg-teal-600 p-3 text-white transition-all duration-300 hover:bg-teal-700 hover:shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 z-50 hidden group-hover:block">
                    <div className="relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                      <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white whitespace-nowrap shadow-xl">
                        {t.cabinet?.contactTelegram || "Telegram"}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => window.open("https://t.me/KlsInternationalBot", "_blank")}
                  className="group relative flex w-full items-center justify-center rounded-full border border-teal-600 bg-white p-3 text-teal-600 transition-all duration-300 hover:bg-teal-50 hover:shadow-md"
                >
                  <Bot className="h-5 w-5" />
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 z-50 hidden group-hover:block">
                    <div className="relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                      <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white whitespace-nowrap shadow-xl">
                        {t.cabinet?.connectTelegramBot || "Підключити телеграм бота"}
                      </div>
                    </div>
                  </div>
                </button>
            </div>
            )}
          </aside>

          {/* Main Content */}
          <main className={`transition-all duration-300 ${isSidebarCollapsed ? "lg:col-span-11" : "lg:col-span-10"}`}>
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:p-8">
              {activeTab === "shipments" && <CabinetShipments locale={locale} />}
              {activeTab === "invoices" && <CabinetInvoices locale={locale} />}
              {activeTab === "finances" && <CabinetFinances locale={locale} />}
              {activeTab === "warehouses" && <CabinetWarehouses locale={locale} />}
              {activeTab === "settings" && <CabinetSettings locale={locale} />}
              {activeTab === "info" && <CabinetInfo locale={locale} />}
            </div>
          </main>
        </div>
      </div>

      <SiteFooter locale={locale} />
    </div>
  );
}

