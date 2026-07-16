---
name: telegram-worker
description: "Kontakt forma → Cloudflare Worker → Telegram guruhi; sozlamalar, deploy usuli va CHAT_ID tuzog'i"
metadata:
  type: project
---

# Kontakt forma → Telegram (Cloudflare Worker)

**Holat: to'liq ishlaydi** ✅ (2026-07-16 da uchidan-uchiga tekshirilgan: sayt → Worker → guruh).

## Yo'l

```
sayt formasi (assets/js/main.js)
  → POST JSON → https://finova-lead.keyingiavlod-tech.workers.dev  (worker/worker.js)
    → Telegram Bot API sendMessage
      → "FINOVA | Заявки" superguruhi
```

## Nima uchun aynan shunday

- **Nega proksi kerak:** bot tokeni brauzerga chiqmasligi kerak. Worker ichida `env.BOT_TOKEN`
  sifatida yashaydi, kodda hech qayerda hardcode qilinmagan.
- **Nega Firebase Functions emas:** Functions Blaze rejasini (bank kartasi) talab qiladi,
  foydalanuvchi karta ulashni istamadi. Cloudflare Worker bepul (kuniga 100 000 so'rov) va
  **karta so'ramaydi**.
- **Nega mailto emas:** avval forma `mailto:` ochardi (2026-07-16 da olib tashlandi) — mijoz
  uchun noqulay va arizalar yo'qolib ketardi.

## Sozlamalar

| Nima | Qiymat | Qayerda |
|---|---|---|
| Worker URL | `https://finova-lead.keyingiavlod-tech.workers.dev` | `assets/js/main.js` → `WORKER_URL` |
| Cloudflare project | `finova-lead` (hisob subdomeni `keyingiavlod-tech`) | Cloudflare dashboard |
| `CHAT_ID` | `-1004320903283` | `wrangler.toml` → `[vars]` (git'da) |
| `ALLOWED_ORIGINS` | finovagroup.uz, www, web.app, firebaseapp.com | `wrangler.toml` → `[vars]` (git'da) |
| `BOT_TOKEN` | — | **Cloudflare dashboard Secret** — git'ga TUSHMAYDI |

> `BOT_TOKEN` ni **hech qachon** `wrangler.toml` ga yozmang.

## Deploy usuli — Git-ulangan

Foydalanuvchi dashboard copy-paste emas, **"Import a repository"** usulini tanladi:
`mcodevs/finova` → project `finova-lead`, deploy command `npx wrangler deploy`.

**Ya'ni `main` ga har `git push` Worker'ni avtomatik qayta deploy qiladi.** `wrangler.toml`
o'zgarsa ham (masalan `CHAT_ID`) — push yetarli, qo'lda hech narsa qilish shart emas.
Redeploy tez (bir necha soniya).

## Bot

- **`@finova_report_bot`** — "FINOVA | BOT", id `8824736899`
- `can_read_all_group_messages: false` (privacy mode ON) — bu forma uchun muhim emas
- Bot **guruhga a'zo bo'lishi shart**, aks holda `sendMessage` ishlamaydi
- Foydalanuvchi Telegram: Murod Erkinov / @MCoDevs (id `5651631418`)

## CHAT_ID tarixi — takrorlanmasligi uchun

Dastlab `-5231087147` ishlatilgan va `400 chat not found` bergan. Sabab **ikki bosqichli** edi:

1. Bot guruhga qo'shilmagan edi — qo'shildi.
2. Guruh **basic group → superguruhga migratsiya** bo'lgan. Ikkalasi ham "FINOVA | Заявки" deb
   nomlangani chalg'itgan. Eski ID `-5231087147` **o'lik**; to'g'ri ID — **`-1004320903283`**
   (superguruh ID'lari `-100...` bilan boshlanadi).

Agar kelajakda yana `chat not found` chiqsa — avval botning guruhda ekanini, so'ng ID'ni
tekshiring:

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```
Javobdagi `"chat":{"id": ...}` — aynan shu son. `wrangler.toml` dagi `CHAT_ID` ga yozing va push qiling.

## Worker mantiqi (`worker/worker.js`)

- **CORS:** `ALLOWED_ORIGINS` ro'yxati. `OPTIONS` → 204, `GET` → 405, boshqa origin → 403.
- **Honeypot:** `company` maydoni to'lgan bo'lsa — bot deb hisoblanadi. `{ok:true}` qaytaradi
  (botni chalg'itish uchun), lekin Telegram'ga **hech narsa yubormaydi**.
- **Validatsiya:** `name` ≥ 2 belgi, `phone` ≥ 9 raqam. Aks holda 422.
- **Xavfsizlik:** `esc()` HTML `parse_mode` uchun `& < >` ni qochiradi (Telegram'da injection oldi).
- **Xabar:** uz/ru formatda, Toshkent vaqti bilan (`Intl.DateTimeFormat`, `Asia/Tashkent`).
- **Xatolar:** `bad_json` 400, `validation` 422, `server_misconfig` 500 (BOT_TOKEN yo'q),
  `telegram_unreachable` / `telegram_failed` 502.

## Forma mantiqi (`assets/js/main.js`)

Klient tomonda ham xuddi shu validatsiya, `is-invalid` klassi + `aria-invalid` + `role="alert"`
xato matni. Holatlar: loading (`Yuborilmoqda…`, tugma disabled) → success (forma reset) yoki
error. Xato matnida telefon raqam ko'rsatiladi, ya'ni Worker yiqilsa ham mijoz yo'qolmaydi.

Honeypot `company` maydoni **inline `style`** bilan yashiriladi, CSS klassi bilan emas —
CSS 1 soat keshlanadi, eski CSS bilan maydon ko'rinib qolishi mumkin edi (commit `02e59f3`).

## Tekshirish

```bash
curl -X POST https://finova-lead.keyingiavlod-tech.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://finovagroup.uz" \
  -d '{"name":"Test","phone":"+998901234567","service":"Test","message":"Salom","lang":"uz"}'
```
Kutilgan: `{"ok":true}` + guruhga xabar tushadi.

## Muammolar jadvali

| Belgisi | Sabab / yechim |
|---|---|
| `telegram_failed` | Bot guruhda emas, yoki `CHAT_ID` noto'g'ri (superguruh → `-100...`) |
| `forbidden_origin` | So'rov `ALLOWED_ORIGINS` dagi domendan kelmagan → `wrangler.toml` ni yangilang |
| `server_misconfig` | `BOT_TOKEN` Secret qo'shilmagan |
| Saytdan yuborilmayapti | `main.js` dagi `WORKER_URL` ni tekshiring |

---

Related: [[loyiha]] · [[i18n]] · [[deploy]] · [[ochiq-ishlar]] · [MEMORY.md](../MEMORY.md)
