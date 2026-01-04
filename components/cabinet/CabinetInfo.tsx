"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Locale, getTranslations } from "@/lib/translations";
import { Info, FileText, Phone, Mail, MessageCircle, Copy, Check } from "lucide-react";

type CabinetInfoProps = {
  locale: Locale;
};

const infoContent = {
  ua: {
    title: "Інформація",
    intro: "Тут згодом зʼявиться детальна інформація про умови співпраці, тарифи, контакти та корисні інструкції.",
    hint: "Якщо вам потрібна допомога вже зараз — скористайтесь швидким звʼязком з менеджером у лівому меню.",
    markingTitle: "Інструкції з маркування",
    markingInstruction: "Будь ласка, попросіть ваших постачальників і продавців здійснювати маркування відповідно до обраного вами типу доставки та коду клієнта.",
    trackingInstruction: "За можливості надайте трек-номер локальної доставки в Китаї вашому менеджеру.",
    packingCodes: {
      air: "Авіа",
      sea: "Море",
      rail: "Залізниця",
      multimodal: "Мультимодально"
    },
    thankYou: "Дякуємо за співпрацю!",
    copyButton: "Копіювати",
    copied: "Скопійовано!",
    sections: [
      {
        title: "Умови співпраці",
        content: "Ми працюємо на прозорих умовах співпраці. Всі тарифи та умови доставки обговорюються індивідуально з кожним клієнтом."
      },
      {
        title: "Тарифи",
        content: "Тарифи залежать від типу доставки (повітряна, морська, залізнична), ваги, об'єму та маршруту. Детальну інформацію можна отримати у вашого персонального менеджера."
      },
      {
        title: "Контакти",
        content: "Для зв'язку з нами використовуйте швидкий зв'язок з менеджером у лівому меню або звертайтеся до вашого персонального менеджера."
      },
      {
        title: "Корисні інструкції",
        content: "Всі необхідні інструкції щодо оформлення вантажів, упаковки та документів надає ваш персональний менеджер під час роботи над вашим замовленням."
      }
    ]
  },
  ru: {
    title: "Информация",
    intro: "Здесь вскоре появится детальная информация об условиях сотрудничества, тарифах, контактах и полезных инструкциях.",
    hint: "Если вам нужна помощь уже сейчас — воспользуйтесь быстрой связью с менеджером в левом меню.",
    markingTitle: "Инструкции по маркировке",
    markingInstruction: "Пожалуйста, попросите ваших поставщиков и продавцов осуществлять маркировку согласно выбранному вами типу доставки и коду клиента.",
    trackingInstruction: "По возможности предоставьте трек-номер локальной доставки в Китае вашему менеджеру.",
    packingCodes: {
      air: "Авиа",
      sea: "Море",
      rail: "Железная дорога",
      multimodal: "Мультимодально"
    },
    thankYou: "Спасибо за сотрудничество!",
    copyButton: "Копировать",
    copied: "Скопировано!",
    sections: [
      {
        title: "Условия сотрудничества",
        content: "Мы работаем на прозрачных условиях сотрудничества. Все тарифы и условия доставки обсуждаются индивидуально с каждым клиентом."
      },
      {
        title: "Тарифы",
        content: "Тарифы зависят от типа доставки (воздушная, морская, железнодорожная), веса, объема и маршрута. Подробную информацию можно получить у вашего персонального менеджера."
      },
      {
        title: "Контакты",
        content: "Для связи с нами используйте быструю связь с менеджером в левом меню или обращайтесь к вашему персональному менеджеру."
      },
      {
        title: "Полезные инструкции",
        content: "Все необходимые инструкции по оформлению грузов, упаковке и документам предоставляет ваш персональный менеджер во время работы над вашим заказом."
      }
    ]
  },
  en: {
    title: "Information",
    intro: "Detailed information about cooperation terms, tariffs, contacts and useful instructions will appear here soon.",
    hint: "If you need help right now — use the quick contact with the manager in the left menu.",
    markingTitle: "Marking Instructions",
    markingInstruction: "Please ask your suppliers and sellers to mark according to your chosen delivery type and client code.",
    trackingInstruction: "If possible, provide the local delivery tracking number in China to your manager.",
    packingCodes: {
      air: "Air",
      sea: "Sea",
      rail: "Railway",
      multimodal: "Multimodal"
    },
    thankYou: "Thank you for your cooperation!",
    copyButton: "Copy",
    copied: "Copied!",
    sections: [
      {
        title: "Cooperation Terms",
        content: "We work on transparent cooperation terms. All tariffs and delivery conditions are discussed individually with each client."
      },
      {
        title: "Tariffs",
        content: "Tariffs depend on the type of delivery (air, sea, rail), weight, volume and route. Detailed information can be obtained from your personal manager."
      },
      {
        title: "Contacts",
        content: "To contact us, use the quick contact with the manager in the left menu or contact your personal manager."
      },
      {
        title: "Useful Instructions",
        content: "All necessary instructions for cargo registration, packaging and documents are provided by your personal manager during work on your order."
      }
    ]
  }
};

export function CabinetInfo({ locale }: CabinetInfoProps) {
  const { data: session } = useSession();
  const t = getTranslations(locale);
  const content = infoContent[locale] || infoContent.ua;
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
        {t.cabinet?.info || content.title}
      </h2>
      
      <div className="space-y-6">
        {/* Marking Instructions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            {content.markingTitle}
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              {content.markingInstruction}
            </p>
            
          <p className="text-sm text-slate-700 leading-relaxed">
              {content.trackingInstruction}
          </p>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="space-y-2.5 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{content.packingCodes.air} -</span>
                  <code className="rounded bg-white px-2 py-1 font-mono text-teal-700">
                    A{clientCode}
                  </code>
                  <CopyButton text={`A${clientCode}`} copyKey="code-air" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{content.packingCodes.sea} -</span>
                  <code className="rounded bg-white px-2 py-1 font-mono text-teal-700">
                    S{clientCode}
                  </code>
                  <CopyButton text={`S${clientCode}`} copyKey="code-sea" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{content.packingCodes.rail} -</span>
                  <code className="rounded bg-white px-2 py-1 font-mono text-teal-700">
                    R{clientCode}
                  </code>
                  <CopyButton text={`R${clientCode}`} copyKey="code-rail" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{content.packingCodes.multimodal} -</span>
                  <code className="rounded bg-white px-2 py-1 font-mono text-teal-700">
                    M{clientCode}
                  </code>
                  <CopyButton text={`M${clientCode}`} copyKey="code-multimodal" />
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-teal-700">
              {content.thankYou}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {content.sections.map((section, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <Info className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {section.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


