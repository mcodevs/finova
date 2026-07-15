/**
 * Finova — kontakt formasi → Telegram guruhi (Cloudflare Worker)
 * ---------------------------------------------------------------
 * Bu Worker saytdagi formadan kelgan arizani Telegram botiga uzatadi.
 * Bot tokeni brauzerga CHIQMAYDI — u faqat shu serverda (env) saqlanadi.
 *
 * Sozlanadigan muhit o'zgaruvchilari (Cloudflare dashboard → Settings → Variables):
 *   BOT_TOKEN        (Secret)  — Telegram bot tokeni
 *   CHAT_ID          (Text)    — guruh/kanal ID, masalan: -5231087147
 *   ALLOWED_ORIGINS  (Text)    — vergul bilan ajratilgan ruxsat etilgan domenlar (ixtiyoriy)
 *
 * Batafsil: shu papkadagi README.md ni o'qing.
 */

const FALLBACK_ORIGINS = [
  "https://finovagroup.uz",
  "https://www.finovagroup.uz",
  "https://finova-consulting.web.app",
  "https://finova-consulting.firebaseapp.com",
];

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS
      ? env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
      : FALLBACK_ORIGINS);

    const origin = request.headers.get("Origin") || "";
    const allowOrigin = allowed.includes(origin) ? origin : allowed[0];
    const cors = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, cors);
    }
    // Faqat ruxsat etilgan domendan (brauzer Origin yuboradi)
    if (origin && !allowed.includes(origin)) {
      return json({ ok: false, error: "forbidden_origin" }, 403, cors);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "bad_json" }, 400, cors);
    }

    // Honeypot: odam ko'rmaydigan "company" maydoni. To'lgan bo'lsa — bot.
    // Muvaffaqiyat kabi javob beramiz, lekin hech narsa yubormaymiz.
    if (clean(data.company, 100)) {
      return json({ ok: true }, 200, cors);
    }

    const name = clean(data.name, 100);
    const phone = clean(data.phone, 40);
    const service = clean(data.service, 150);
    const message = clean(data.message, 2000);
    const lang = data.lang === "ru" ? "ru" : "uz";

    if (name.length < 2 || phone.replace(/\D/g, "").length < 9) {
      return json({ ok: false, error: "validation" }, 422, cors);
    }
    if (!env.BOT_TOKEN || !env.CHAT_ID) {
      return json({ ok: false, error: "server_misconfig" }, 500, cors);
    }

    const text = buildMessage({ name, phone, service, message, lang });

    let tgRes;
    try {
      tgRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
    } catch (e) {
      return json({ ok: false, error: "telegram_unreachable" }, 502, cors);
    }

    if (!tgRes.ok) {
      const detail = await tgRes.text().catch(() => "");
      return json({ ok: false, error: "telegram_failed", detail }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};

/* ---------- yordamchilar ---------- */

function clean(v, max) {
  return String(v == null ? "" : v).trim().slice(0, max);
}

// HTML parse_mode uchun maxsus belgilarni xavfsizlantirish
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors },
  });
}

function buildMessage({ name, phone, service, message, lang }) {
  const L = lang === "ru"
    ? {
        title: "🆕 Новая заявка с сайта Finova",
        name: "👤 Имя",
        phone: "📞 Телефон",
        service: "🧾 Услуга",
        message: "💬 Сообщение",
        time: "🕒 Время",
        empty: "—",
        locale: "ru-RU",
      }
    : {
        title: "🆕 Finova saytidan yangi ariza",
        name: "👤 Ism",
        phone: "📞 Telefon",
        service: "🧾 Xizmat",
        message: "💬 Xabar",
        time: "🕒 Vaqt",
        empty: "—",
        locale: "uz-UZ",
      };

  let when = "";
  try {
    when = new Intl.DateTimeFormat(L.locale, {
      timeZone: "Asia/Tashkent",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    when = "";
  }

  const lines = [
    `<b>${L.title}</b>`,
    ``,
    `${L.name}: <b>${esc(name)}</b>`,
    `${L.phone}: <code>${esc(phone)}</code>`,
    `${L.service}: ${esc(service || L.empty)}`,
    `${L.message}: ${esc(message || L.empty)}`,
  ];
  if (when) lines.push(``, `${L.time}: ${esc(when)} (Toshkent)`);

  return lines.join("\n");
}
