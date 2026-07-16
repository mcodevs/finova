# Finova — loyiha xotirasi

Bu fayl — **indeks**. Batafsil ma'lumot `references/` papkasida. Ishni boshlashdan oldin shu
yerdan kerakli faylni oching.

> `README.md` — omma uchun (GitHub'da ko'rinadi). Bu fayl va `references/` — ichki ish xotirasi:
> qarorlar, sabablar, holat va tuzoqlar.

## Indeks

- [Loyiha va brend](references/loyiha.md) — Finova kim, brend ranglari/shriftlari, haqiqiy kontaktlar, fayl tuzilmasi, lokal ishga tushirish, git
- [Ikki tillilik (uz/ru)](references/i18n.md) — alohida statik sahifalar; **kontent o'zgarsa ikkala `index.html` ni ham qo'lda yangilash shart**; auto-redirect ataylab rad etilgan
- [Deploy va domen](references/deploy.md) — Firebase Hosting qo'lda deploy; **`finovagroup.uz` hali ulanmagan** (SSL cert chiqmayapti) + SPF/pochta regressiyasi
- [Kontakt forma → Telegram](references/telegram-worker.md) — Cloudflare Worker + `@finova_report_bot`; **to'liq ishlaydi**; CHAT_ID tuzog'i shu yerda
- [Ochiq ishlar](references/ochiq-ishlar.md) — domen, DNS tozalash, token revoke, eskirgan README
- [Vault va nota konvensiyasi](references/vault-konvensiyasi.md) — **hamma loyihalarga tegishli**: vault ildizi = `~/my_projects`, nota formati, `[[MEMORY]]` tuzog'i

## Holat (2026-07-16)

| Nima | Holat |
|---|---|
| Sayt | ✅ jonli — https://finova-consulting.web.app |
| Kontakt forma → Telegram | ✅ uchidan-uchiga ishlaydi |
| Domen `finovagroup.uz` | ⚠️ **ulanmagan** — SSL sertifikat berilmagan |
| Domen pochtasi | ⚠️ buzuq (SPF yo'q, MX Firebase'ga ketadi) — kerakmi, tasdiqlanmagan |

## Tez eslatma

- **Muloqot tili — o'zbekcha.**
- Build yo'q, npm yo'q, framework yo'q. Sof HTML/CSS/JS.
- `git push` → Cloudflare Worker **avtomatik** deploy bo'ladi.
- Firebase Hosting esa **avtomatik emas** — `firebase deploy --only hosting` qo'lda.
- `BOT_TOKEN` hech qachon repoga yozilmaydi — u faqat Cloudflare Secret'ida.
