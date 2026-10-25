/* ==========================================================================
   contact.js — 联系我们页交互
   验证码绘制 / 留言表单校验 / 提交反馈（静态模板，不真正发送）
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

	const form = document.getElementById('messageForm');
	if (!form) return;

	/* ---------------- 验证码：canvas 绘制四位随机码 ---------------- */
	const codeCanvas = document.getElementById('captchaCanvas');
	const codeInput = document.getElementById('captcha');
	let captchaCode = '';

	const drawCaptcha = () => {
		if (!codeCanvas) return;
		const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
		captchaCode = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
		const ctx = codeCanvas.getContext('2d');
		ctx.fillStyle = '#f0f5f7';
		ctx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);
		for (let i = 0; i < 6; i++) {
			ctx.strokeStyle = `rgba(12,86,180,${0.15 + Math.random() * 0.2})`;
			ctx.beginPath();
			ctx.moveTo(Math.random() * 110, Math.random() * 40);
			ctx.lineTo(Math.random() * 110, Math.random() * 40);
			ctx.stroke();
		}
		captchaCode.split('').forEach((ch, i) => {
			ctx.fillStyle = ['#0c56b4', '#0b4082', '#105fad'][i % 3];
			ctx.font = `bold ${18 + Math.floor(Math.random() * 6)}px Arial`;
			ctx.setTransform(Math.random() * 0.4 - 0.2, 0, Math.random() * 0.3 - 0.15, 1, 0, 0);
			ctx.fillText(ch, 12 + i * 24, 27);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		});
	};

	if (codeCanvas) {
		drawCaptcha();
		codeCanvas.addEventListener('click', drawCaptcha);
		codeCanvas.style.cursor = 'pointer';
		codeCanvas.title = '看不清，点击换一张';
	}

	/* ---------------- 表单校验与提交反馈 ---------------- */
	const tip = document.getElementById('formTip');

	const required = ['yourname', 'phone', 'company', 'email', 'content'];

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		let ok = true;

		required.forEach((id) => {
			const field = document.getElementById(id);
			const empty = !field.value.trim();
			field.placeholder = empty ? '* 必填' : field.dataset.placeholder || field.placeholder;
			field.classList.toggle('is-invalid', empty);
			if (empty) ok = false;
		});

		if (ok && codeCanvas && codeInput.value.trim().toUpperCase() !== captchaCode) {
			codeInput.value = '';
			codeInput.placeholder = '* 验证码不正确';
			codeInput.classList.add('is-invalid');
			drawCaptcha();
			ok = false;
		}

		if (!ok) return;

		/* 静态模板：不真正提交，展示成功反馈 */
		form.reset();
		drawCaptcha();
		if (tip) {
			tip.textContent = '留言已收到，我们会尽快与您联系！（演示模板，数据未上传）';
			tip.classList.add('is-visible');
			setTimeout(() => tip.classList.remove('is-visible'), 5000);
		}
	});
});
