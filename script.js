const photos = [
  { src: "images/KJH02144-2.webp", alt: "웨딩 갤러리 사진 1" },
  { src: "images/KJH02546-2.webp", alt: "웨딩 갤러리 사진 2" }
];

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
