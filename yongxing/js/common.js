/* ==========================================================================
   common.js — 全站共用交互（原生 JS）
   Swiper 命名配置 / AOS 滚动动画 / 移动端抽屉菜单 / 全屏搜索层 / 返回顶部
   ========================================================================== */

/* Swiper 类名接管：全站轮播共用这套自有命名（home.js / about.js 引用） */
window.SWIPER_NAMING = {
	slideClass:                 'slider__slide',
	wrapperClass:               'slider__track',
	slideActiveClass:           'is-active',
	slideVisibleClass:          'is-visible',
	slideDuplicateClass:        'slider__clone',
	slideDuplicateActiveClass:  'is-clone-active',
	slideDuplicateNextClass:    'is-clone-next',
	slideDuplicatePrevClass:    'is-clone-prev',
	slideNextClass:             'is-next',
	slidePrevClass:             'is-prev',
	containerModifierClass:     'slider--',
};

document.addEventListener('DOMContentLoaded', () => {

	/* ---------------- AOS 滚动入场动画 ---------------- */
	AOS.init({
		easing: 'ease-in',
		duration: 700,
		once: true,
	});

	/* ---------------- 返回顶部 ---------------- */
	const backTop = document.getElementById('backTop');
	if (backTop) {
		window.addEventListener('scroll', () => {
			backTop.style.display = window.scrollY > 600 ? 'block' : 'none';
		}, { passive: true });

		backTop.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	/* ---------------- 移动端抽屉菜单 ---------------- */
	const navToggle = document.getElementById('navToggle');
	const siteNav = document.getElementById('siteNav');
	if (navToggle && siteNav) {
		navToggle.addEventListener('click', () => {
			navToggle.classList.toggle('is-open');
			siteNav.style.display = siteNav.style.display === 'block' ? 'none' : 'block';
		});
	}

	/* ---------------- 全屏搜索层 ---------------- */
	const searchOpen = document.getElementById('searchOpen');
	const searchLayer = document.getElementById('searchLayer');
	const searchClose = document.getElementById('searchClose');
	if (searchOpen && searchLayer) {
		searchOpen.addEventListener('click', () => {
			searchLayer.style.display = 'block';
		});
	}
	if (searchClose && searchLayer) {
		searchClose.addEventListener('click', () => {
			searchLayer.style.display = 'none';
		});
	}
});
