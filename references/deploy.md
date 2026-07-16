---
name: deploy
description: "Firebase Hosting holati + finovagroup.uz domeni ulanmagani (SSL cert chiqmayapti) va SPF/pochta regressiyasi"
metadata:
  type: project
---

# Deploy va domen

## Firebase Hosting (jonli)

- Loyiha: **`finova-consulting`** (hisob: keyingiavlod.tech@gmail.com)
- Jonli manzil: **https://finova-consulting.web.app** ✅ ishlaydi
- Deploy: `firebase deploy --only hosting` — **qo'lda**, git push bilan avtomatik EMAS

`firebase.json` da `public: "."` (repo rooti to'g'ridan-to'g'ri hosting qilinadi), `cleanUrls: true`,
va ignore ro'yxatida `worker/**`, `wrangler.toml`, `README.md`, `firebase.json`, `.firebaserc`,
`**/.*` — ya'ni server kodi hosting'ga chiqmaydi (tekshirilgan: `worker/worker.js` 404 qaytaradi).

### Cache sarlavhalari

| Nima | Cache-Control |
|---|---|
| HTML va boshqa hammasi (`**`) | `max-age=0, must-revalidate` |
| CSS / JS | `max-age=3600` (1 soat) |
| Rasmlar (svg/png/jpg/webp/ico) | `max-age=2592000` (30 kun) |

`cleanUrls` tufayli `/ru/` kabi manzillar `.html` bilan tugamaydi, shuning uchun HTML uchun
kengaytma bo'yicha glob ishlamaydi — standart `**` qoidasi bu vazifani bajaradi.

> CSS 1 soat keshlanadi — CSS o'zgartirib deploy qilsangiz, brauzerda eski nusxa qolishi mumkin.
> Shu sabab honeypot maydoni CSS emas, **inline `style`** bilan yashiriladi (commit `02e59f3`).

## Domen: finovagroup.uz — ⚠️ HALI ULANMAGAN

**Haqiqiy domen `finovagroup.uz`** (`finova.uz` EMAS). Barcha canonical / hreflang / og:url /
JSON-LD / sitemap allaqachon shunga sozlangan — kod tomonda hech narsa qilish kerak emas.

**Holat (2026-07-15 dagi oxirgi chuqur diagnostika):** DNS to'g'ri, lekin **SSL sertifikat
berilmagan** → brauzerda "connection is not private".

### Nima sog'lom (tekshirilgan: dig + curl + openssl)

- DNS yozuvlari to'g'ri va butun dunyoga tarqalgan: `A → 199.36.158.100`,
  `TXT → hosting-site=finova-consulting` (`8.8.8.8` da ham ko'rinadi)
- DNS provayderi — **ahost**. Domen **`rdns1/rdns2/rdns3.ahost.uz`** klasterida.
  Uchala NS UDP/TCP/EDNS'da sog'lom, `.uz` registri delegatsiyasi va glue mos, DNSSEC yo'q, CAA yo'q.
- HTTP so'rov Firebase edge'iga (Fastly / `Server: Varnish`) yetib boradi.

> **MUHIM:** eski `dns1/dns2.ahost.uz` va `ns1/ns2.ahost.cloud` bu domenga **aloqador EMAS** —
> ular hamon `REFUSED` qaytaradi, bu **normal**. Ularni tekshirmang, vaqt ketadi.
> Ishlaydigan diagnostika: `dig SOA finovagroup.uz @rdns1.ahost.uz` → `NOERROR`.

### Muammo nimada

HTTPS'da sertifikat `CN=firebaseapp.com` (Google Trust Services WR4) qaytadi, `finovagroup.uz`
emas. Firebase Console'da provisioning **"Needs setup / Hosting's DNS request failed"** da qotib
qolgan, shuning uchun cert chiqmayapti. Sabab yozuvlarda emas — Firebase backend'i ahost.uz
NS'lariga yakuniy so'rovni yubora olmayapti (tashqaridan hammasi sog'lom ko'rinadi).

Tarix: zona dastlab bir necha soat umuman yuklanmagan edi (barcha NS REFUSED, tashqi resolverlar
SERVFAIL); ahost ticketdan keyin domenni `rdns*` klasteriga ko'chirgan. Firebase'dagi banner
o'sha buzuq paytdan qolgan bo'lishi mumkin.

### Tavsiya etilgan reja (prioritet bo'yicha)

1. Firebase Console'da domenni **o'chirib, qayta qo'shish** — yangi provisioning majburlanadi.
   `.uz` domenlarida ko'p yordam beradi.
2. Status **"Connected"** bo'lishini kutish; cert 24 soatgacha cho'zilishi mumkin.
3. Agar Verify o'tmasa: https://dns.google/cache da `finovagroup.uz` uchun A/TXT/NS keshini
   flush qilish (Firebase Google DNS'dan foydalanadi, negative cache TTL 1 kungacha).
4. Qotib qolsa — **DNS'ni Cloudflare'ga ko'chirish** (bepul; Firebase Cloudflare NS'ga har doim
   yetadi, kafolatli yechim).

**"Ishladi" belgisi:** sertifikat `finovagroup.uz` uchun beriladi **va** Console "Connected".

### Domen ulangach qoladigan DNS ishlari

- **`www` CNAME hozir xato** — `finovagroup.uz` ga ishora qiladi, Firebase esa
  **`finova-consulting.web.app`** ni talab qiladi.
- **`ftp` CNAME** — eski hostingdan qolgan keraksiz yozuv, o'chirsa bo'ladi.

## ⚠️ Pochta / SPF regressiyasi (2026-07-15)

Firebase TXT'ini qo'shishda `@` dagi **eski TXT o'chirib yuborilgan** (ehtimol SPF `v=spf1...`
bo'lgan). Hozir **SPF umuman yo'q**, lekin DKIM + DMARC bor.

Tushuncha: **TXT yozuvlari A/CNAME kabi emas** — bir `@` ostida bir nechtasi birga yashaydi
(faqat ikkita `v=spf1` bo'lmasin). Firebase TXT'ini SPF bilan **yonma-yon** qo'yish kerak edi,
almashtirish emas.

Email hozir ikki tomondan buzuq:
- **Kiruvchi:** `MX @ → finovagroup.uz` va `mail CNAME` Firebase IP'siga ketadi — Firebase'da
  SMTP yo'q, ya'ni domen pochtasi ishlamaydi.
- **Chiquvchi:** SPF yo'q.

Foydalanuvchi bu domenda email ishlatadimi — **hali tasdiqlanmagan**. Ishlatsa: SPF qaytarish +
MX to'g'rilash kerak. (Saytdagi email `komilova.nazira13@mail.com` — bu domen pochtasi emas,
shuning uchun sayt bundan zarar ko'rmayapti.)

---

Related: [[ochiq-ishlar]] · [[loyiha]] · [[telegram-worker]] · [MEMORY.md](../MEMORY.md)
