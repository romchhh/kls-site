"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Locale, getTranslations } from "@/lib/translations";
import { Warehouse, MapPin, Phone, Mail, Copy, Check } from "lucide-react";

type CabinetWarehousesProps = {
  locale: Locale;
};

const warehousesContent = {
  ua: {
    title: "Склади",
    location: "Китай, Гуанчжоу",
    addressChinese: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室 / 卫东 1234567890",
    addressEnglish: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009 / Jason 1234567890",
    packingConditionsTitle: "Умови упаковки:",
    packingConditions: {
      air: "Авіа",
      sea: "Море",
      rail: "Залізниця",
      multimodal: "Мультимодально"
    },
    instruction: "Будь ласка, попросіть ваших постачальників і продавців здійснювати маркування відповідно до обраного вами типу доставки та коду клієнта.",
    instruction2: "За можливості надайте трек-номер локальної доставки в Китаї вашому менеджеру.",
    instruction3: "Дякуємо за співпрацю!",
    copyButton: "Копіювати",
    copied: "Скопійовано!"
  },
  ru: {
    title: "Склады",
    location: "Китай, Гуанчжоу",
    addressChinese: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室 / 卫东 1234567890",
    addressEnglish: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009 / Jason 1234567890",
    packingConditionsTitle: "Условия упаковки:",
    packingConditions: {
      air: "Авиа",
      sea: "Море",
      rail: "Железная дорога",
      multimodal: "Мультимодально"
    },
    instruction: "Пожалуйста, попросите ваших поставщиков и продавцов осуществлять маркировку согласно выбранному вами типу доставки и коду клиента.",
    instruction2: "По возможности предоставьте трек-номер локальной доставки в Китае вашему менеджеру.",
    instruction3: "Спасибо за сотрудничество!",
    copyButton: "Копировать",
    copied: "Скопировано!"
  },
  en: {
    title: "Warehouses",
    location: "China, Guangzhou",
    addressChinese: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室 / 卫东 1234567890",
    addressEnglish: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009 / Jason 1234567890",
    packingConditionsTitle: "Packing Conditions:",
    packingConditions: {
      air: "Air",
      sea: "Sea",
      rail: "Railway",
      multimodal: "Multimodal"
    },
    instruction: "Please ask your suppliers and sellers to mark according to your chosen delivery type and client code.",
    instruction2: "If possible, provide the local delivery tracking number in China to your manager.",
    instruction3: "Thank you for your cooperation!",
    copyButton: "Copy",
    copied: "Copied!"
  }
};

export function CabinetWarehouses({ locale }: CabinetWarehousesProps) {
  const { data: session } = useSession();
  const t = getTranslations(locale);
  const content = warehousesContent[locale] || warehousesContent.ua;
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const clientCode = session?.user?.clientCode || "0000";

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const CopyButton = ({ text, copyKey }: { text: string; copyKey: string }) => {
    const isCopied = copiedStates[copyKey];
    return (
      <button
        onClick={() => handleCopy(text, copyKey)}
        className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-700 transition-all hover:bg-teal-100 active:scale-95"
        title={content.copyButton}
      >
        {isCopied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>{content.copied}</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>{content.copyButton}</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.warehouses || content.title}
      </h2>
      
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-2xl bg-teal-500 p-3 text-white shadow-md">
                <Warehouse className="h-6 w-6" />
              </div>
              <div className="flex-1">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              {content.location}
                </h3>
            
            {/* Адреса китайською */}
            <div className="mb-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="mb-1 text-xs font-semibold text-slate-700">
                    {locale === "ua" ? "Адреса китайською:" : locale === "ru" ? "Адрес на китайском:" : "Address in Chinese:"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {content.addressChinese}
                  </p>
                </div>
                <CopyButton text={content.addressChinese} copyKey="address-chinese" />
              </div>
            </div>

            {/* Адреса англійською */}
            <div className="mb-6 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="mb-1 text-xs font-semibold text-slate-700">
                    {locale === "ua" ? "Адреса англійською:" : locale === "ru" ? "Адрес на английском:" : "Address in English:"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {content.addressEnglish}
                  </p>
                </div>
                <CopyButton text={content.addressEnglish} copyKey="address-english" />
              </div>
            </div>

            {/* Умови упаковки */}
            <div className="mb-6 rounded-xl bg-white p-4">
              <h4 className="mb-3 text-sm font-semibold text-slate-900">
                {content.packingConditionsTitle}
              </h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                  <span className="font-medium">{content.packingConditions.air} -</span>
                  <code className="rounded bg-slate-100 px-2 py-1 font-mono text-teal-700">
                    A{clientCode}
                  </code>
                  <CopyButton text={`A${clientCode}`} copyKey="code-air" />
                  </div>
                  <div className="flex items-center gap-2">
                  <span className="font-medium">{content.packingConditions.sea} -</span>
                  <code className="rounded bg-slate-100 px-2 py-1 font-mono text-teal-700">
                    S{clientCode}
                  </code>
                  <CopyButton text={`S${clientCode}`} copyKey="code-sea" />
                  </div>
                  <div className="flex items-center gap-2">
                  <span className="font-medium">{content.packingConditions.rail} -</span>
                  <code className="rounded bg-slate-100 px-2 py-1 font-mono text-teal-700">
                    R{clientCode}
                  </code>
                  <CopyButton text={`R${clientCode}`} copyKey="code-rail" />
                  </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{content.packingConditions.multimodal} -</span>
                  <code className="rounded bg-slate-100 px-2 py-1 font-mono text-teal-700">
                    M{clientCode}
                  </code>
                  <CopyButton text={`M${clientCode}`} copyKey="code-multimodal" />
                </div>
              </div>
            </div>

            {/* Інструкційний текст */}
            <div className="space-y-2 rounded-xl bg-blue-50 p-4 text-sm text-slate-700">
              <p>{content.instruction}</p>
              <p>{content.instruction2}</p>
              <p className="font-medium text-teal-700">{content.instruction3}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

