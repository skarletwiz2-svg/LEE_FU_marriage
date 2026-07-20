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

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll(".photo-button").forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.index);
    fullImage.src = photos[index].src;
    fullImage.alt = photos[index].alt;
    counter.textContent = `${String(index + 1).padStart(2, "0")} / 02`;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.querySelector(".close-button").focus();
  });
});

document.querySelector(".close-button").addEventListener("click", closeLightbox);
document.querySelector(".lightbox-backdrop").addEventListener("click", closeLightbox);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});
