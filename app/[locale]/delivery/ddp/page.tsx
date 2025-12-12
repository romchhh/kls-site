import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Доставка вантажів на умовах DDP/DDU",
    dduTitle: "DDU — доставка до країни отримувача без сплати мит і податків",
    dduIntro: "Ми доставляємо ваш товар до пункту призначення, а імпортні платежі та митне оформлення оплачуєте - ви.",
    dduWhatIncludes: "Що може включати DDU:",
    dduServices: [
      "Забір товару з фабрики",
      "Пакування та відправлення",
      "Міжнародна доставка (авіа / море / залізниця)",
      "Передача вантажу митниці країни імпорту",
    ],
    dduPays: "Що оплачує отримувач:",
    dduPaysList: [
      "мита та податки",
      "митний брокер",
      "локальні збори",
    ],
    dduForWhom: "Кому підходить DDU:",
    dduClients: [
      "Тим, хто має власну компанію або імпортера",
      "Тим, хто хоче сам контролювати митне оформлення",
      "Тим, кому потрібна дешевша альтернатива DDP",
    ],
    ddpTitle: "DDP — це повна доставка \"під ключ\"",
    ddpIntro: "Від фабрики в Китаї до складу отримувача з уже сплаченими митами та податками. Ми беремо на себе весь логістичний процес, а ви отримуєте готовий товар без бюрократії та додаткових витрат.",
    ddpWhatIncludes: "Що може входити у DDP:",
    ddpServices: [
      "Забір товару з фабрики",
      "Пакування та маркування",
      "Міжнародна доставка (авіа / море / залізниця)",
      "Митне оформлення та сплата податків",
      "Domestic-доставка до кінцевого складу (в т.ч. Amazon FBA)",
    ],
    ddpAdvantages: "Переваги:",
    ddpAdvantagesList: [
      "Фіксована ціна без прихованих платежів",
      "Жодних дій з боку отримувача",
      "Повна відповідальність за весь процес",
      "Ідеально для Amazon FBA та e-commerce",
    ],
    cta: "Зв'яжіться з нами — зробимо точний розрахунок під вашу партію.",
  },
  ru: {
    title: "Доставка грузов на условиях DDP/DDU",
    dduTitle: "DDU — доставка до страны получателя без уплаты пошлин и налогов",
    dduIntro: "Мы доставляем ваш товар до пункта назначения, а импортные платежи и таможенное оформление оплачиваете - вы.",
    dduWhatIncludes: "Что может включать DDU:",
    dduServices: [
      "Забор товара с фабрики",
      "Упаковка и отправка",
      "Международная доставка (авиа / море / железная дорога)",
      "Передача груза таможне страны импорта",
    ],
    dduPays: "Что оплачивает получатель:",
    dduPaysList: [
      "пошлины и налоги",
      "таможенный брокер",
      "локальные сборы",
    ],
    dduForWhom: "Кому подходит DDU:",
    dduClients: [
      "Тем, кто имеет собственную компанию или импортера",
      "Тем, кто хочет сам контролировать таможенное оформление",
      "Тем, кому нужна более дешевая альтернатива DDP",
    ],
    ddpTitle: "DDP — это полная доставка \"под ключ\"",
    ddpIntro: "От фабрики в Китае до склада получателя с уже уплаченными пошлинами и налогами. Мы берем на себя весь логистический процесс, а вы получаете готовый товар без бюрократии и дополнительных расходов.",
    ddpWhatIncludes: "Что может входить в DDP:",
    ddpServices: [
      "Забор товара с фабрики",
      "Упаковка и маркировка",
      "Международная доставка (авиа / море / железная дорога)",
      "Таможенное оформление и уплата налогов",
      "Domestic-доставка до конечного склада (в т.ч. Amazon FBA)",
    ],
    ddpAdvantages: "Преимущества:",
    ddpAdvantagesList: [
      "Фиксированная цена без скрытых платежей",
      "Никаких действий со стороны получателя",
      "Полная ответственность за весь процесс",
      "Идеально для Amazon FBA и e-commerce",
    ],
    cta: "Свяжитесь с нами — сделаем точный расчет под вашу партию.",
  },
  en: {
    title: "Delivery of Goods on DDP / DDU Terms",
    dduTitle: "DDU — delivery to recipient country without payment of duties and taxes",
    dduIntro: "We deliver your goods to the destination, and you pay import payments and customs clearance.",
    dduWhatIncludes: "What DDU may include:",
    dduServices: [
      "Product pickup from factory",
      "Packaging and shipping",
      "International delivery (air / sea / rail)",
      "Transfer of cargo to customs of import country",
    ],
    dduPays: "What the recipient pays:",
    dduPaysList: [
      "duties and taxes",
      "customs broker",
      "local fees",
    ],
    dduForWhom: "For whom DDU suits:",
    dduClients: [
      "Those who have their own company or importer",
      "Those who want to control customs clearance themselves",
      "Those who need a cheaper alternative to DDP",
    ],
    ddpTitle: "DDP — full turnkey delivery",
    ddpIntro: "From factory in China to recipient warehouse with already paid duties and taxes. We take care of the entire logistics process, and you get ready goods without bureaucracy and additional costs.",
    ddpWhatIncludes: "What may be included in DDP:",
    ddpServices: [
      "Product pickup from factory",
      "Packaging and labeling",
      "International delivery (air / sea / rail)",
      "Customs clearance and tax payment",
      "Domestic delivery to final warehouse (including Amazon FBA)",
    ],
    ddpAdvantages: "Advantages:",
    ddpAdvantagesList: [
      "Fixed price without hidden payments",
      "No actions required from recipient",
      "Full responsibility for entire process",
      "Perfect for Amazon FBA and e-commerce",
    ],
    cta: "Contact us — we'll make an accurate calculation for your batch.",
  },
};

export default async function DDPDeliveryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const data = content[locale];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="mb-12 text-4xl font-bold text-gray-900">{data.title}</h1>
          
          {/* DDU Section */}
          <div className="mb-16 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{data.dduTitle}</h2>
            <p className="mb-8 text-lg text-gray-600">{data.dduIntro}</p>
            
            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.dduWhatIncludes}</h3>
                <ul className="space-y-2">
                  {data.dduServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-blue-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.dduPays}</h3>
                <ul className="space-y-2">
                  {data.dduPaysList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-blue-600">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.dduForWhom}</h3>
              <ul className="space-y-2">
                {data.dduClients.map((client, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-blue-600">-</span>
                    <span className="text-gray-600">{client}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DDP Section */}
          <div className="mb-12 rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{data.ddpTitle}</h2>
            <p className="mb-8 text-lg text-gray-600">{data.ddpIntro}</p>
            
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.ddpWhatIncludes}</h3>
              <ul className="space-y-2">
                {data.ddpServices.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-teal-600">•</span>
                    <span className="text-gray-600">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.ddpAdvantages}</h3>
              <ul className="space-y-2">
                {data.ddpAdvantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✔</span>
                    <span className="text-gray-700">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-8">
            <p className="text-lg font-semibold text-gray-900">{data.cta}</p>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

