# Finova — Telegram Worker (Cloudflare)

Kontakt formasidan kelgan arizani Telegram guruhiga yuboradigan kichik server.
Bot tokeni **brauzerga chiqmaydi** — u faqat shu Worker ichida (maxfiy o'zgaruvchi) saqlanadi.

## Nega Cloudflare Worker?

- Bepul (kuniga 100 000 so'rovgacha), **bank kartasi kerak emas**.
- Token himoyalangan qoladi.

---

## 1. Cloudflare akkaunt

1. https://dash.cloudflare.com — bepul ro'yxatdan o'ting (yoki kiring).
2. Chap menyuda **Workers & Pages** → **Create application** → **Create Worker**.
3. Nom bering, masalan `finova-lead`. **Deploy** bosing (hozircha shablon kod bilan).

## 2. Kodni joylash

1. Worker sahifasida **Edit code** (yoki **`</>` Edit code**) tugmasi.
2. Ochilgan muharrirdagi hamma kodni o'chirib, shu papkadagi [`worker.js`](worker.js) faylining **butun mazmunini** ko'chirib joylang.
3. Yuqoridagi **Deploy** (yoki **Save and deploy**) tugmasini bosing.

## 3. Maxfiy o'zgaruvchilarni qo'shish

Worker sahifasida **Settings** → **Variables and Secrets** (yoki **Variables**):

| Nom | Turi | Qiymat |
|-----|------|--------|
| `BOT_TOKEN` | **Secret** (Encrypt) | Telegram bot tokeningiz |
| `CHAT_ID` | Text | `-5231087147` (guruh ID) |
| `ALLOWED_ORIGINS` | Text (ixtiyoriy) | `https://finovagroup.uz,https://www.finovagroup.uz,https://finova-consulting.web.app` |

Har birini qo'shgach **Save / Deploy** bosing.

> ⚠️ `BOT_TOKEN` ni albatta **Secret** (Encrypt qilingan) sifatida qo'shing — Text emas.

## 4. Botni guruhga qo'shish

1. Telegram'da botingizni **guruhga a'zo qiling** (yaxshisi — admin qiling).
2. Bot guruhda bo'lmasa, xabar yubora olmaydi.

## 5. Worker URL manzilini olish

Worker sahifasining yuqorisida manzil bo'ladi, masalan:

```
https://finova-lead.SIZNING-SUBDOMEN.workers.dev
```

Shu manzilni ko'chiring va `assets/js/main.js` faylidagi `WORKER_URL` ga qo'ying:

```js
const WORKER_URL = "https://finova-lead.SIZNING-SUBDOMEN.workers.dev";
```

So'ng saytni qayta deploy qiling: `firebase deploy --only hosting`.

---

## Tekshirish

Terminalda (tokening o'rniga o'zingiznikini qo'ying) test so'rov:

```bash
curl -X POST https://finova-lead.SIZNING-SUBDOMEN.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://finovagroup.uz" \
  -d '{"name":"Test","phone":"+998901234567","service":"Test","message":"Salom","lang":"uz"}'
```

Kutilgan javob: `{"ok":true}` — va guruhga xabar tushadi.

## Muammolar

| Belgisi | Sabab / yechim |
|---------|----------------|
| `{"ok":false,"error":"telegram_failed"}` | Bot guruhda emas, yoki `CHAT_ID` noto'g'ri. Superguruh bo'lsa ID `-100...` bilan boshlanishi mumkin. |
| `{"ok":false,"error":"forbidden_origin"}` | So'rov `ALLOWED_ORIGINS` ro'yxatidagi domendan kelmagan. Domeningizni qo'shing. |
| `{"ok":false,"error":"server_misconfig"}` | `BOT_TOKEN` yoki `CHAT_ID` o'zgaruvchisi qo'shilmagan. |
| Saytdan yuborilmayapti | `main.js` dagi `WORKER_URL` to'g'ri to'ldirilganini tekshiring. |

### `CHAT_ID` ni qanday aniqlash

Agar `-5231087147` ishlamasa: botni guruhga qo'shing, guruhda biror xabar yozing, so'ng brauzerda oching
(`<TOKEN>` o'rniga tokeningiz):

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

Javobdagi `"chat":{"id": ...}` — aynan shu son (odatda `-100...`) sizning `CHAT_ID` ingiz.
