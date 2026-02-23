import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { ContactFormFull } from "../../../components/ContactFormFull";
import { StructuredData } from "../../../components/StructuredData";
import { Locale, getTranslations } from "../../../lib/translations";
import { generateMetadata as genMeta } from "../../../lib/metadata";
import { Metadata } from "next";
import { MessageCircle, Phone, Mail, Send, Instagram, Facebook, Twitter } from "lucide-react";

const contactsContent = {
  ua: {
    title: "Контакти",
    subtitle: "Зв'яжіться з нами",
    description: "Ми завжди готові допомогти вам з вашими логістичними потребами.",
    phone: "Телефон",
    email: "Email",
    address: "Адреса",
    yiwu: "Zhejiang, Yiwu",
    guangzhou: "Guangdong, Guangzhou",
    yiwuAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    yiwuAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    yiwuPhone: "+86 21 5555 1234",
    yiwuEmail: "support@kls.international",
    guangzhouAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    guangzhouAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    guangzhouPhone: "+86 21 5555 1234",
    guangzhouEmail: "support@kls.international",
    ukrainePhone: "+380990800222",
    socialMedia: "Соціальні мережі",
    telegram: "Telegram",
    telegramBot: "Telegram бот",
    messengers: "Месенджери",
    wechat: "WeChat",
    wechatPhone: "Телефон додамо пізніше",
  },
  ru: {
    title: "Контакты",
    subtitle: "Свяжитесь с нами",
    description: "Мы всегда готовы помочь вам с вашими логистическими потребностями.",
    phone: "Телефон",
    email: "Email",
    address: "Адрес",
    yiwu: "Zhejiang, Yiwu",
    guangzhou: "Guangdong, Guangzhou",
    yiwuAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    yiwuAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    yiwuPhone: "+86 21 5555 1234",
    yiwuEmail: "support@kls.international",
    guangzhouAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    guangzhouAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    guangzhouPhone: "+86 21 5555 1234",
    guangzhouEmail: "support@kls.international",
    ukrainePhone: "+380990800222",
    socialMedia: "Социальные сети",
    telegram: "Telegram",
    telegramBot: "Telegram бот",
    messengers: "Мессенджеры",
    wechat: "WeChat",
    wechatPhone: "Телефон добавим позже",
  },
  en: {
    title: "Contacts",
    subtitle: "Get in Touch",
    description: "We are always ready to help you with your logistics needs.",
    phone: "Phone",
    email: "Email",
    address: "Address",
    yiwu: "Zhejiang, Yiwu",
    guangzhou: "Guangdong, Guangzhou",
    yiwuAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    yiwuAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    yiwuPhone: "+86 21 5555 1234",
    yiwuEmail: "support@kls.international",
    guangzhouAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    guangzhouAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    guangzhouPhone: "+86 21 5555 1234",
    guangzhouEmail: "support@kls.international",
    ukrainePhone: "+380990800222",
    socialMedia: "Social Media",
    telegram: "Telegram",
    telegramBot: "Telegram Bot",
    messengers: "Messengers",
    wechat: "WeChat",
    wechatPhone: "Phone will be added later",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = contactsContent[locale];
  const baseMetadata = genMeta(locale, "/contacts");
  return {
    ...baseMetadata,
    title: `${content.title} | KLS Logistics`,
    description: `${content.description} ${locale === "ua" ? "Наші офіси в Китаї. Телефон, email, адреса, соціальні мережі." : locale === "ru" ? "Наши офисы в Китае. Телефон, email, адрес, социальные сети." : "Our offices in China. Phone, email, address, social media."}`,
    keywords: `${baseMetadata.keywords}, контакти, зв'язок, адреса, телефон, email, офіс KLS Logistics`,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${content.title} | KLS Logistics`,
      description: content.description,
    },
  };
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = contactsContent[locale];

  return (
    <div className="min-h-screen bg-white">
      <StructuredData 
        locale={locale} 
        type="LocalBusiness"
        breadcrumbs={[
          { name: locale === "ua" ? "Головна" : locale === "ru" ? "Главная" : "Home", url: `/${locale}` },
          { name: content.title, url: `/${locale}/contacts` },
        ]}
      />
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {content.title}
          </h1>
            <p className="mx-auto mb-12 max-w-2xl text-base font-normal leading-relaxed text-slate-600 md:text-lg">
              {content.description}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {/* Zhejiang, Yiwu */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                {content.yiwu}
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {content.email}
                  </p>
                  <a
                    href={`mailto:${content.yiwuEmail}`}
                    className="text-[#006D77] hover:text-[#005a63]"
                  >
                    {content.yiwuEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Guangdong, Guangzhou */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                {content.guangzhou}
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {content.email}
                  </p>
                  <a
                    href={`mailto:${content.guangzhouEmail}`}
                    className="text-[#006D77] hover:text-[#005a63]"
                  >
                    {content.guangzhouEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media and Messengers Section */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 text-center">
              {content.socialMedia} та {content.messengers}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Ukraine Phone */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-4 text-[#006D77]" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {locale === "ua" ? "Україна" : locale === "ru" ? "Украина" : "Ukraine"}
                </h3>
                <div className="space-y-1">
                  <a
                    href={`tel:${content.ukrainePhone}`}
                    className="block text-[#006D77] hover:text-[#005a63] font-medium"
                  >
                    {content.ukrainePhone}
                  </a>
                  <a
                    href="mailto:support@kls.international"
                    className="block text-sm text-[#006D77] hover:text-[#005a63]"
                  >
                    support@kls.international
                  </a>
                </div>
              </div>

              {/* Telegram */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <Send className="h-8 w-8 mx-auto mb-4 text-[#006D77]" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {content.telegram}
                </h3>
                <a
                  href="https://t.me/klslogistics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006D77] hover:text-[#005a63] font-medium"
                >
                  @klslogistics
                </a>
              </div>

              {/* Telegram Bot */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-4 text-[#006D77]" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {content.telegramBot}
                </h3>
                <a
                  href="https://t.me/klslogistics_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006D77] hover:text-[#005a63] font-medium"
                >
                  {locale === "ua" ? "Відкрити бота" : locale === "ru" ? "Открыть бота" : "Open Bot"}
                </a>
              </div>

              {/* WeChat */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-4 text-[#006D77]" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {content.wechat}
                </h3>
                <p className="text-gray-600 text-sm">
                  {content.wechatPhone}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <ContactFormFull locale={locale} />
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

