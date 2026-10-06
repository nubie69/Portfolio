const robot = document.querySelector("[data-robot]");
if (robot) {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const walker = document.createElement("div");
  walker.className = "robot-walker";
  walker.setAttribute("aria-hidden", "true");
  walker.append(robot.querySelector(".robot-art"));
  document.body.append(walker);
  let x = 28;
  let y = window.innerHeight - 180;
  let target = { x: window.innerWidth / 2, y };
  let pointer = null;
  let lastTime = 0;
  let frame = null;
  let fleeingUntil = 0;
  let paused = motionPreference.matches;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const bounds = () => ({
    left: 12,
    right: Math.max(12, window.innerWidth - walker.offsetWidth - 12),
    top: Math.min(190, window.innerHeight * 0.25),
    bottom: Math.max(12, window.innerHeight - walker.offsetHeight - 86),
  });
  const place = () => {
    const area = bounds();
    x = clamp(x, area.left, area.right);
    y = clamp(y, Math.min(area.top, area.bottom), area.bottom);
    walker.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const wander = () => {
    const area = bounds();
    target = {
      x: area.left + Math.random() * (area.right - area.left),
      y: Math.min(area.top, area.bottom) + Math.random() * Math.max(0, area.bottom - area.top),
    };
  };
  const escape = () => {
    const area = bounds();
    // Compare reachable directions so the robot can escape along an edge, too.
    let bestScore = -Infinity;
    for (let i = 0; i < 16; i++) {
      const angle = i * Math.PI / 8;
      const next = {
        x: clamp(x + Math.cos(angle) * 220, area.left, area.right),
        y: clamp(y + Math.sin(angle) * 220, Math.min(area.top, area.bottom), area.bottom),
      };
      const distance = Math.hypot(next.x + walker.offsetWidth / 2 - pointer.x, next.y + walker.offsetHeight / 2 - pointer.y);
      const score = distance + Math.hypot(next.x - x, next.y - y) * 0.15;
      if (score > bestScore) { bestScore = score; target = next; }
    }
  };
  const tick = (now) => {
    frame = null;
    if (paused || document.hidden) return;
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
    lastTime = now;
    if (pointer && Math.hypot(x + walker.offsetWidth / 2 - pointer.x, y + walker.offsetHeight / 2 - pointer.y) < 145) {
      fleeingUntil = now + 850;
      escape();
    }
    const running = now < fleeingUntil;
    walker.classList.toggle("is-running", running);
    let dx = target.x - x;
    let dy = target.y - y;
    let distance = Math.hypot(dx, dy);
    if (distance < 4) {
      wander();
      dx = target.x - x;
      dy = target.y - y;
      distance = Math.hypot(dx, dy);
    }
    const step = Math.min(distance, (running ? 230 : 32) * dt);
    if (distance > 0) { x += dx / distance * step; y += dy / distance * step; }
    walker.classList.toggle("faces-left", dx < 0);
    place();
    frame = requestAnimationFrame(tick);
  };
  const syncMotion = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
    walker.classList.toggle("is-paused", paused || document.hidden);
    if (!paused && !document.hidden) frame = requestAnimationFrame(tick);
  };
  motionPreference.addEventListener("change", (event) => {
    paused = event.matches;
    syncMotion();
  });
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "mouse") pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  document.addEventListener("pointerleave", () => { pointer = null; });
  window.addEventListener("blur", () => { pointer = null; });
  window.addEventListener("resize", () => { place(); wander(); });
  document.addEventListener("visibilitychange", syncMotion);
  place();
  syncMotion();
}

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
