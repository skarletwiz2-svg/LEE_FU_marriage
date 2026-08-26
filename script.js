const photos = [
  { src: "images/KJH02144-2.jpg?v=20260721-8", alt: "웨딩 갤러리 사진 1" },
  { src: "images/KJH02546-2.jpg?v=20260721-8", alt: "웨딩 갤러리 사진 2" },
  { src: "images/KJH01666-1.jpg?v=20260722-1", alt: "웨딩 갤러리 사진 3" },
  { src: "images/KJH03178-1.jpg?v=20260722-1", alt: "웨딩 갤러리 사진 4" },
  { src: "images/KJH03296-1.jpg?v=20260722-1", alt: "웨딩 갤러리 사진 5" },
  { src: "images/DEE00042-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 6" },
  { src: "images/DEE00259-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 7" },
  { src: "images/DEE00367-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 8" },
  { src: "images/DEE00478-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 9" },
  { src: "images/DEE00696-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 10" },
  { src: "images/DEE00825-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 11" },
  { src: "images/DEE01021-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 12" },
  { src: "images/DEE01082-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 13" },
  { src: "images/DEE01153-2.jpg?v=20260826-1", alt: "웨딩 갤러리 사진 14" }
];

const backgroundMusic = document.querySelector("#background-music");
const musicToggle = document.querySelector(".music-toggle");
const startPrompt = document.querySelector(".start-prompt");
let musicManuallyPaused = true;
let waitingForFirstMusicPlay = true;

function updateMusicButton() {
  const isPlaying = !backgroundMusic.paused;
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "배경 음악 일시정지" : "배경 음악 재생");
}

function playBackgroundMusic() {
  if (document.hidden || musicManuallyPaused) return;
  if (!waitingForFirstMusicPlay && !backgroundMusic.paused) return;
  const playRequest = backgroundMusic.play();
  if (playRequest) {
    playRequest.then(updateMusicButton).catch(() => {
      updateMusicButton();
    });
  }
}

function removeStartGestureListeners() {
  document.removeEventListener("touchstart", beginInvitation, true);
  document.removeEventListener("touchend", beginInvitation, true);
  document.removeEventListener("pointerdown", beginInvitation, true);
  document.removeEventListener("pointerup", beginInvitation, true);
  document.removeEventListener("click", beginInvitation, true);
  document.removeEventListener("keydown", beginInvitation, true);
}

function pauseMusicWhenLeavingPage() {
  if (!backgroundMusic.paused) {
    backgroundMusic.pause();
  }
  musicManuallyPaused = true;
  updateMusicButton();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseMusicWhenLeavingPage();
});
window.addEventListener("pagehide", pauseMusicWhenLeavingPage);

backgroundMusic.volume = 0.55;
backgroundMusic.addEventListener("play", () => {
  waitingForFirstMusicPlay = false;
  removeStartGestureListeners();
  updateMusicButton();
});
backgroundMusic.addEventListener("pause", updateMusicButton);
backgroundMusic.addEventListener("ended", () => {
  if (!musicManuallyPaused) {
    backgroundMusic.currentTime = 0;
    playBackgroundMusic();
  }
});

musicToggle.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    musicManuallyPaused = false;
    playBackgroundMusic();
  } else {
    musicManuallyPaused = true;
    backgroundMusic.pause();
  }
});

const initialHeroHeight = window.innerHeight;
document.documentElement.style.setProperty("--hero-height", `${initialHeroHeight}px`);
document.documentElement.classList.add("intro-locked");
document.body.classList.add("intro-locked");
window.scrollTo(0, 0);

const invitation = document.querySelector(".invitation");
const heroPreloader = new Image();
const blurredHeroPreloader = new Image();
let animationStarted = false;
let introUnlockTimer;
const readyHeroImages = new Set();

function blockIntroScroll(event) {
  if (document.body.classList.contains("intro-locked")) {
    event.preventDefault();
  }
}

document.addEventListener("touchmove", blockIntroScroll, { passive: false });
document.addEventListener("wheel", blockIntroScroll, { passive: false });

