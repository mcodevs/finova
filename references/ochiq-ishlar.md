---
name: ochiq-ishlar
description: "Finova bo'yicha qolgan ishlar (2026-07-16): domen ulash, DNS tozalash, SPF, token revoke, eskirgan README"
metadata:
  type: project
---

# Ochiq ishlar

Holat: 2026-07-16.

## 1. Domen `finovagroup.uz` ulanmagan — ⚠️ eng muhim

Sayt faqat https://finova-consulting.web.app da ishlaydi. SSL sertifikat berilmagan, Firebase
provisioning "Needs setup" da qotib qolgan. To'liq diagnostika va reja: [[deploy]],
"Domen" bo'limi.

Keyingi qadam: Firebase Console'da domenni **o'chirib, qayta qo'shish**.

## 2. Domen ulangach — DNS tozalash

- `www` CNAME hozir `finovagroup.uz` ga ishora qiladi → **`finova-consulting.web.app`** bo'lishi kerak.
- `ftp` CNAME — eski hostingdan qolgan keraksiz yozuv, o'chirsa bo'ladi.

## 3. Pochta: SPF yo'q, MX buzuq

Firebase TXT qo'shishda `@` dagi eski SPF o'chib ketgan; MX esa Firebase IP'siga ketadi.
**Foydalanuvchi bu domenda email ishlatadimi — hali tasdiqlanmagan.** Ishlatmasa — muammo yo'q
(saytdagi email `komilova.nazira13@mail.com`, boshqa domen). Ishlatsa: SPF qaytarish + MX
to'g'rilash. Batafsil: [[deploy]], "Pochta / SPF regressiyasi" bo'limi.

## 4. Bot tokenini yangilash (ixtiyoriy, xavfsizlik)

Bot token ilgari chatda ochiq yozilgan. Tavsiya: BotFather `/revoke` bilan yangi token olish va
Cloudflare dashboard'dagi `BOT_TOKEN` Secret'iga yangisini qo'yish. **Hali qilinmagan.**
Token repoda yo'q, ya'ni bu shoshilinch emas.

## 5. `README.md` eskirgan

Kontakt forma bo'limi hali **`mailto:` haqida yozadi** — aslida forma 2026-07-16 dan beri
Cloudflare Worker orqali Telegram'ga yuboradi. Shuningdek fayl tuzilmasi jadvalida `worker/`,
`wrangler.toml`, `firebase.json` yo'q, Deploy bo'limida esa Firebase eslatilmagan.

`README.md` — omma uchun (GitHub'da ko'rinadi), bu `references/` esa ichki ish xotirasi.
README'ni yangilash kerak.

## 6. Namunaviy kontent

Statistika (8+ yil, 120+ mijoz...), tariflar narxi va mijoz fikrlari — o'ylab topilgan matnlar.
Mijoz haqiqiy raqamlarni berganda `index.html` **va** `ru/index.html` da yangilash kerak.

## 7. JSON-LD `sameAs` bo'sh

`AccountingService` da `"sameAs": []` — kompaniyaning Telegram/Instagram/Facebook sahifalari
bo'lsa, shu yerga qo'shilsa SEO uchun foydali.

---

Related: [[deploy]] · [[telegram-worker]] · [[loyiha]] · [MEMORY.md](../MEMORY.md)
