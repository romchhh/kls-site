"use client";

import { Locale, getTranslations } from "@/lib/translations";
import { Info, FileText, Phone, Mail, MessageCircle } from "lucide-react";

type CabinetInfoProps = {
  locale: Locale;
};

const infoContent = {
  ua: {
    title: "Інформація",
    intro: "Тут згодом зʼявиться детальна інформація про умови співпраці, тарифи, контакти та корисні інструкції.",
    hint: "Якщо вам потрібна допомога вже зараз — скористайтесь швидким звʼязком з менеджером у лівому меню.",
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
  const t = getTranslations(locale);
  const content = infoContent[locale] || infoContent.ua;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.info || content.title}
      </h2>
      
      <div className="space-y-6">
        {/* Intro */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-700 leading-relaxed">
            {content.intro}
          </p>
          <p className="mt-4 text-sm text-slate-600">
            {content.hint}
          </p>
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