function unlockInvitation() {
  clearTimeout(introUnlockTimer);
  document.documentElement.classList.remove("intro-locked");
  document.body.classList.remove("intro-locked");
  document.documentElement.classList.add("intro-unlocked");
  document.body.classList.add("intro-unlocked");
  document.removeEventListener("touchmove", blockIntroScroll);
  document.removeEventListener("wheel", blockIntroScroll);
  void document.body.offsetHeight;
  window.scrollTo(0, 0);
}

function startInvitationAnimation(forceRestart = false) {
  if (animationStarted && !forceRestart) return;
  animationStarted = true;
  document.documentElement.classList.remove("intro-unlocked");
  document.body.classList.remove("intro-unlocked");
  document.documentElement.classList.add("intro-locked");
  document.body.classList.add("intro-locked");
  document.addEventListener("touchmove", blockIntroScroll, { passive: false });
  document.addEventListener("wheel", blockIntroScroll, { passive: false });
  window.scrollTo(0, 0);
  clearTimeout(introUnlockTimer);
  invitation.classList.remove("is-ready");
  void invitation.offsetWidth;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      invitation.classList.add("is-ready");
      introUnlockTimer = setTimeout(unlockInvitation, 10300);
    });
  });
}

function markHeroReady(key) {
  readyHeroImages.add(key);
}

heroPreloader.addEventListener("load", () => markHeroReady("sharp"));
heroPreloader.addEventListener("error", () => markHeroReady("sharp"));
blurredHeroPreloader.addEventListener("load", () => markHeroReady("blurred"));
blurredHeroPreloader.addEventListener("error", () => markHeroReady("blurred"));
heroPreloader.src = "images/KJH02739-2-hero.jpg";
blurredHeroPreloader.src = "images/KJH02739-2-blur.jpg";
if (heroPreloader.complete) markHeroReady("sharp");
if (blurredHeroPreloader.complete) markHeroReady("blurred");

function beginInvitation(event) {
  if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
  musicManuallyPaused = false;
  playBackgroundMusic();
  if (!animationStarted) {
    document.documentElement.classList.remove("awaiting-start");
    document.body.classList.remove("awaiting-start");
    startInvitationAnimation();
  }
  if (!waitingForFirstMusicPlay) removeStartGestureListeners();
}

document.addEventListener("touchstart", beginInvitation, { capture: true, passive: true });
document.addEventListener("touchend", beginInvitation, { capture: true, passive: true });
document.addEventListener("pointerdown", beginInvitation, true);
document.addEventListener("pointerup", beginInvitation, true);
document.addEventListener("click", beginInvitation, true);
document.addEventListener("keydown", beginInvitation, true);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) updateMusicButton();
});

const petals = document.querySelector(".petals");
const heroBlur = document.querySelector(".hero-blur");
const finalStoryCopy = document.querySelector(".story-yue");
petals.addEventListener("animationend", (event) => {
  if (event.animationName === "petals-window") {
    invitation.classList.add("intro-finished");
    unlockInvitation();
  }
});
finalStoryCopy.addEventListener("animationend", (event) => {
  if (event.animationName === "story-show") {
    invitation.classList.add("intro-finished");
    unlockInvitation();
  }
});
heroBlur.addEventListener("animationend", () => {
  heroBlur.style.willChange = "auto";
}, { once: true });

const hero = document.querySelector(".intro");
const scrollPulse = document.querySelector(".scroll-cue i");
if ("IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    scrollPulse.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
  }, { threshold: 0 });
  heroObserver.observe(hero);
}

const revealSections = document.querySelectorAll(
  ".family-section, .wedding-day, .gallery-panel, .location-section, .gift-section, .closing"
);

let revealTicking = false;
let nextRevealAt = 0;
const revealGap = 320;

