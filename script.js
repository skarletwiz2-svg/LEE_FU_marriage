const photos = [
  { src: "images/KJH02144-2.jpg?v=20260721-8", alt: "웨딩 갤러리 사진 1" },
  { src: "images/KJH02546-2.jpg?v=20260721-8", alt: "웨딩 갤러리 사진 2" },
  { src: "images/KJH01666-1.jpg?v=20260722-1", alt: "웨딩 갤러리 사진 3" },
  { src: "images/KJH03178-1.jpg?v=20260722-1", alt: "웨딩 갤러리 사진 4" },
  { src: "images/KJH03296-1.jpg?v=20260722-1", alt: "웨딩 갤러리 사진 5" }
];

const backgroundMusic = document.querySelector("#background-music");
const musicToggle = document.querySelector(".music-toggle");
let musicManuallyPaused = false;

function updateMusicButton() {
  const isPlaying = !backgroundMusic.paused;
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "배경 음악 일시정지" : "배경 음악 재생");
}

function playBackgroundMusic() {
  if (document.hidden || musicManuallyPaused || !backgroundMusic.paused) return;
  const playRequest = backgroundMusic.play();
  if (playRequest) playRequest.then(updateMusicButton).catch(updateMusicButton);
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
backgroundMusic.addEventListener("play", updateMusicButton);
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

["touchend", "click", "keydown"].forEach((eventName) => {
  document.addEventListener(eventName, playBackgroundMusic, {
    capture: true,
    passive: true
  });
});

window.addEventListener("load", playBackgroundMusic);
playBackgroundMusic();

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
      introUnlockTimer = setTimeout(unlockInvitation, 11300);
    });
  });
}

function markHeroReady(key) {
  readyHeroImages.add(key);
  if (readyHeroImages.size >= 2) startInvitationAnimation();
}

