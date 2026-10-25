/* ==========================================================================
   home.js — 首页轮播（Swiper，通过配置项接管其默认类名）
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

	const SWIPER_NAMING = window.SWIPER_NAMING;

	/* ---------------- 首屏 Banner：淡入淡出 + 数字分页 + 进度线 ---------------- */
	new Swiper('.hero__slider', {
		...SWIPER_NAMING,
		loop: true,
		effect: 'fade',
		fade: { crossFade: true },
		autoplay: 2500,
		speed: 2500,
		autoplayDisableOnInteraction: false,
		centeredSlides: true,
		slidesPerView: 1,
		spaceBetween: 0,
		initialSlide: 0,
		slideToClickedSlide: true,
		pagination: '.hero__pages',
		paginationType: 'fraction',
		paginationModifierClass: 'hero__pages--',
		paginationClickable: true,
		paginationCurrentClass: 'hero__pages-now',
		paginationTotalClass: 'hero__pages-all',
		paginationCustomRender(swiper, current, total) {
			return `<span class="hero__pages-now">${current}</span> / <span class="hero__pages-all">${total}</span>`;
		},
	});

	/* ---------------- 产品中心：四列轮播 ---------------- */
	new Swiper('.products__slider', {
		...SWIPER_NAMING,
		slidesPerView: 4,
		spaceBetween: 15,
		speed: 1800,
		loop: true,
		autoplay: 5000,
		autoplayDisableOnInteraction: false,
		simulateTouch: true,
		slideToClickedSlide: true,
		prevButton: '#prodPrev',
		nextButton: '#prodNext',
		breakpoints: {
			1200: { slidesPerView: 3 },
			950:  { slidesPerView: 2 },
			768:  { slidesPerView: 1 },
		},
	});

	/* ---------------- 工程案例：四列轮播 ---------------- */
	new Swiper('.cases__slider', {
		...SWIPER_NAMING,
		slidesPerView: 4,
		spaceBetween: 30,
		speed: 1800,
		loop: true,
		autoplay: 5000,
		autoplayDisableOnInteraction: false,
		simulateTouch: true,
		slideToClickedSlide: true,
		prevButton: '.cases__arrow--prev',
		nextButton: '.cases__arrow--next',
		breakpoints: {
			1200: { slidesPerView: 3 },
			950:  { slidesPerView: 2 },
			768:  { slidesPerView: 1 },
		},
	});
});
