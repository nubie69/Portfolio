const copyEmailButton = document.querySelector("[data-copy-email]");
if (copyEmailButton) {
  const emailAddress = document.querySelector("#contact-email-address");
  const copyStatus = document.querySelector(".contact-copy-status");
  copyEmailButton.hidden = false;
  copyEmailButton.addEventListener("click", async () => {
    copyStatus.textContent = "";
    try {
      await navigator.clipboard.writeText(emailAddress.textContent.trim());
      copyStatus.textContent = "Email address copied!";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(emailAddress);
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = "Select and copy the email address above, or press Ctrl+C (Cmd+C on Mac).";
    }
  });
}

const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  const updateHeaderHeight = () => {
    document.documentElement.style.setProperty("--header-height", `${siteHeader.offsetHeight}px`);
  };
  updateHeaderHeight();
  if ("ResizeObserver" in window) {
    new ResizeObserver(updateHeaderHeight).observe(siteHeader);
  } else {
    window.addEventListener("resize", updateHeaderHeight);
  }
}

const animatedItems = document.querySelectorAll(
      ".section-heading, .stats div, .about-grid, .skill-card-grid article, .tech-strip span, .project-card, .timeline article, .certificate-card, .contact-form, .social-row"
    );

    animatedItems.forEach((item, index) => {
      item.classList.add("reveal");
      item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    });

    if (!("IntersectionObserver" in window)) {
      animatedItems.forEach((item) => {
        item.classList.add("is-visible");
        item.style.transitionDelay = "0ms";
      });
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            window.setTimeout(() => {
              entry.target.style.transitionDelay = "0ms";
            }, 1000);
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16 });

      animatedItems.forEach((item) => revealObserver.observe(item));
    }

    const imageLightbox = document.querySelector("#imageLightbox");
    const lightboxImage = document.querySelector("#lightboxImage");
    const lightboxCaption = document.querySelector("#lightboxCaption");
    const imageTriggers = document.querySelectorAll(".image-trigger, .preview-action");
    const closeLightboxButtons = document.querySelectorAll("[data-close-lightbox]");

    let previousFocus;
    imageLightbox.inert = true;
    function openLightbox(src, title) {
      previousFocus = document.activeElement;
      imageLightbox.inert = false;
      document.querySelectorAll("main, header, footer").forEach(el => el.inert = true);
      lightboxImage.src = src;
      lightboxImage.alt = title;
      lightboxCaption.textContent = title;
      imageLightbox.classList.add("is-open");
      imageLightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      imageLightbox.querySelector(".lightbox-close").focus();
    }

    function closeLightbox() {
      imageLightbox.classList.remove("is-open");
      imageLightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      imageLightbox.inert = true;
      document.querySelectorAll("main, header, footer").forEach(el => el.inert = false);
      previousFocus?.focus();
      lightboxImage.src = "";
      lightboxImage.alt = "";
      lightboxCaption.textContent = "";
    }

    imageTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openLightbox(trigger.dataset.fullImage, trigger.dataset.imageTitle);
      });
    });

    closeLightboxButtons.forEach((button) => {
      button.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && imageLightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });

document.querySelectorAll("[data-collection]").forEach((collection) => {
  const cards = [...collection.querySelectorAll("[data-category]")];
  const category = collection.querySelector("select");
  const search = collection.querySelector('input[type="search"]');
  const count = collection.querySelector("[data-result-count]");
  const empty = collection.querySelector("[data-empty]");
  const reset = collection.querySelector("[data-reset]");
  const pagination = collection.querySelector("[data-pagination]");
  const previous = collection.querySelector("[data-previous]");
  const next = collection.querySelector("[data-next]");
  const pageStatus = collection.querySelector("[data-page-status]");
  const pageSize = Number(collection.dataset.pageSize) || cards.length;
  let page = 1;
  function render() {
    const query = (search?.value || "").trim().toLocaleLowerCase();
    const matches = cards.filter((card) =>
      (!category || category.value === "All" || card.dataset.category === category.value)
        && card.textContent.toLocaleLowerCase().includes(query));
    const pages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.max(1, Math.min(page, pages));
    const start = (page - 1) * pageSize;
    const visibleCards = matches.slice(start, start + pageSize);
    cards.forEach((card) => {
      card.hidden = !visibleCards.includes(card);
    });
    count.textContent = pagination && matches.length
      ? `Showing ${start + 1}\u2013${start + visibleCards.length} of ${matches.length} ${collection.dataset.collection}`
      : `${matches.length} of ${cards.length} ${collection.dataset.collection}`;
    if (empty) empty.hidden = matches.length !== 0;
    if (reset) reset.hidden = (!category || category.value === "All") && !query;
    if (pagination) {
      pagination.hidden = pages <= 1;
      previous.disabled = page === 1;
      next.disabled = page === pages;
      pageStatus.textContent = `Page ${page} of ${pages}`;
    }
  }
  function filter() {
    page = 1;
    render();
  }
  category?.addEventListener("change", filter);
  search?.addEventListener("input", filter);
  reset?.addEventListener("click", () => {
    if (category) category.value = "All";
    if (search) search.value = "";
    filter();
    (search || category).focus();
  });
  function changePage(direction) {
    page += direction;
    render();
    // Move focus to the available control when the clicked button becomes disabled.
    if (document.activeElement.disabled) (direction > 0 ? previous : next).focus();
    count.scrollIntoView({ block: "start", behavior: "instant" });
  }
  previous?.addEventListener("click", () => changePage(-1));
  next?.addEventListener("click", () => changePage(1));
  filter();
});
