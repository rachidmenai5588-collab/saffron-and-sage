/* Saffron & Sage — Restaurant Template Scripts
   Pure vanilla JavaScript. No dependencies.
   Every block guards for the elements it needs, so this file is safe
   to include on every page. */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Active nav link ---------- */
  if (nav) {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var links = nav.querySelectorAll("a");
    links.forEach(function (link) {
      if (link.getAttribute("href") === current) {
        link.classList.add("active");
      }
    });
  }

  /* ---------- Menu category filter (menu.html only) ---------- */
  var filterBar = document.querySelector(".filter-bar");
  var menuGrid = document.getElementById("menuGrid");
  var emptyNote = document.getElementById("menuEmpty");
  if (filterBar && menuGrid) {
    var buttons = filterBar.querySelectorAll(".filter-btn");
    var cards = menuGrid.querySelectorAll(".menu-card");
    filterBar.addEventListener("click", function (event) {
      var btn = event.target.closest(".filter-btn");
      if (!btn) return;
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var category = btn.getAttribute("data-filter");
      var visible = 0;
      cards.forEach(function (card) {
        var match = category === "all" || card.getAttribute("data-category") === category;
        card.classList.toggle("hidden", !match);
        if (match) visible += 1;
      });
      if (emptyNote) emptyNote.classList.toggle("show", visible === 0);
    });
  }

  /* ---------- Gallery lightbox (gallery.html only) ---------- */
  var gallery = document.getElementById("galleryGrid");
  var lightbox = document.getElementById("lightbox");
  if (gallery && lightbox) {
    var thumbs = gallery.querySelectorAll("button[data-full]");
    var lightboxImg = document.getElementById("lightboxImg");
    var index = 0;
    var sources = [];
    thumbs.forEach(function (thumb) {
      sources.push(thumb.getAttribute("data-full"));
    });
    function show(i) {
      index = (i + sources.length) % sources.length;
      lightboxImg.setAttribute("src", sources[index]);
      lightboxImg.setAttribute("alt", "Gallery photo " + (index + 1));
    }
    function open(i) {
      show(i);
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () { open(i); });
    });
    var closeBtn = document.getElementById("lightboxClose");
    var prevBtn = document.getElementById("lightboxPrev");
    var nextBtn = document.getElementById("lightboxNext");
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function (e) { e.stopPropagation(); show(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function (e) { e.stopPropagation(); show(index + 1); });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
  }

  /* ---------- Reservation form (reservation.html only) ---------- */
  var form = document.getElementById("reservationForm");
  if (form) {
    var dateInput = document.getElementById("resDate");
    if (dateInput) {
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var dd = String(today.getDate()).padStart(2, "0");
      dateInput.setAttribute("min", yyyy + "-" + mm + "-" + dd);
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var valid = true;
      function check(id, errorId, ok) {
        var err = document.getElementById(errorId);
        if (!err) return;
        if (ok) {
          err.textContent = "";
        } else {
          err.textContent = "Please complete this field correctly.";
          valid = false;
        }
      }
      var name = document.getElementById("resName").value.trim();
      var email = document.getElementById("resEmail").value.trim();
      var date = dateInput ? dateInput.value : "";
      var time = document.getElementById("resTime").value;
      var guests = document.getElementById("resGuests").value;
      check("resName", "errName", name.length >= 2);
      check("resEmail", "errEmail", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      check("resDate", "errDate", date !== "");
      check("resTime", "errTime", time !== "");
      check("resGuests", "errGuests", guests !== "");
      if (!valid) return;
      var summary = document.getElementById("resSummary");
      if (summary) {
        summary.textContent = "Thank you, " + name + "! Your request for " +
          guests + " guest(s) on " + date + " at " + time +
          " has been received. We will confirm by email shortly.";
      }
      var success = document.getElementById("resSuccess");
      if (success) success.classList.add("show");
      form.reset();
      if (success) success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
  /* ---------- Contact form (contact.html only) ---------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      var ok = document.getElementById("contactSuccess");
      if (ok) {
        ok.classList.add("show");
        ok.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      contactForm.reset();
    });
  }
})();