function updateRevealSections() {
  const viewportHeight = window.innerHeight;

  revealSections.forEach((section) => {
    if (section.dataset.revealComplete === "true") return;

    const rect = section.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const showThreshold = Math.min(rect.height * 0.08, 64);

    if (visibleHeight >= showThreshold) {
      if (!section.classList.contains("is-visible")) {
        const now = Date.now();
        const delay = Math.max(0, nextRevealAt - now);
        section.style.setProperty("--reveal-delay", `${delay}ms`);
        nextRevealAt = now + delay + revealGap;
        section.classList.add("is-visible");
      }
      if (section.matches(".gallery-panel, .gift-section")) {
        section.dataset.revealComplete = "true";
      }
    } else if (rect.bottom <= 0 || rect.top >= viewportHeight) {
      section.classList.remove("is-visible");
    }
  });

  revealTicking = false;
}

function requestRevealUpdate() {
  if (revealTicking) return;
  revealTicking = true;
  requestAnimationFrame(updateRevealSections);
}

revealSections.forEach((section) => section.classList.add("reveal-pending"));
void document.body.offsetHeight;
requestAnimationFrame(() => requestAnimationFrame(updateRevealSections));
window.addEventListener("scroll", requestRevealUpdate, { passive: true });
window.addEventListener("resize", requestRevealUpdate, { passive: true });
window.addEventListener("pageshow", requestRevealUpdate);

const weddingCountdownKo = document.querySelector("#wedding-countdown-ko");
const weddingCountdownYue = document.querySelector("#wedding-countdown-yue");

function updateWeddingCountdown() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weddingDay = new Date(2026, 10, 22);
  const daysLeft = Math.round((weddingDay - today) / 86400000);

  if (daysLeft > 0) {
    weddingCountdownKo.textContent = `결혼식까지 D-${daysLeft}일`;
    weddingCountdownYue.textContent = `距離婚禮尚餘 D-${daysLeft}日`;
  } else if (daysLeft === 0) {
    weddingCountdownKo.textContent = "오늘, 저희 결혼합니다";
    weddingCountdownYue.textContent = "今天，我們結婚了";
  } else {
    const daysAfter = Math.abs(daysLeft);
    weddingCountdownKo.textContent = `결혼식 후 D+${daysAfter}일`;
    weddingCountdownYue.textContent = `婚禮後 D+${daysAfter}日`;
  }
}

updateWeddingCountdown();
setInterval(updateWeddingCountdown, 3600000);

const copyAddressButtons = document.querySelectorAll(".copy-address");
const copyFeedback = document.querySelector(".copy-feedback");

async function copyVenueAddress(event) {
  const button = event.currentTarget;
  const address = button.dataset.address;
  try {
    await navigator.clipboard.writeText(address);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = address;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  copyFeedback.textContent = button.dataset.feedback;
  setTimeout(() => { copyFeedback.textContent = ""; }, 1800);
}

copyAddressButtons.forEach((button) => button.addEventListener("click", copyVenueAddress));

const giftToggle = document.querySelector(".gift-toggle");
const giftAccounts = document.querySelector(".gift-accounts");

giftToggle.addEventListener("click", () => {
  const willOpen = giftToggle.getAttribute("aria-expanded") !== "true";
  giftToggle.setAttribute("aria-expanded", String(willOpen));
  giftAccounts.hidden = !willOpen;
});

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    document.execCommand("copy");
    textarea.remove();
  }
}

document.querySelectorAll(".copy-account").forEach((button) => {
  button.addEventListener("click", async () => {
    const account = button.dataset.account;
    const feedback = button.parentElement.querySelector(".account-feedback");
    if (account) await copyText(account);
    feedback.textContent = button.dataset.feedback;
    clearTimeout(button.feedbackTimer);
    button.feedbackTimer = setTimeout(() => { feedback.textContent = ""; }, 1800);
  });
});

const lightbox = document.querySelector(".lightbox");
const fullImage = document.querySelector(".lightbox-image");
const counter = document.querySelector(".lightbox-count");
const previewSources = Array.from(
  document.querySelectorAll(".photo-button img"),
  (image) => image.currentSrc || image.src
);
const photoLoadCache = new Map();
let currentPhotoIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let isSwipeTracking = false;
let isPinchGesture = false;
let isPhotoSwitching = false;
let photoRequestToken = 0;

function normalizePhotoIndex(index) {
  return (index + photos.length) % photos.length;
}

