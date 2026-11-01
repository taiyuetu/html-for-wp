const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileLinks = document.querySelectorAll(".mobile-nav a");
const contactForm = document.querySelector(".contact-form");
const revealElements = document.querySelectorAll(".reveal");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

// --- Product Page Interactions ---

// Gallery Switcher
const mainImg = document.getElementById("main-product-img");
const thumbBtns = document.querySelectorAll(".thumb-btn");

if (mainImg && thumbBtns.length > 0) {
  thumbBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update main image source
      const newSrc = btn.getAttribute("data-img");
      mainImg.src = newSrc;

      // Update active state
      thumbBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

// Quantity Selector
const qtyInput = document.getElementById("product-qty");
const qtyPlus = document.getElementById("qty-plus");
const qtyMinus = document.getElementById("qty-minus");

if (qtyInput && qtyPlus && qtyMinus) {
  qtyPlus.addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
  });

  qtyMinus.addEventListener("click", () => {
    const currentVal = parseInt(qtyInput.value);
    if (currentVal > 1) {
      qtyInput.value = currentVal - 1;
    }
  });
}

// Tab Switching
const tabTriggers = document.querySelectorAll(".tab-trigger");
const tabContents = document.querySelectorAll(".tab-content");

if (tabTriggers.length > 0) {
  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetTab = trigger.getAttribute("data-tab");

      // Update active trigger
      tabTriggers.forEach((t) => t.classList.remove("active"));
      trigger.classList.add("active");

      // Update visible content
      tabContents.forEach((content) => {
        if (content.id === targetTab) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }
      });
    });
  });
}

