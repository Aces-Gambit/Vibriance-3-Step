import Swiper from "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js";

const swiper = new Swiper('.swiper', {
  // Optional parameters
  loop: true,
  // slidesPerView: "auto",
  centeredSlides: true,
  spaceBetween: 20,
  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
  },
  // autoplay: {
  //   delay: 2500,
  //   disableOnInteraction: false,
  // },
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
        },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});

const swiperBlog = new Swiper('.swiper-blog', {
  // Optional parameters
  loop: true,
  // slidesPerView: "auto",
  centeredSlides: true,
  spaceBetween: 20,
  // If we need pagination
  pagination: {
    el: ".swiper-pagination-blog",
    dynamicBullets: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});