heroPreloader.addEventListener("load", () => markHeroReady("sharp"));
heroPreloader.addEventListener("error", () => markHeroReady("sharp"));
blurredHeroPreloader.addEventListener("load", () => markHeroReady("blurred"));
blurredHeroPreloader.addEventListener("error", () => markHeroReady("blurred"));
heroPreloader.src = "images/KJH02739-2-hero.jpg";
blurredHeroPreloader.src = "images/KJH02739-2-blur.jpg";
if (heroPreloader.complete) markHeroReady("sharp");
if (blurredHeroPreloader.complete) markHeroReady("blurred");
setTimeout(() => startInvitationAnimation(), 4000);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    invitation.classList.remove("intro-finished");
    startInvitationAnimation(true);
  }
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
  ".family-section, .wedding-day, .gallery-panel, .location-section, .guestbook-section, .gift-section, .closing"
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
      if (section.matches(".gallery-panel, .guestbook-section, .gift-section")) {
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

function warmUpScrollContent() {
  document.querySelectorAll(".photo-button img").forEach((image) => {
    if (typeof image.decode === "function") image.decode().catch(() => {});
  });
}

if ("requestIdleCallback" in window) {
  requestIdleCallback(warmUpScrollContent, { timeout: 1800 });
} else {
  setTimeout(warmUpScrollContent, 600);
}

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
let currentPhotoIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let isSwipeTracking = false;
let isPinchGesture = false;
let isPhotoSwitching = false;

function showPhoto(index) {
  currentPhotoIndex = (index + photos.length) % photos.length;
  fullImage.src = photos[currentPhotoIndex].src;
  fullImage.alt = photos[currentPhotoIndex].alt;
  counter.textContent = `${String(currentPhotoIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
}

function slideToPhoto(index, direction) {
  if (isPhotoSwitching) return;
  isPhotoSwitching = true;

  const outgoingClass = direction === "next" ? "slide-out-left" : "slide-out-right";
  const incomingClass = direction === "next" ? "slide-in-right" : "slide-in-left";
  fullImage.classList.add(outgoingClass);

  setTimeout(() => {
    showPhoto(index);
    fullImage.classList.remove(outgoingClass);
    fullImage.classList.add(incomingClass);

    setTimeout(() => {
      fullImage.classList.remove(incomingClass);
      isPhotoSwitching = false;
    }, 170);
  }, 130);
}

function closeLightbox() {
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

const guestbookConfig = window.GUESTBOOK_CONFIG;
const guestbookSection = document.querySelector(".guestbook-section");

if (guestbookSection && guestbookConfig?.url && guestbookConfig?.key) {
  const guestbookList = document.querySelector(".guestbook-list");
  const guestbookStatus = document.querySelector(".guestbook-status");
  const guestbookMore = document.querySelector(".guestbook-more");
  const guestbookWrite = document.querySelector(".guestbook-write");
  const guestbookAdmin = document.querySelector(".guestbook-admin");
  const guestbookModal = document.querySelector(".guestbook-modal");
  const guestbookForm = document.querySelector(".guestbook-form");
  const guestbookModalTitle = document.querySelector("#guestbook-modal-title");
  const guestbookName = document.querySelector("#guestbook-name");
  const guestbookPassword = document.querySelector("#guestbook-password");
  const guestbookMessage = document.querySelector("#guestbook-message");
  const guestbookCounter = document.querySelector(".guestbook-counter");
  const guestbookFormStatus = document.querySelector(".guestbook-form-status");
  const guestbookSubmit = document.querySelector(".guestbook-submit");
  const passwordModal = document.querySelector(".guestbook-password-modal");
  const passwordForm = document.querySelector(".guestbook-password-form");
  const actionPassword = document.querySelector("#guestbook-action-password");
  const passwordStatus = document.querySelector(".guestbook-password-status");
  const passwordTitle = document.querySelector("#guestbook-password-title");
  const passwordDescription = document.querySelector(".guestbook-password-description");
  let guestbookMessages = [];
  let guestbookExpanded = false;
  let guestbookEditId = null;
  let passwordAction = null;
  let administratorMode = false;

  async function guestbookRpc(functionName, payload = {}) {
    const response = await fetch(`${guestbookConfig.url}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: guestbookConfig.key,
        Authorization: `Bearer ${guestbookConfig.key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();
    let result = null;
    if (responseText) {
      try { result = JSON.parse(responseText); } catch (error) { result = responseText; }
    }
    if (!response.ok) {
      const message = result?.message || result?.hint || "요청을 처리하지 못했습니다.";
      throw new Error(message);
    }
    return result;
  }

  function formatGuestbookDate(dateText) {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date(dateText));
  }

  function renderGuestbook() {
    guestbookList.replaceChildren();
    const visibleMessages = guestbookExpanded ? guestbookMessages : guestbookMessages.slice(0, 3);
    visibleMessages.forEach((item) => {
      const card = document.createElement("article");
      card.className = "guestbook-card";

      const message = document.createElement("p");
      message.className = "guestbook-card-message";
      message.textContent = item.message;

      const author = document.createElement("p");
      author.className = "guestbook-card-author";
      author.append("From ");
      const authorName = document.createElement("strong");
      authorName.textContent = item.author;
      author.append(authorName, ` · ${formatGuestbookDate(item.created_at)}`);

      const menu = document.createElement("div");
      menu.className = "guestbook-card-menu";
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "✎";
      editButton.setAttribute("aria-label", `${item.author}님의 메시지 수정`);
      editButton.addEventListener("click", () => openGuestbookEditor(item));
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "×";
      deleteButton.setAttribute("aria-label", `${item.author}님의 메시지 삭제`);
      deleteButton.addEventListener("click", () => openPasswordModal(
        administratorMode ? "admin-delete" : "delete",
        item.id
      ));
      menu.append(editButton, deleteButton);
      card.append(message, author, menu);
      guestbookList.appendChild(card);
    });

    guestbookMore.hidden = guestbookMessages.length <= 3;
    guestbookMore.textContent = guestbookExpanded ? "간단히 보기" : "전체 보기";
    guestbookStatus.textContent = guestbookMessages.length
      ? `총 ${guestbookMessages.length}개의 축하 메시지가 있습니다. / 共有 ${guestbookMessages.length}則祝福留言。`
      : "첫 번째 축하 메시지를 남겨주세요. / 請留下第一則祝福留言。";
    guestbookAdmin.textContent = administratorMode ? "관리 종료" : "관리";
  }

  async function loadGuestbook() {
    guestbookStatus.textContent = "방명록을 불러오는 중입니다. / 正在載入祝福留言。";
    try {
      guestbookMessages = await guestbookRpc("guestbook_list", {
        p_limit: 100,
        p_offset: 0
      }) || [];
      renderGuestbook();
    } catch (error) {
      guestbookStatus.textContent = "방명록을 불러오지 못했습니다. / 無法載入祝福留言。";
    }
  }

  let pageScrollPosition = 0;

  function setPageModalOpen(open) {
    if (open) {
      pageScrollPosition = window.scrollY;
      document.documentElement.classList.add("guestbook-modal-open");
      document.body.classList.add("guestbook-modal-open");
      document.body.style.top = `-${pageScrollPosition}px`;
      return;
    }

    document.documentElement.classList.remove("guestbook-modal-open");
    document.body.classList.remove("guestbook-modal-open");
    document.body.style.top = "";
    window.scrollTo(0, pageScrollPosition);
  }

  function openGuestbookEditor(item = null) {
    guestbookEditId = item?.id || null;
    guestbookModalTitle.innerHTML = item
      ? '<span>축하 메시지 수정하기</span><small lang="zh-HK">修改祝福留言</small>'
      : '<span>축하 메시지 작성하기</span><small lang="zh-HK">歡迎留言祝福我們</small>';
    guestbookSubmit.innerHTML = item
      ? '<span>수정 완료</span><small lang="zh-HK">完成修改</small>'
      : '<span>작성 완료</span><small lang="zh-HK">完成留言</small>';
    guestbookName.value = item?.author || "";
    guestbookPassword.value = "";
    guestbookMessage.value = item?.message || "";
    guestbookCounter.textContent = `${guestbookMessage.value.length} / 200`;
    guestbookFormStatus.textContent = "";
    guestbookModal.hidden = false;
    setPageModalOpen(true);
    setTimeout(() => guestbookName.focus(), 50);
  }

  function closeGuestbookEditor() {
    guestbookModal.hidden = true;
    guestbookForm.reset();
    guestbookEditId = null;
    setPageModalOpen(false);
  }

  function openPasswordModal(action, id = null) {
    passwordAction = { action, id };
    passwordForm.reset();
    passwordStatus.textContent = "";
    const isAdmin = action === "admin-delete" || action === "admin-enable";
    passwordTitle.innerHTML = isAdmin
      ? '<span>관리자 비밀번호 확인</span><small lang="zh-HK">確認管理員密碼</small>'
      : '<span>비밀번호 확인</span><small lang="zh-HK">確認密碼</small>';
    passwordDescription.innerHTML = isAdmin
      ? '<span>설정한 관리자 비밀번호를 입력해 주세요.</span><small lang="zh-HK">請輸入已設定的管理員密碼</small>'
      : '<span>작성할 때 입력한 비밀번호를 입력해 주세요.</span><small lang="zh-HK">請輸入留言時設定的密碼</small>';
    passwordModal.hidden = false;
    setPageModalOpen(true);
    setTimeout(() => actionPassword.focus(), 50);
  }

  function closePasswordModal() {
    passwordModal.hidden = true;
    passwordAction = null;
    setPageModalOpen(false);
  }

  guestbookWrite.addEventListener("click", () => openGuestbookEditor());
  guestbookMore.addEventListener("click", () => {
    guestbookExpanded = !guestbookExpanded;
    renderGuestbook();
  });
  guestbookAdmin.addEventListener("click", () => {
    if (administratorMode) {
      administratorMode = false;
      renderGuestbook();
    } else {
      openPasswordModal("admin-enable");
    }
  });
  guestbookMessage.addEventListener("input", () => {
    guestbookCounter.textContent = `${guestbookMessage.value.length} / 200`;
  });
  document.querySelector(".guestbook-modal-close").addEventListener("click", closeGuestbookEditor);
  guestbookModal.querySelector(".guestbook-modal-backdrop").addEventListener("click", closeGuestbookEditor);
  document.querySelector(".guestbook-password-close").addEventListener("click", closePasswordModal);
  passwordModal.querySelector(".guestbook-modal-backdrop").addEventListener("click", closePasswordModal);

  guestbookForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    guestbookSubmit.disabled = true;
    guestbookFormStatus.textContent = guestbookEditId
      ? "메시지를 수정하고 있습니다. / 正在修改留言。"
      : "메시지를 남기고 있습니다. / 正在提交留言。";
    try {
      const payload = {
        p_author: guestbookName.value.trim(),
        p_message: guestbookMessage.value.trim(),
        p_password: guestbookPassword.value
      };
      if (guestbookEditId) {
        payload.p_id = guestbookEditId;
        await guestbookRpc("guestbook_update", payload);
      } else {
        await guestbookRpc("guestbook_create", payload);
      }
      closeGuestbookEditor();
      await loadGuestbook();
    } catch (error) {
      guestbookFormStatus.textContent = error.message.includes("password")
        ? "비밀번호가 일치하지 않습니다. / 密碼不正確。"
        : error.message;
    } finally {
      guestbookSubmit.disabled = false;
    }
  });

  passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const currentAction = passwordAction;
    const passwordSubmit = document.querySelector(".guestbook-password-submit");
    passwordSubmit.disabled = true;
    passwordStatus.textContent = "확인하고 있습니다. / 正在確認。";
    try {
      if (currentAction.action === "delete") {
        await guestbookRpc("guestbook_delete", {
          p_id: currentAction.id,
          p_password: actionPassword.value
        });
      } else if (currentAction.action === "admin-enable") {
        await guestbookRpc("guestbook_admin_verify", {
          p_admin_password: actionPassword.value
        });
        administratorMode = true;
      } else if (currentAction.action === "admin-delete") {
        await guestbookRpc("guestbook_admin_delete", {
          p_id: currentAction.id,
          p_admin_password: actionPassword.value
        });
      }
      closePasswordModal();
      await loadGuestbook();
    } catch (error) {
      passwordStatus.textContent = "비밀번호가 일치하지 않습니다. / 密碼不正確。";
    } finally {
      passwordSubmit.disabled = false;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!guestbookModal.hidden) closeGuestbookEditor();
    if (!passwordModal.hidden) closePasswordModal();
  });

  loadGuestbook();
}
