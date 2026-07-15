# Finova — Telegram Worker (Cloudflare)

Kontakt formasidan kelgan arizani Telegram guruhiga yuboradigan kichik server.
Bot tokeni **brauzerga chiqmaydi** — u faqat shu Worker ichida (maxfiy o'zgaruvchi) saqlanadi.

- Bepul (kuniga 100 000 so'rovgacha), **bank kartasi kerak emas**.
- Konfiguratsiya: repodagi [`wrangler.toml`](../wrangler.toml). Kirish nuqtasi: [`worker.js`](worker.js).

---

## A usuli — GitHub'dan avtomatik deploy (tavsiya etiladi)

Bunda har `git push` da Worker o'zi qayta deploy bo'ladi.

### 1. Kodni GitHub'ga yuboring
`worker/worker.js` va `wrangler.toml` `mcodevs/finova` reponing `main` bar­mog'ida bo'lishi shart.

### 2. Cloudflare'da Worker yarating
1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Import a repository**.
2. `mcodevs/finova` reposini tanlang.
3. Sozlamalar:
   - **Project name:** `finova-lead`
   - **Build command:** bo'sh qoldiring
   - **Deploy command:** `npx wrangler deploy`
4. **Deploy** bosing. (Birinchi deploy `BOT_TOKEN` yo'qligi sabab ishlaydi, lekin xabar yubora olmaydi — 3-qadam buni to'g'rilaydi.)

### 3. Maxfiy tokenni qo'shing
Worker sahifasida **Settings** → **Variables and Secrets** → **Add**:

| Nom | Turi | Qiymat |
|-----|------|--------|
| `BOT_TOKEN` | **Secret** (Encrypt) | Telegram bot tokeningiz |

> `CHAT_ID` va `ALLOWED_ORIGINS` allaqachon `wrangler.toml` da bor — ularni qo'lda qo'shish shart emas.
> `BOT_TOKEN` ni esa **hech qachon** `wrangler.toml` ga yozmang (git'ga tushib ketadi).

Secret qo'shilgach Worker avtomatik yangilanadi.

### 4. Botni guruhga qo'shing
Telegram'da botingizni **guruhga a'zo** qiling (yaxshisi — admin). Bot guruhda bo'lmasa xabar yubora olmaydi.

### 5. Worker URL manzilini saytga qo'ying
Worker sahifasidagi manzilni oling, masalan:

```
https://finova-lead.SIZNING-SUBDOMEN.workers.dev
```

Uni [`assets/js/main.js`](../assets/js/main.js) dagi `WORKER_URL` ga qo'ying:

```js
const WORKER_URL = "https://finova-lead.SIZNING-SUBDOMEN.workers.dev";
```

So'ng saytni qayta deploy qiling: `firebase deploy --only hosting`.

---

## B usuli — dashboard'ga copy-paste (Git'siz, muqobil)

Reponi ulashni istamasangiz: Cloudflare'da **Create Worker** → **Edit code** → butun [`worker.js`](worker.js) ni ko'chirib joylang → **Deploy**. So'ng yuqoridagi **3–5** qadamlarni bajaring (`CHAT_ID` ni ham qo'lda `Text` o'zgaruvchi sifatida qo'shing, chunki bu usulda `wrangler.toml` ishlatilmaydi).

---

## Tekshirish

Terminalda (URL o'zingiznikiga almashtiring):

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
| `{"ok":false,"error":"forbidden_origin"}` | So'rov `ALLOWED_ORIGINS` ro'yxatidagi domendan kelmagan. `wrangler.toml` dagi ro'yxatni yangilang. |
| `{"ok":false,"error":"server_misconfig"}` | `BOT_TOKEN` Secret qo'shilmagan. |
| Saytdan yuborilmayapti | `main.js` dagi `WORKER_URL` to'g'ri to'ldirilganini tekshiring. |

### `CHAT_ID` ni qanday aniqlash

Agar `-5231087147` ishlamasa: botni guruhga qo'shing, guruhda biror xabar yozing, so'ng brauzerda oching
(`<TOKEN>` o'rniga tokeningiz):

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

Javobdagi `"chat":{"id": ...}` — aynan shu son (odatda `-100...`). Uni `wrangler.toml` dagi `CHAT_ID` ga yozing.
