/* ==========================================================================
   archive.js — 产品列表页交互
   平板/手机端：点击侧栏“全部”标题，展开或收起分类树（原站 ≤1024 启用）
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

	const asideToggle = document.querySelector('.archive-aside__all');
	const asideCats = document.querySelector('.archive-aside__cats');

	if (asideToggle && asideCats) {
		asideToggle.addEventListener('click', (event) => {
			if (!window.matchMedia('(max-width: 1024px)').matches) return;
			event.preventDefault(); // 手风琴模式下阻止“全部”链接跳转
			asideCats.style.display = asideCats.style.display === 'block' ? 'none' : 'block';
		});
	}
});
