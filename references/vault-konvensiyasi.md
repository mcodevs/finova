---
name: vault-konvensiyasi
description: "Obsidian vault ildizi = ~/my_projects; MEMORY.md + references/ nota formati va wiki-link noaniqlik tuzoqlari"
metadata:
  type: project
---

# Vault va nota konvensiyasi

2026-07-16 da aniqlangan. Bu qoidalar **hamma loyihalarga** tegishli, faqat finova'ga emas.

## Vault ildizi = `/Users/mcodevs/my_projects/`

Obsidian vault — aynan loyihalar papkasining o'zi. Ya'ni har bir loyihaning `MEMORY.md` va
`references/*.md` fayllari **allaqachon vault ichidagi notalar**. Alohida nusxa ko'chirish
SHART EMAS — repoda faylni yozsangiz, u o'sha zahoti Obsidian notasi bo'ladi.

## Format

**`<loyiha>/MEMORY.md`** — indeks. Frontmatter **yo'q**, oddiy markdown havolalar:
`[references/x.md](references/x.md)`.

**`<loyiha>/references/*.md`** — notalar. Har birida:

```yaml
---
name: <fayl-nomi-kebab-case>
description: "bir qatorli mazmun"
metadata:
  type: project
---
```
Matn ichida o'zaro havolalar `[[wiki-link]]` bilan, oxirida esa:
`Related: [[a]] · [[b]] · [MEMORY.md](../MEMORY.md)`.

## ⚠️ Tuzoq: `[[MEMORY]]` ishlatmang

Har bir loyihada `MEMORY.md` bor, shuning uchun `[[MEMORY]]` **noaniq** — Obsidian uni
tasodifiy bitta loyihaga ulaydi. Amalda shunday bo'lgan ham: `chaqqon_chaqqon` notalaridagi
`[[MEMORY]]` **finova/MEMORY.md** ga ulanib turgan edi (2026-07-16 da tuzatildi).

**To'g'ri yo'l:** `[MEMORY.md](../MEMORY.md)` — nisbiy markdown havola. Aniq ishlaydi va
GitHub'da ham ko'rinadi.

## Qisqa `[[wiki-link]]` faqat nom noyob bo'lsa

`[[deploy]]` kabi qisqa havola vault bo'ylab nom noyob bo'lsagina ishonchli. Yangi nota
qo'shishdan oldin tekshiring:

```bash
cd ~/my_projects && for d in */references; do for f in "$d"/*.md; do
  echo "$(basename "$f" .md)  <-  $d"; done; done 2>/dev/null | sort
```

## ⚠️ `~/.claude/.../memory/` da qolib ketgan notalar bor

Claude'ning ichki xotirasi — `~/.claude/projects/<loyiha-slug>/memory/` — vaultdan **alohida**.
U yerdagi nota vaultga avtomatik ko'chmaydi. Natijada vault notasida uzilgan havola paydo
bo'lishi mumkin: `chaqqon_chaqqon` da `[[verify-on-android-emulator]]` aynan shunday edi —
nota `~/.claude` da bor, vaultda yo'q (2026-07-16 da ko'chirildi).

Uzilgan havola ko'rsangiz, o'chirishdan oldin `~/.claude/projects/*/memory/` ni tekshiring —
nota yo'qolmagan, shunchaki ko'chirilmagan bo'lishi mumkin.

## Uzilgan havolalarni tekshirish

```bash
cd ~/my_projects/<loyiha> && grep -roh "\[\[[^]|]*\]\]" references/ | tr -d '[]' | sort -u |
  while read n; do [ -f "references/$n.md" ] && echo "OK $n" || echo "UZILGAN $n"; done
```

---

Related: [[loyiha]] · [[ochiq-ishlar]] · [MEMORY.md](../MEMORY.md)
