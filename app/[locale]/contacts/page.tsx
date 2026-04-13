import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { ContactFormFull } from "../../../components/ContactFormFull";
import { StructuredData } from "../../../components/StructuredData";
import { Locale } from "../../../lib/translations";
import { generateMetadata as genMeta } from "../../../lib/metadata";
import { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Phone, Mail, Send, Instagram } from "lucide-react";

const INSTAGRAM_URL =
  "https://www.instagram.com/kls.delivery?igsh=MWVhb291ZXQ4dXY5NQ==";
const CHINA_MESSENGER_PHONE_DISPLAY = "+86 191 2010 9094";
const TELEGRAM_PHONE_LINK = "https://t.me/+8619120109094";
const WHATSAPP_LINK = "https://wa.me/8619120109094";
const WECHAT_ID = "kls_logistics";

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
    yiwuEmail: "yiwu@kls.international",
    guangzhouAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    guangzhouAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    guangzhouPhone: "+86 21 5555 1234",
    guangzhouEmail: "guangzhou@kls.international",
    ukrainePhone: "+380689701270",
    ukrainePhoneNote:
      "(Якщо не отримали відповіді, краще зверніться через один із месенджерів.)",
    socialAndMessengers: "Соціальні мережі та месенджери",
    instagram: "Instagram",
    telegram: "Telegram",
    telegramBot: "Telegram бот",
    whatsapp: "WhatsApp",
    wechat: "WeChat",
    weixinId: "Weixin ID",
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
    yiwuEmail: "yiwu@kls.international",
    guangzhouAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    guangzhouAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    guangzhouPhone: "+86 21 5555 1234",
    guangzhouEmail: "guangzhou@kls.international",
    ukrainePhone: "+380689701270",
    ukrainePhoneNote:
      "(Если не получили ответ, лучше обратитесь через один из мессенджеров.)",
    socialAndMessengers: "Социальные сети и мессенджеры",
    instagram: "Instagram",
    telegram: "Telegram",
    telegramBot: "Telegram бот",
    whatsapp: "WhatsApp",
    wechat: "WeChat",
    weixinId: "Weixin ID",
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
    yiwuEmail: "yiwu@kls.international",
    guangzhouAddress: "中国(浙江)自由贸易试验区金华市义乌市稠江街道宏迪路92号10楼1009室",
    guangzhouAddressEn: "China, Zhejiang Province, Jinhua City, Yiwu City, Choujiang Street, No. 92 Hongdi Road, 10th Floor, Room 1009",
    guangzhouPhone: "+86 21 5555 1234",
    guangzhouEmail: "guangzhou@kls.international",
    ukrainePhone: "+380689701270",
    ukrainePhoneNote:
      "(If you haven't received a reply, please reach out via one of the messengers.)",
    socialAndMessengers: "Social media & messengers",
    instagram: "Instagram",
    telegram: "Telegram",
    telegramBot: "Telegram Bot",
    whatsapp: "WhatsApp",
    wechat: "WeChat",
    weixinId: "Weixin ID",
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
              {content.socialAndMessengers}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Instagram */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <Instagram className="h-8 w-8 mx-auto mb-4 text-[#006D77]" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {content.instagram}
                </h3>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006D77] hover:text-[#005a63] font-medium break-all text-sm"
                >
                  @kls.delivery
                </a>
              </div>

              {/* Global Support Email */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-4 text-[#006D77]" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {content.email}
                </h3>
                <a
                  href="mailto:support@kls.international"
                  className="text-[#006D77] hover:text-[#005a63] font-medium break-all"
                >
                  support@kls.international
                </a>
              </div>

              {/* Telegram (China number) */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <Send className="h-8 w-8 mx-auto mb-4 text-[#006D77]" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {content.telegram}
                </h3>
                <a
                  href={TELEGRAM_PHONE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006D77] hover:text-[#005a63] font-medium"
                >
                  {CHINA_MESSENGER_PHONE_DISPLAY}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center">
                  <Image
                    src="/icons/social/WhatsAppLogo.svg"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {content.whatsapp}
                </h3>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#006D77] hover:text-[#005a63] font-medium"
                >
                  {CHINA_MESSENGER_PHONE_DISPLAY}
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

              {/* WeChat / Weixin */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center">
                <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center">
                  <Image
                    src="/icons/social/wechat-communication-interaction-connection-internet-svgrepo-com.svg"
                    alt="WeChat"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {content.wechat}
                </h3>
                <p className="text-xs font-medium text-gray-500">{content.weixinId}</p>
                <p className="mt-1 font-mono text-base font-semibold text-gray-900">
                  {WECHAT_ID}
                </p>
              </div>

              {/* Ukraine Phone — last in the list */}
              <div className="rounded-2xl border border-gray-200 p-6 text-center sm:col-span-2 lg:col-span-3 lg:max-w-xl lg:mx-auto lg:w-full">
                <Phone className="h-8 w-8 mx-auto mb-4 text-[#006D77]" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {locale === "ua" ? "Україна" : locale === "ru" ? "Украина" : "Ukraine"}
                </h3>
                <a
                  href={`tel:${content.ukrainePhone.replace(/\s/g, "")}`}
                  className="text-[#006D77] hover:text-[#005a63] font-medium"
                >
                  {content.ukrainePhone}
                </a>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
                  {content.ukrainePhoneNote}
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