function preloadPhoto(index) {
  const normalizedIndex = normalizePhotoIndex(index);
  const source = photos[normalizedIndex].src;
  if (photoLoadCache.has(source)) return photoLoadCache.get(source);

  const entry = { ready: false, promise: null };
  entry.promise = new Promise((resolve) => {
    const loader = new Image();
    loader.decoding = "async";
    loader.onload = async () => {
      try {
        if (typeof loader.decode === "function") await loader.decode();
      } catch (error) {
        // The decoded image is still safe to use after a successful load.
      }
      entry.ready = true;
      resolve(source);
    };
    loader.onerror = () => resolve(null);
    loader.src = source;
  });
  photoLoadCache.set(source, entry);
  return entry;
}

function showPhoto(index) {
  currentPhotoIndex = normalizePhotoIndex(index);
  const requestToken = ++photoRequestToken;
  const photo = photos[currentPhotoIndex];
  const cachedPhoto = photoLoadCache.get(photo.src);

  fullImage.src = cachedPhoto?.ready ? photo.src : previewSources[currentPhotoIndex];
  fullImage.alt = photo.alt;
  counter.textContent = `${String(currentPhotoIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

  preloadPhoto(currentPhotoIndex).promise.then((source) => {
    if (!source || requestToken !== photoRequestToken || lightbox.hidden) return;
    fullImage.src = source;
  });
  preloadPhoto(currentPhotoIndex - 1);
  preloadPhoto(currentPhotoIndex + 1);
}

function slideToPhoto(index, direction) {
  if (isPhotoSwitching) return;
  isPhotoSwitching = true;

  const targetIndex = normalizePhotoIndex(index);
  const outgoingClass = direction === "next" ? "slide-out-left" : "slide-out-right";
  const incomingClass = direction === "next" ? "slide-in-right" : "slide-in-left";
  preloadPhoto(targetIndex);
  fullImage.classList.add(outgoingClass);

  setTimeout(() => {
    showPhoto(targetIndex);
    fullImage.classList.remove(outgoingClass);
    fullImage.classList.add(incomingClass);

    setTimeout(() => {
      fullImage.classList.remove(incomingClass);
      isPhotoSwitching = false;
    }, 170);
  }, 130);
}

function closeLightbox() {
  photoRequestToken += 1;
  isPhotoSwitching = false;
  fullImage.classList.remove("slide-out-left", "slide-out-right", "slide-in-left", "slide-in-right");
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll(".photo-button").forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.index);
    showPhoto(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.querySelector(".close-button").focus();
  });
});

document.querySelector(".close-button").addEventListener("click", closeLightbox);
document.querySelector(".lightbox-backdrop").addEventListener("click", closeLightbox);

lightbox.addEventListener("touchstart", (event) => {
  if (event.touches.length > 1) {
    isPinchGesture = true;
    isSwipeTracking = false;
    return;
  }
  if (isPinchGesture || event.touches.length !== 1) return;
  isSwipeTracking = true;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });

lightbox.addEventListener("touchmove", (event) => {
  if (event.touches.length > 1) {
    isPinchGesture = true;
    isSwipeTracking = false;
  }
}, { passive: true });

lightbox.addEventListener("touchend", (event) => {
  if (isPinchGesture) {
    if (event.touches.length === 0) isPinchGesture = false;
    isSwipeTracking = false;
    return;
  }
  if (!isSwipeTracking || event.changedTouches.length !== 1) return;
  isSwipeTracking = false;
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
  const isNext = deltaX < 0;
  slideToPhoto(currentPhotoIndex + (isNext ? 1 : -1), isNext ? "next" : "previous");
}, { passive: true });

lightbox.addEventListener("touchcancel", () => {
  isSwipeTracking = false;
  isPinchGesture = false;
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  if (event.key === "ArrowLeft" && !lightbox.hidden) slideToPhoto(currentPhotoIndex - 1, "previous");
  if (event.key === "ArrowRight" && !lightbox.hidden) slideToPhoto(currentPhotoIndex + 1, "next");
});
