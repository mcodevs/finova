---
name: loyiha
description: "Finova landing — brend, haqiqiy kontaktlar, fayl tuzilmasi, git va lokal ishga tushirish"
metadata:
  type: project
---

# Loyiha va brend

Finova — Toshkentdagi buxgalteriya konsalting kompaniyasi. Shior: **Accounting. Advisory. Growth.**
Sayt — bir sahifali landing, 2026-07-13 da qurilgan.

## Brend

| Rang | Qiymat | Ishlatilishi |
|---|---|---|
| Navy | `#121A2A` | Asosiy matn, tungi fonlar |
| Blue | `#6280B4` | Asosiy aksent, tugmalar |
| Sky | `#879FCA` | Yordamchi aksent |
| Snow | `#F7F7F9` | Och fon |

Ranglar logotipdan olingan. Shriftlar: **Poppins** (sarlavhalar, logotip matni) + **Inter**
(asosiy matn), Google Fonts orqali.

Logotip SVG faqat **belgidan** iborat (f harfi + 3 ustun) — "inova" yozuvi HTML matn sifatida
qayta tiklangan, ya'ni rasm ichida emas. Shuning uchun logotip yonidagi matnni o'zgartirish uchun
SVG emas, HTML tahrirlanadi.

## Kontaktlar (saytda ishlatiladigan haqiqiy ma'lumot)

- Telefon: **+998 95 663 66 60** (`tel:+998956636660`)
- Email: **komilova.nazira13@mail.com**
- Manzil: Toshkent sh., Yakkasaroy tumani, Kichik halqa yo'li, 8-uy
- Ish vaqti: Du–Ju, 09:00–18:00 (JSON-LD `openingHoursSpecification` da)

Bu ma'lumotlar bir necha joyda takrorlanadi: header, kontakt bo'limi, footer va **JSON-LD
structured data** (`AccountingService`). Kontakt o'zgarsa — `index.html` va `ru/index.html`
dagi hamma nusxani yangilash kerak.

## Texnik tanlov

Sof **HTML + CSS + JavaScript** — framework yo'q, build bosqichi yo'q, npm yo'q. Papkani statik
hostingga yuklash kifoya. Yagona server komponenti — kontakt forma uchun Cloudflare Worker
(qarang: [[telegram-worker]]).

## Fayl tuzilmasi

```
finova/
├── index.html              # O'zbekcha sahifa (lang="uz") — 611 qator
├── ru/
│   ├── index.html          # Ruscha sahifa (lang="ru") — 606 qator
│   └── site.webmanifest    # Ruscha PWA manifest
├── assets/                 # IKKALA sahifa uchun UMUMIY
│   ├── css/styles.css      # Design-system + hamma komponentlar
│   ├── js/main.js          # Menyu, forma, animatsiyalar, FAQ
│   └── img/                # Logotip variantlari, favicon, OG-rasm
├── worker/
│   ├── worker.js           # Cloudflare Worker (forma → Telegram)
│   └── README.md           # Worker'ni deploy qilish qo'llanmasi
├── wrangler.toml           # Worker konfiguratsiyasi (Git-deploy uchun)
├── firebase.json           # Hosting + cache sarlavhalari
├── .firebaserc             # Firebase loyihasi: finova-consulting
├── sitemap.xml             # Ikkala til + hreflang
├── robots.txt
├── site.webmanifest        # O'zbekcha PWA manifest
└── .claude/launch.json     # Lokal preview server (python3, port 4180)
```

## Lokal ishga tushirish

```bash
cd /Users/mcodevs/my_projects/finova
python3 -m http.server 4180
# http://localhost:4180      — o'zbekcha
# http://localhost:4180/ru/  — ruscha
```

Claude Code ichida: `.claude/launch.json` da `finova` nomli konfiguratsiya bor — `preview_start`
bilan `{name: "finova"}` chaqirilsa o'sha ishga tushadi.

## Git

- Repo: **`git@github.com:mcodevs/finova.git`** → https://github.com/mcodevs/finova
- Branch: `main`, SSH auth `mcodevs` orqali ishlaydi
- `.gitignore` chiqaradi: `.DS_Store`, `.firebase/` (deploy cache), `*.log`
- Commit qilinadi: `.firebaserc`, `firebase.json`, `.claude/launch.json`, `wrangler.toml`

> **Diqqat:** `main` ga har push Cloudflare Worker'ni avtomatik qayta deploy qiladi
> (qarang: [[telegram-worker]]). Firebase Hosting esa avtomatik EMAS —
> uni qo'lda `firebase deploy --only hosting` bilan yangilash kerak.

## Kontent haqida

Statistika (8+ yil, 120+ mijoz va h.k.), tariflar narxi va mijoz fikrlari — **namunaviy
matnlar**. Mijoz haqiqiy raqamlar bilan almashtirishi kutiladi.

## Muloqot tili

Foydalanuvchi bilan muloqot — **o'zbek tilida**. Kod izohlari va hujjatlar ham o'zbekcha.

---

Related: [[i18n]] · [[deploy]] · [[telegram-worker]] · [[ochiq-ishlar]] · [MEMORY.md](../MEMORY.md)
