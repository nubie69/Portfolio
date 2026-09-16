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

    document.querySelectorAll(".project-preview").forEach((preview) => {
      const slides = Array.from(preview.querySelectorAll(".image-trigger"));
      if (slides.length < 2) return;

      let currentIndex = 0;
      const projectTitle = preview.closest(".project-card").querySelector("h3").textContent;
      preview.classList.add("project-carousel");
      preview.setAttribute("role", "group");
      preview.setAttribute("aria-roledescription", "carousel");
      preview.setAttribute("aria-label", `${projectTitle} images`);

      const counter = document.createElement("span");
      counter.className = "carousel-counter";
      counter.setAttribute("aria-live", "polite");
      counter.setAttribute("aria-atomic", "true");

      function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
          slide.hidden = slideIndex !== currentIndex;
        });
        counter.textContent = `${currentIndex + 1} / ${slides.length}`;
      }

      [-1, 1].forEach((direction) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `carousel-arrow ${direction === -1 ? "carousel-prev" : "carousel-next"}`;
        button.setAttribute("aria-label", `${direction === -1 ? "Previous" : "Next"} image for ${projectTitle}`);
        button.textContent = direction === -1 ? "\u2039" : "\u203a";
        button.addEventListener("click", () => showSlide(currentIndex + direction));
        preview.append(button);
      });

      preview.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const slideHadFocus = slides.includes(document.activeElement);
        showSlide(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
        if (slideHadFocus) slides[currentIndex].focus();
      });

      preview.append(counter);
      showSlide(0);
    });

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
  function filter() {
    const query = (search?.value || "").trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      card.hidden = (category.value !== "All" && card.dataset.category !== category.value)
        || !card.textContent.toLocaleLowerCase().includes(query);
      if (!card.hidden) visible++;
    });
    count.textContent = `${visible} of ${cards.length} ${collection.dataset.collection}`;
    empty.hidden = visible !== 0;
    reset.hidden = category.value === "All" && !query;
  }
  category.addEventListener("change", filter);
  search?.addEventListener("input", filter);
  reset.addEventListener("click", () => {
    category.value = "All";
    if (search) search.value = "";
    filter();
    (search || category).focus();
  });
  filter();
});
