// Initialize AOS (Animate On Scroll)
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: false,
    mirror: false,
    offset: 100,
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const searchToggle = document.querySelector("[data-search-toggle]");
const searchPanel = document.querySelector("[data-search-panel]");
const searchClose = document.querySelector("[data-search-close]");

if (menuToggle && mobileMenu) {
  const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

  const closeMenu = () => {
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    mobileMenu.hidden = true;
  };

  const closeSearch = () => {
    if (!searchToggle || !searchPanel) return;
    searchToggle.setAttribute("aria-expanded", "false");
    searchPanel.classList.remove("is-open");
    searchPanel.hidden = true;
  };

  const syncMenuState = () => {
    if (!mobileBreakpoint.matches) {
      closeMenu();
    }
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenu.hidden = !isOpen;
    if (isOpen) {
      closeSearch();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  searchToggle?.addEventListener("click", () => {
    const isOpen = searchToggle.getAttribute("aria-expanded") === "true";
    const nextState = !isOpen;
    searchToggle.setAttribute("aria-expanded", String(nextState));
    searchPanel?.classList.toggle("is-open", nextState);
    if (searchPanel) {
      searchPanel.hidden = !nextState;
    }
    if (nextState) {
      closeMenu();
    }
  });

  searchClose?.addEventListener("click", closeSearch);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeSearch();
    }
  });

  window.addEventListener("resize", syncMenuState);
  syncMenuState();
}

const updateScrollButtons = (trackId) => {
  const track = document.getElementById(trackId);
  if (!track) return;

  const canScrollLeft = track.scrollLeft > 4;
  const canScrollRight = track.scrollLeft < track.scrollWidth - track.clientWidth - 4;

  document.querySelectorAll(`[data-scroll-target="${trackId}"]`).forEach((button) => {
    const isLeft = button.getAttribute("data-direction") === "left";
    button.disabled = isLeft ? !canScrollLeft : !canScrollRight;
  });
};

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  const trackId = button.getAttribute("data-scroll-target");
  if (!trackId) return;

  const track = document.getElementById(trackId);
  if (!track) return;

  if (track.dataset.bound !== "true") {
    track.dataset.bound = "true";
    updateScrollButtons(trackId);
    track.addEventListener("scroll", () => updateScrollButtons(trackId), { passive: true });
    window.addEventListener("resize", () => updateScrollButtons(trackId));
  }

  button.addEventListener("click", () => {
    const direction = button.getAttribute("data-direction");
    if (!direction) return;

    const distance = track.clientWidth * 0.7;
    track.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  });
});

const contactForm = document.getElementById("contact-form");
const contactSuccess = document.getElementById("contact-success");

if (contactForm && contactSuccess) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.hidden = true;
    contactSuccess.hidden = false;
  });
}

document.querySelectorAll("[data-product-gallery]").forEach((gallery) => {
  const featuredImage = gallery.querySelector("[data-gallery-featured-image]");
  const featuredFrame = gallery.querySelector("[data-gallery-featured-frame]");
  const thumbs = gallery.querySelectorAll("[data-gallery-thumb]");

  if (!featuredImage || !featuredFrame || thumbs.length === 0) return;

  const syncFeaturedImage = (thumb) => {
    const imageSrc = thumb.getAttribute("data-image");
    const imageAlt = thumb.getAttribute("data-alt");
    if (!imageSrc) return;

    featuredImage.src = imageSrc;
    featuredImage.alt = imageAlt || featuredImage.alt;
    thumbs.forEach((item) => item.classList.toggle("is-active", item === thumb));
    featuredFrame.href = imageSrc;
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("mouseenter", () => syncFeaturedImage(thumb));
    thumb.addEventListener("focus", () => syncFeaturedImage(thumb));
  });
});

document.querySelectorAll("[data-tabs]").forEach((tabGroup) => {
  const buttons = tabGroup.querySelectorAll("[data-tab-target]");
  const panels = tabGroup.querySelectorAll("[data-tab-panel]");

  if (buttons.length === 0 || panels.length === 0) return;

  const activateTab = (targetId) => {
    buttons.forEach((button) => {
      const isActive = button.getAttribute("data-tab-target") === targetId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.hidden = !isActive;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab-target");
      if (!targetId) return;
      activateTab(targetId);
    });
  });
});

document.querySelectorAll("[data-showcase]").forEach((showcase) => {
  const items = Array.from(showcase.querySelectorAll("[data-showcase-item]"));
  const filters = showcase.querySelectorAll("[data-filter]");
  const pagination = showcase.querySelector("[data-pagination]");
  const resultCount = showcase.querySelector("[data-result-count]");
  const pageSize = Number(showcase.getAttribute("data-page-size") || "6");
  const lightbox = showcase.querySelector("[data-lightbox]");
  const lightboxImage = lightbox?.querySelector("[data-lightbox-image]");
  const lightboxCaption = lightbox?.querySelector("[data-lightbox-caption]");
  const lightboxClose = lightbox?.querySelector("[data-lightbox-close]");

  let activeFilter = "all";
  let currentPage = 1;

  const getFilteredItems = () =>
    items.filter((item) => activeFilter === "all" || item.getAttribute("data-category") === activeFilter);

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
  };

  const openLightbox = (item) => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const src = item.getAttribute("data-image");
    const alt = item.getAttribute("data-alt") || "";
    const caption = item.getAttribute("data-caption") || "";
    if (!src) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
  };

  const renderPagination = (totalPages) => {
    if (!pagination) return;
    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    const addButton = (label, page, disabled = false, current = false) => {
      const element = document.createElement(current ? "span" : "button");
      element.textContent = label;
      if (current) {
        element.className = "is-current";
        element.setAttribute("aria-current", "page");
      } else {
        element.type = "button";
        element.disabled = disabled;
        element.addEventListener("click", () => {
          currentPage = page;
          renderShowcase();
        });
      }
      pagination.appendChild(element);
    };

    addButton("Prev", Math.max(1, currentPage - 1), currentPage === 1);
    for (let page = 1; page <= totalPages; page += 1) {
      addButton(String(page), page, false, page === currentPage);
    }
    addButton("Next", Math.min(totalPages, currentPage + 1), currentPage === totalPages);
  };

  const renderShowcase = () => {
    const filteredItems = getFilteredItems();
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * pageSize;
    const visibleItems = new Set(filteredItems.slice(start, start + pageSize));

    items.forEach((item) => {
      item.hidden = !visibleItems.has(item);
    });

    filters.forEach((filter) => {
      const isActive = filter.getAttribute("data-filter") === activeFilter;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    if (resultCount) {
      resultCount.textContent = `Showing ${filteredItems.length} images`;
    }

    renderPagination(totalPages);
  };

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeFilter = filter.getAttribute("data-filter") || "all";
      currentPage = 1;
      renderShowcase();
    });
  });

  items.forEach((item) => {
    const trigger = item.querySelector("[data-lightbox-trigger]");
    if (!trigger) return;
    trigger.addEventListener("click", () => openLightbox(item));
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  renderShowcase();
});
