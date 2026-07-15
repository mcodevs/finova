(function () {
  "use strict";

  /* ---------- Matnlar: sahifaning <html lang> atributiga qarab tanlanadi ---------- */
  const STRINGS = {
    uz: {
      menuOpen: "Menyuni ochish",
      menuClose: "Menyuni yopish",
      submit: "Ariza yuborish",
      sending: "Yuborilmoqda…",
      sent: "✓ Arizangiz yuborildi! Tez orada siz bilan bog'lanamiz.",
      error: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki +998 95 663 66 60 raqamiga qo'ng'iroq qiling.",
    },
    ru: {
      menuOpen: "Открыть меню",
      menuClose: "Закрыть меню",
      submit: "Отправить заявку",
      sending: "Отправляется…",
      sent: "✓ Заявка отправлена! Мы свяжемся с вами в ближайшее время.",
      error: "Произошла ошибка. Попробуйте ещё раз или позвоните по номеру +998 95 663 66 60.",
    },
  };
  const t = STRINGS[document.documentElement.lang] || STRINGS.uz;
  const LANG = document.documentElement.lang === "ru" ? "ru" : "uz";

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  function closeMenu() {
    burger.classList.remove("is-open");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", t.menuOpen);
  }

  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    burger.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? t.menuClose : t.menuOpen);
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      burger.focus();
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
  }

  /* ---------- FAQ: only one open at a time ---------- */
  const faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Contact form → Telegram (Cloudflare Worker orqali) ---------- */
  // Worker'ni deploy qilgach, uning manzilini shu yerga qo'ying (worker/README.md).
  const WORKER_URL = "https://finova-lead.keyingiavlod-tech.workers.dev";

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector(".form__submit");

  const setFieldError = (input, errorEl, show) => {
    input.classList.toggle("is-invalid", show);
    input.setAttribute("aria-invalid", String(show));
    errorEl.hidden = !show;
  };

  const showStatus = (text, ok) => {
    status.textContent = text;
    status.classList.toggle("form__status--error", !ok);
    status.hidden = false;
  };

  const setLoading = (loading) => {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? t.sending : t.submit;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.hidden = true;

    const name = form.elements.name;
    const phone = form.elements.phone;
    const service = form.elements.service;
    const message = form.elements.message;
    const company = form.elements.company; // honeypot

    const nameError = document.getElementById("f-name-error");
    const phoneError = document.getElementById("f-phone-error");

    const nameOk = name.value.trim().length >= 2;
    const phoneDigits = phone.value.replace(/\D/g, "");
    const phoneOk = phoneDigits.length >= 9 && phoneDigits.length <= 13;

    setFieldError(name, nameError, !nameOk);
    setFieldError(phone, phoneError, !phoneOk);

    if (!nameOk || !phoneOk) {
      (nameOk ? phone : name).focus();
      return;
    }

    const payload = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      service: service.value,
      message: message.value.trim(),
      company: company ? company.value : "",
      lang: LANG,
    };

    setLoading(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "request_failed");

      showStatus(t.sent, true);
      form.reset();
    } catch (err) {
      showStatus(t.error, false);
    } finally {
      setLoading(false);
    }
  });

  ["input", "change"].forEach((evt) => {
    form.addEventListener(evt, (e) => {
      if (e.target.classList.contains("is-invalid")) {
        const errorEl = document.getElementById(e.target.id + "-error");
        if (errorEl) setFieldError(e.target, errorEl, false);
      }
    });
  });

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById("to-top");
  const toggleToTop = () => {
    toTop.hidden = window.scrollY < 600;
  };
  toggleToTop();
  window.addEventListener("scroll", toggleToTop, { passive: true });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
