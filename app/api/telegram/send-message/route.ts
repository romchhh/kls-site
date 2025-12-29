import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formType, data, locale, pageUrl } = body;

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Telegram bot credentials not configured", {
        hasBotToken: !!BOT_TOKEN,
        hasChatId: !!CHAT_ID,
      });
      return NextResponse.json(
        { 
          error: "Telegram bot not configured",
          message: "BOT_TOKEN or CHAT_ID missing in environment variables"
        },
        { status: 500 }
      );
    }

    // Форматуємо повідомлення
    const timestamp = new Date().toLocaleString("uk-UA", {
      timeZone: "Europe/Kyiv",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const localeLabels: Record<string, string> = {
      ua: "🇺🇦 Українська",
      ru: "🇷🇺 Російська",
      en: "🇬🇧 English",
    };

    const localeLabel = localeLabels[locale] || locale || "Не вказано";

    let message = `🔔 <b>Нова заявка з сайту</b>\n\n`;
    message += `📋 <b>Тип форми:</b> ${formType}\n`;
    message += `🌐 <b>Мова:</b> ${localeLabel}\n`;
    message += `🕐 <b>Час:</b> ${timestamp}\n`;
    
    if (pageUrl) {
      message += `🔗 <b>Сторінка:</b> ${pageUrl}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Додаємо дані форми в залежності від типу
    switch (formType) {
      case "contact":
        message += `👤 <b>Ім'я:</b> ${data.name || "Не вказано"}\n`;
        message += `📞 <b>Телефон:</b> ${data.phoneCode || ""} ${data.phone || "Не вказано"}\n`;
        break;

      case "cost_calculation":
        message += `👤 <b>Ім'я:</b> ${data.name || "Не вказано"}\n`;
        message += `📞 <b>Телефон:</b> ${data.phoneCode || ""} ${data.phone || "Не вказано"}\n`;
        const deliveryTypeLabels: Record<string, string> = {
          air: "Авіа",
          sea: "Море",
          rail: "Залізниця",
          multimodal: "Мультимодальна",
        };
        const deliveryTypeLabel = deliveryTypeLabels[data.deliveryType] || data.deliveryType || "Не вказано";
        message += `📦 <b>Тип доставки:</b> ${deliveryTypeLabel}\n`;
        message += `📍 <b>Звідки:</b> ${data.origin || "Не вказано"}\n`;
        message += `🎯 <b>Куди:</b> ${data.destination || "Не вказано"}\n`;
        if (data.weight) message += `⚖️ <b>Вага:</b> ${data.weight} кг\n`;
        if (data.volume) message += `📦 <b>Об'єм:</b> ${data.volume} м³\n`;
        if (data.productName) message += `🏷️ <b>Назва товару:</b> ${data.productName}\n`;
        if (data.contactFormat) message += `💬 <b>Формат зв'язку:</b> ${data.contactFormat}\n`;
        break;

      case "contact_modal":
        message += `👤 <b>Ім'я:</b> ${data.name || "Не вказано"}\n`;
        message += `📧 <b>Email:</b> ${data.email || "Не вказано"}\n`;
        message += `📞 <b>Телефон:</b> ${data.phone || "Не вказано"}\n`;
        if (data.message) message += `💬 <b>Повідомлення:</b> ${data.message}\n`;
        if (data.calculationResult) {
          message += `\n📊 <b>Результат розрахунку:</b>\n`;
          message += `   • Маршрут: ${data.calculationResult.origin} → ${data.calculationResult.destination}\n`;
          message += `   • Тип доставки: ${data.calculationResult.deliveryType}\n`;
          message += `   • Вартість: $${data.calculationResult.estimatedCost}\n`;
          message += `   • Термін: ${data.calculationResult.estimatedDays} днів\n`;
        }
        break;

      case "contact_quick":
        message += `📞 <b>Телефон:</b> ${data.phone || "Не вказано"}\n`;
        break;

      case "contact-full":
        message += `👤 <b>Ім'я:</b> ${data.name || "Не вказано"}\n`;
        message += `📧 <b>Email:</b> ${data.email || "Не вказано"}\n`;
        message += `📞 <b>Телефон:</b> ${data.phoneCode || ""} ${data.phone || "Не вказано"}\n`;
        if (data.message) message += `💬 <b>Повідомлення:</b> ${data.message}\n`;
        break;

      default:
        // Загальний випадок - виводимо всі дані
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .trim();
            message += `${label}: ${value}\n`;
          }
        });
    }

    // Відправляємо повідомлення в Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    let response;
    try {
      response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });
    } catch (fetchError: any) {
      // Якщо помилка мережі (наприклад, в dev режимі без доступу до інтернету)
      console.error("Network error sending to Telegram:", {
        error: fetchError.message,
        code: fetchError.code,
        hostname: fetchError.cause?.hostname,
        url: telegramUrl.replace(BOT_TOKEN, "***"),
        hasBotToken: !!BOT_TOKEN,
        hasChatId: !!CHAT_ID,
        chatId: CHAT_ID,
      });
      
      // В dev режимі або при проблемах з мережею - логуємо, але не блокуємо форму
      // На продакшені це має працювати, якщо є доступ до інтернету
      return NextResponse.json(
        { 
          success: false, 
          error: "Network error", 
          message: "Failed to send to Telegram, but form was processed",
          details: fetchError.message,
          note: "Check BOT_TOKEN and CHAT_ID in .env file and ensure server has internet access"
        },
        { status: 200 } // Повертаємо 200, щоб форма не показувала помилку користувачу
      );
    }

    const result = await response.json();

    if (!response.ok) {
      console.error("Telegram API error:", {
        status: response.status,
        statusText: response.statusText,
        result: result,
        botTokenLength: BOT_TOKEN?.length,
        chatId: CHAT_ID,
      });
      return NextResponse.json(
        { 
          error: "Failed to send message to Telegram", 
          details: result,
          message: result.description || "Unknown Telegram API error"
        },
        { status: 500 }
      );
    }

    console.log("Successfully sent message to Telegram:", {
      messageId: result.result?.message_id,
      chatId: CHAT_ID,
      formType,
    });

    return NextResponse.json({ 
      success: true, 
      messageId: result.result?.message_id,
      chatId: CHAT_ID 
    });
  } catch (error: any) {
    console.error("Error sending Telegram message:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

