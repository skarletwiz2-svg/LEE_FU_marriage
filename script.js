const photos = [
  { src: "images/KJH02144-2.jpg?v=20260721-8", alt: "웨딩 갤러리 사진 1" },
  { src: "images/KJH02546-2.jpg?v=20260721-8", alt: "웨딩 갤러리 사진 2" }
];

const invitation = document.querySelector(".invitation");
const heroPreloader = new Image();
let animationStarted = false;

function startInvitationAnimation(forceRestart = false) {
  if (animationStarted && !forceRestart) return;
  animationStarted = true;
  invitation.classList.remove("is-ready");
  void invitation.offsetWidth;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => invitation.classList.add("is-ready"));
  });
}

heroPreloader.addEventListener("load", () => startInvitationAnimation());
heroPreloader.addEventListener("error", () => startInvitationAnimation());
heroPreloader.src = "images/KJH02739-2-hero.jpg";
if (heroPreloader.complete) startInvitationAnimation();
setTimeout(() => startInvitationAnimation(), 4000);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) startInvitationAnimation(true);
});

const lightbox = document.querySelector(".lightbox");
const fullImage = document.querySelector(".lightbox-image");
const counter = document.querySelector(".lightbox-count");
let currentPhotoIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
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
  if (event.touches.length !== 1) return;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });

lightbox.addEventListener("touchend", (event) => {
  if (event.changedTouches.length !== 1) return;
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
  const isNext = deltaX < 0;
  slideToPhoto(currentPhotoIndex + (isNext ? 1 : -1), isNext ? "next" : "previous");
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  if (event.key === "ArrowLeft" && !lightbox.hidden) slideToPhoto(currentPhotoIndex - 1, "previous");
  if (event.key === "ArrowRight" && !lightbox.hidden) slideToPhoto(currentPhotoIndex + 1, "next");
});
