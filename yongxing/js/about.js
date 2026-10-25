/* ==========================================================================
   about.js — 关于我们页交互
   荣誉资质证书轮播（Swiper，复用全站类名接管配置）
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

	new Swiper('.certs__slider', {
		...window.SWIPER_NAMING,
		slidesPerView: 3,
		spaceBetween: 25,
		speed: 1200,
		loop: true,
		autoplay: 3000,
		autoplayDisableOnInteraction: false,
		simulateTouch: true,
		breakpoints: {
			950: { slidesPerView: 2 },
			768: { slidesPerView: 1 },
		},
	});
});
