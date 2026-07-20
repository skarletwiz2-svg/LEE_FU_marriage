const photos = [
  { src: "images/KJH02144-2.jpg", alt: "웨딩 갤러리 사진 1" },
  { src: "images/KJH02546-2.jpg", alt: "웨딩 갤러리 사진 2" }
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

function showPhoto(index) {
  currentPhotoIndex = (index + photos.length) % photos.length;
  fullImage.src = photos[currentPhotoIndex].src;
  fullImage.alt = photos[currentPhotoIndex].alt;
  counter.textContent = `${String(currentPhotoIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
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
  showPhoto(currentPhotoIndex + (deltaX < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  if (event.key === "ArrowLeft" && !lightbox.hidden) showPhoto(currentPhotoIndex - 1);
  if (event.key === "ArrowRight" && !lightbox.hidden) showPhoto(currentPhotoIndex + 1);
});
