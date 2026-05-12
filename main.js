const kvImages = [
  "kv_001.webp",
  "kv_002.webp",
  "kv_003.webp",
  "kv_004.webp",
  "kv_005.webp",
  "kv_006.webp",
  "kv_007.webp",
  "kv_008.webp",
  "kv_009.webp",
  "kv_010.webp",
  "kv_011.webp",
  "kv_012.webp",
  "kv_013.webp",
  "kv_014.webp",
  "kv_015.webp",
  "kv_016.webp",
  "kv_017.webp",
  "kv_018.webp",
  "kv_019.webp",
  "kv_020.webp",
  "kv_021.webp",
  "kv_022.webp"
];

const priorityKv = new Set([
  "kv_001.webp",
  "kv_007.webp",
  "kv_008.webp",
  "kv_009.webp",
  "kv_013.webp",
  "kv_020.webp",
  "kv_021.webp",
  "kv_022.webp"
]);

const renderImages = [
  "gm_series_06_internal.webp",
  "gm_series_07_black_front.webp",
  "gm_series_08_black_front.webp",
  "gionee_02_front.webp",
  "gm_series_01_front.webp",
  "gm_series_02_side.webp",
  "gm_series_03_detail.webp",
  "gm_series_04_white_front.webp",
  "gm_series_05_white_side.webp",
  "gm_series_09_black_side.webp",
  "gm_series_10_macro.webp",
  "gionee_01_angle.webp",
  "gionee_03_back.webp",
  "gionee_04_detail.webp"
];

const motionVideos = [
  "product-motion-01.mp4",
  "product-motion-02.mp4",
  "product-motion-03.mp4",
  "product-motion-04.mp4",
  "product-motion-05.mp4",
  "launch-film-01.mp4",
  "launch-film-02.mp4",
  "macro-material-study.mp4",
  "hero-tree.mp4",
  "CANDY.mp4"
];

const loadedSources = new Set();

function markForReveal(element) {
  if (!element) return;
  element.setAttribute("data-reveal", "");
  revealObserver.observe(element);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { root: null, threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

function buildImage(src, alt) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("load", () => loadedSources.add(src), { once: true });
  image.addEventListener("error", () => {
    const container = image.closest(".cinema-card, .masonry-item, .render-tile");
    if (container) container.remove();
  });
  return image;
}

function buildKvGalleries() {
  const cinemaStrip = document.getElementById("kvCinemaStrip");
  const masonryGrid = document.getElementById("kvMasonryGrid");
  if (!cinemaStrip || !masonryGrid) return;

  kvImages.forEach((file, index) => {
    const card = document.createElement("figure");
    card.className = "cinema-card magnetic-card";
    card.dataset.label = priorityKv.has(file) ? `PRIORITY KV ${String(index + 1).padStart(2, "0")}` : `KV ${String(index + 1).padStart(2, "0")}`;
    card.appendChild(buildImage(`media/kv/${file}`, `Cinematic key visual ${index + 1}`));
    cinemaStrip.appendChild(card);
    markForReveal(card);
  });

  const masonryClasses = ["large", "tall", "medium", "wide", "medium", "tall", "large", "medium"];
  kvImages.forEach((file, index) => {
    const item = document.createElement("figure");
    const priorityClass = priorityKv.has(file) ? " large" : "";
    item.className = `masonry-item magnetic-card ${masonryClasses[index % masonryClasses.length]}${priorityClass}`;
    item.style.transitionDelay = `${(index % 5) * 70}ms`;
    item.appendChild(buildImage(`media/kv/${file}`, `Key visual gallery image ${index + 1}`));
    masonryGrid.appendChild(item);
    markForReveal(item);
  });
}

function buildRenderBoard() {
  const renderBoard = document.getElementById("renderBoard");
  if (!renderBoard) return;

  const sizeClasses = ["hero-size", "poster-size", "small-size", "wide-size", "small-size", "poster-size", "hero-size", "small-size"];
  renderImages.forEach((file, index) => {
    const tile = document.createElement("figure");
    const isDark = file.includes("black") || file.includes("internal") || index % 3 === 0;
    tile.className = `render-tile magnetic-card ${isDark ? "dark" : "light"} ${sizeClasses[index % sizeClasses.length]}`;
    tile.dataset.label = file.replace(".webp", "").replaceAll("_", " ");
    tile.style.setProperty("--tilt", `${index % 2 === 0 ? -1.2 : 1.2}deg`);
    tile.style.transitionDelay = `${(index % 4) * 80}ms`;
    tile.appendChild(buildImage(`media/render/${file}`, `Industrial product render ${index + 1}`));
    renderBoard.appendChild(tile);
    markForReveal(tile);
  });
}

function buildMotionRail() {
  const motionRail = document.getElementById("motionRail");
  if (!motionRail) return;

  motionVideos.forEach((file, index) => {
    const card = document.createElement("article");
    card.className = "motion-card magnetic-card";
    card.style.transitionDelay = `${(index % 4) * 80}ms`;

    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.poster = "media/kv/kv_main.webp";

    const source = document.createElement("source");
    source.src = `media/video/${file}`;
    source.type = "video/mp4";
    video.appendChild(source);

    source.addEventListener("error", () => card.remove());
    video.addEventListener("error", () => card.remove());
    card.addEventListener("pointerenter", () => video.play().catch(() => {}));
    card.addEventListener("pointerleave", () => {
      video.pause();
      video.currentTime = 0;
    });

    const meta = document.createElement("div");
    meta.className = "motion-meta";
    meta.innerHTML = `<span>MOTION ${String(index + 1).padStart(2, "0")}</span><span>${file.replace(".mp4", "").replaceAll("-", " ")}</span>`;

    card.append(video, meta);
    motionRail.appendChild(card);
    markForReveal(card);
  });
}

function initPointerEffects() {
  const root = document.documentElement;
  let raf = 0;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  function update() {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    root.style.setProperty("--mouse-x", `${currentX}px`);
    root.style.setProperty("--mouse-y", `${currentY}px`);
    root.style.setProperty("--grid-x", `${currentX * -0.018}px`);
    root.style.setProperty("--grid-y", `${currentY * -0.018}px`);
    raf = requestAnimationFrame(update);
  }

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  update();
  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
}

function initParallax() {
  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  if (!parallaxItems.length) return;

  function tick() {
    const midpoint = window.innerHeight / 2;
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const strength = Number(item.dataset.parallax || 0);
      const progress = (rect.top + rect.height / 2 - midpoint) / midpoint;
      item.style.transform = `translate3d(0, ${progress * strength}px, 0)`;
    });
  }

  tick();
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
}

function initMagneticCards() {
  const cards = document.querySelectorAll(".magnetic-card");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--rx", `${y * -4}deg`);
      card.style.setProperty("--ry", `${x * 4}deg`);
      card.style.transform = `perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-2px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
      card.style.transform = "";
    });
  });
}

function initExistingReveals() {
  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
}

function init() {
  buildKvGalleries();
  buildRenderBoard();
  buildMotionRail();
  initExistingReveals();
  initPointerEffects();
  initParallax();
  initMagneticCards();
}

document.addEventListener("DOMContentLoaded", init);
