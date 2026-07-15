# Finova — Landing sayt

Buxgalteriya konsalting kompaniyasi uchun bir sahifali landing sayt.
**Accounting. Advisory. Growth.**

Sof HTML + CSS + JavaScript (framework va build-siz) — istalgan statik hostingga
yuklab qo'yish kifoya, hech qanday server talab qilinmaydi.

Sayt **ikki tilli**: o'zbekcha (asosiy) va ruscha.

## Tuzilma

```
finova/
├── index.html              # O'zbekcha sahifa (lang="uz")
├── ru/
│   ├── index.html          # Ruscha sahifa (lang="ru")
│   └── site.webmanifest    # Ruscha PWA manifest
├── robots.txt              # Qidiruv botlari uchun
├── sitemap.xml             # Ikkala til + hreflang
├── site.webmanifest        # O'zbekcha PWA manifest
└── assets/                 # Ikkala sahifa uchun UMUMIY
    ├── css/styles.css      # Design-system (ranglar logotipdan olingan)
    ├── js/main.js          # Menyu, forma, animatsiyalar, FAQ
    └── img/                # Logotip variantlari, favicon, OG-rasm
```

## Ikki til bilan ishlash

Har bir til — **alohida statik sahifa** (SPA yoki JS-almashtirgich emas). Sabab: Google
har ikkala tilni alohida indekslaydi, bu B2B buxgalteriya bozorida rus tilidagi
qidiruvlar uchun muhim.

**Har bir sahifada:**

| Element | `index.html` | `ru/index.html` |
|---|---|---|
| `<html lang>` | `uz` | `ru` |
| canonical | `https://finovagroup.uz/` | `https://finovagroup.uz/ru/` |
| `og:locale` | `uz_UZ` | `ru_RU` |
| JSON-LD | o'zbekcha | ruscha (`inLanguage: ru`) |
| assets yo'li | `assets/...` | `../assets/...` |

Ikkala sahifada ham `hreflang` (uz / ru / x-default) havolalari bor va header'da
`UZ | RU` almashtirgich turadi.

> ⚠️ **Muhim:** kontent o'zgarsa, uni **ikkala** `index.html` da ham yangilash kerak.
> Bu alohida sahifalar yondashuvining narxi — build bosqichi yo'q, avtomatik sinxronlash yo'q.

**FAQ o'zgartirilsa:** matn `<details>` bloklarida va `FAQPage` JSON-LD ichida
**bir xil** bo'lishi shart — aks holda Google structured-data xatosi beradi.

**JS matnlari** (burger tugmasi aria-label'i va `mailto:` xati) `assets/js/main.js`
boshidagi `STRINGS` obyektida — sahifaning `<html lang>` atributiga qarab tanlanadi.
Yangi til qo'shsangiz, o'sha yerga ham kalit qo'shing.

## Lokal ko'rish

```bash
cd finova
python3 -m http.server 4180
# http://localhost:4180      — o'zbekcha
# http://localhost:4180/ru/  — ruscha
```

## Deploy

Statik hosting yetarli: Netlify, Vercel, GitHub Pages, Cloudflare Pages yoki
oddiy nginx. Papkani to'liq yuklang — build bosqichi yo'q.

**Domen ulangach** quyidagi joylarda `https://finovagroup.uz/` ni haqiqiy domenga
almashtiring (agar domen boshqa bo'lsa):

- `index.html` va `ru/index.html` — `<link rel="canonical">`, `hreflang` havolalari,
  `og:url`, `og:image`, `twitter:image`, JSON-LD ichidagi `url`/`logo`/`image`
- `robots.txt` — `Sitemap:` qatori
- `sitemap.xml` — ikkala `<loc>` va `xhtml:link` hreflang'lari
- `site.webmanifest` / `ru/site.webmanifest` — `start_url`

## Design-system

| Rang | Qiymat | Ishlatilishi |
|---|---|---|
| Navy | `#121A2A` | Asosiy matn, tungi fonlar |
| Blue | `#6280B4` | Asosiy aksent, tugmalar |
| Sky | `#879FCA` | Yordamchi aksent |
| Snow | `#F7F7F9` | Och fon |

Shriftlar: **Poppins** (sarlavhalar, logotip matni), **Inter** (asosiy matn) — Google Fonts.

## Aloqa forma

Forma backend'siz ishlaydi: validatsiyadan so'ng `mailto:` orqali tayyor xat
ochadi (qabul qiluvchi: `komilova.nazira13@mail.com`). Agar keyinchalik haqiqiy
backend (Telegram bot, Formspree, o'z API) ulamoqchi bo'lsangiz —
`assets/js/main.js` dagi `form.addEventListener("submit", ...)` blokini almashtiring.

## Kontent

Statistika (8+ yil, 120+ mijoz...), tariflar narxi va mijoz fikrlari —
namunaviy matnlar. Haqiqiy raqamlar bilan `index.html` da yangilang.
