/* ==========================================================================
   DAWSON LANDSCAPING & MAINTENANCE — script.js
   Vanilla JS only. No dependencies.
   Handles: sticky header, mobile nav, before/after sliders, scroll reveal,
            form UI state, CTA tracking hooks.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Sticky header ------------------------------------------ */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 2. Mobile navigation -------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- 3. Before / after sliders --------------------------------- *
   * Markup: .ba-viewer > img.ba-viewer__before, img.ba-viewer__after,
   *         .ba-handle, input.ba-range[type=range]
   * The "after" image is clipped with clip-path: inset(0 0 0 X%).
   * Pointer drag and the range input (keyboard/screen-reader accessible)
   * both write the same value.
   * -------------------------------------------------------------------- */
  document.querySelectorAll(".ba-viewer").forEach(function (viewer) {
    var after = viewer.querySelector(".ba-viewer__after");
    var handle = viewer.querySelector(".ba-handle");
    var range = viewer.querySelector(".ba-range");
    if (!after || !handle) return;

    var set = function (pct) {
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = "inset(0 0 0 " + pct + "%)";
      handle.style.left = pct + "%";
      if (range && Number(range.value) !== Math.round(pct)) range.value = Math.round(pct);
    };

    var fromEvent = function (e) {
      var rect = viewer.getBoundingClientRect();
      set(((e.clientX - rect.left) / rect.width) * 100);
    };

    var dragging = false;
    viewer.addEventListener("pointerdown", function (e) {
      dragging = true;
      viewer.setPointerCapture(e.pointerId);
      fromEvent(e);
      trackEvent("gallery-interaction", viewer.getAttribute("data-project") || "before-after");
    });
    viewer.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e); });
    viewer.addEventListener("pointerup", function () { dragging = false; });
    viewer.addEventListener("pointercancel", function () { dragging = false; });
    if (range) range.addEventListener("input", function () { set(Number(range.value)); });

    set(range ? Number(range.value) : 50);
  });

  /* ---------- 4. Scroll reveal ----------------------------------------- */
  var revealables = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Quote form UI state ----------------------------------- *
   * The form has no backend here. Replace the submit handler with your
   * WordPress form plugin (WPForms / Gravity Forms / Contact Form 7)
   * or a POST endpoint. See DEVELOPER-NOTES.md.
   * -------------------------------------------------------------------- */
  document.querySelectorAll("form[data-quote-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      trackEvent("contact-submit", form.getAttribute("data-form-name") || "quote-form");
      window.setTimeout(function () {
        if (status) {
          status.hidden = false;
          status.textContent =
            "Thanks — your enquiry has been received. We'll review it and get back to you as soon as possible.";
          status.focus && status.focus();
        }
        form.reset();
        if (button) { button.disabled = false; button.textContent = "Request My Free Quote"; }
      }, 600);
    });
  });

  /* ---------- 6. Conversion tracking hooks ----------------------------- *
   * Every CTA carries data-track="...". Values used across the site:
   *   quote-click | phone-click | contact-submit | service-enquiry |
   *   chat-click  | gallery-interaction
   * Connect GA4 / GTM below — do not hard-code measurement IDs in source.
   * -------------------------------------------------------------------- */
  function trackEvent(name, label) {
    var payload = { event_category: "conversion", event_label: label || "" };
    // GA4 (gtag.js) — uncomment once GA4 is installed in the <head>:
    // if (typeof window.gtag === "function") window.gtag("event", name, payload);
    // Google Tag Manager — uncomment once GTM is installed:
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push(Object.assign({ event: name }, payload));
    if (window.DAWSON_DEBUG_TRACKING) console.log("[track]", name, payload);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (!el) return;
    trackEvent(el.getAttribute("data-track"), el.getAttribute("data-track-label") || el.textContent.trim());
  });

  window.dawsonTrack = trackEvent;

  /* ---------- 7. Footer year ------------------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
