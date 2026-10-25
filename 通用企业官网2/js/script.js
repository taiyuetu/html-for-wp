/* ============================================================
   机电电气企业官网 - 交互脚本（原生 JS 重写）
   头部滚动状态 / 首屏淡入轮播 / 数字滚动 / 移动端菜单
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 头部：滚动后加白色背景并收缩 ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    var top = window.pageYOffset || document.documentElement.scrollTop;
    if (top > 15) {
      header.classList.add('mh');
      header.classList.add('bj');
    } else {
      header.classList.remove('mh');
      header.classList.remove('bj');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var spNav = document.getElementById('spNav');
  var sjjNav = document.getElementById('sjjNav');
  if (spNav && sjjNav) {
    spNav.addEventListener('click', function () {
      var open = sjjNav.classList.toggle('open');
      spNav.classList.toggle('cli', open);
    });
    // 二级菜单展开/收起
    var subs = sjjNav.querySelectorAll('i[data-sub]');
    for (var i = 0; i < subs.length; i++) {
      subs[i].addEventListener('click', function () {
        var ul = this.parentNode.querySelector('ul');
        var isOpen = ul.style.display === 'block';
        ul.style.display = isOpen ? 'none' : 'block';
        this.classList.toggle('se', !isOpen);
      });
    }
  }

  /* ---------- 工具：补零 ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---------- 首屏淡入轮播 ---------- */
  (function () {
    var box = document.getElementById('banSwiper');
    if (!box) return;
    var slides = box.querySelectorAll('.ban-slide');
    var spanBox = document.getElementById('banSpan');
    var cur = document.getElementById('banCur');
    var total = document.getElementById('banTotal');
    var idx = 0, timer = null, dots = [];

    total.textContent = pad(slides.length);

    for (var i = 0; i < slides.length; i++) {
      var d = document.createElement('span');
      d.setAttribute('data-i', i);
      spanBox.appendChild(d);
      dots.push(d);
    }

    function show(n) {
      idx = (n + slides.length) % slides.length;
      for (var j = 0; j < slides.length; j++) {
        slides[j].classList.toggle('active', j === idx);
        dots[j].classList.toggle('on', j === idx);
      }
      cur.textContent = pad(idx + 1);
    }

    function play() {
      timer = setInterval(function () { show(idx + 1); }, 5000);
    }

    spanBox.addEventListener('click', function (e) {
      var t = e.target;
      if (t.tagName === 'SPAN') {
        clearInterval(timer);
        show(parseInt(t.getAttribute('data-i'), 10));
        play();
      }
    });

    show(0);
    play();
  })();

  /* ---------- 详情页：缩略图画廊 ---------- */
  (function () {
    var thumbs = document.getElementById('thumbs');
    var mainPic = document.getElementById('mainPic');
    if (!thumbs || !mainPic) return;
    var items = thumbs.children;
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function () {
        for (var j = 0; j < items.length; j++) items[j].classList.remove('on');
        this.classList.add('on');
        mainPic.src = this.querySelector('img').src;
      });
    }
  })();

  /* ---------- 详情页：选项卡 ---------- */
  (function () {
    var hd = document.getElementById('tabHd');
    if (!hd) return;
    var tabs = hd.children;
    var panes = document.querySelectorAll('.tab_bd .tab_pane');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        var id = this.getAttribute('data-tab');
        for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove('on');
        this.classList.add('on');
        for (var k = 0; k < panes.length; k++) {
          panes[k].classList.toggle('on', panes[k].id === id);
        }
      });
    }
  })();

  /* ---------- 数字滚动 ---------- */
  (function () {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    var done = false;

    function animate(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var dur = 2000, t0 = null;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(target * p);
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    function check() {
      if (done) return;
      var num = document.querySelector('.num');
      if (!num) return;
      var rect = num.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        done = true;
        for (var i = 0; i < counters.length; i++) animate(counters[i]);
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  })();

  /* ---------- 图片展示：分类筛选 ---------- */
  (function () {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;
    var items = grid.children;
    var links = document.querySelectorAll('[data-gcat]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        e.preventDefault();
        var cat = this.getAttribute('data-gcat');
        for (var j = 0; j < links.length; j++) links[j].classList.remove('on');
        // 同步高亮顶部分类条与侧边栏里的相同分类
        for (var k = 0; k < links.length; k++) {
          if (links[k].getAttribute('data-gcat') === cat) links[k].classList.add('on');
        }
        for (var m = 0; m < items.length; m++) {
          var show = cat === 'all' || items[m].getAttribute('data-cat') === cat;
          items[m].classList.toggle('hide', !show);
        }
      });
    }
  })();

  /* ---------- 灯箱（lightbox）：容器加 data-lightbox 即生效 ---------- */
  (function () {
    var boxes = document.querySelectorAll('[data-lightbox]');
    if (!boxes.length) return;

    // 动态创建灯箱结构，页面无需预置标记
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', '图片查看');
    lb.innerHTML =
      '<button class="lb_btn lb_close" type="button" aria-label="关闭"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<button class="lb_btn lb_prev" type="button" aria-label="上一张"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>' +
      '<figure class="lb_body"><img src="" alt=""><figcaption class="lb_cap"><span class="lb_txt"></span><span class="lb_count"></span></figcaption></figure>' +
      '<button class="lb_btn lb_next" type="button" aria-label="下一张"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>';
    document.body.appendChild(lb);

    var img = lb.querySelector('img');
    var txt = lb.querySelector('.lb_txt');
    var count = lb.querySelector('.lb_count');
    var btnClose = lb.querySelector('.lb_close');
    var btnPrev = lb.querySelector('.lb_prev');
    var btnNext = lb.querySelector('.lb_next');
    var list = [], idx = 0, lastTrigger = null;

    // 收集容器内的图片链接（无链接时退回收集 img）；被筛选隐藏的项不进入灯箱
    function collect(box) {
      var arr = [], nodes = box.querySelectorAll('a');
      if (!nodes.length) nodes = box.querySelectorAll('img');
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var pic = n.tagName === 'A' ? n.querySelector('img') : n;
        if (!pic) continue;
        if (hiddenByFilter(n, box)) continue;
        arr.push({
          el: n,
          src: n.tagName === 'A' ? n.getAttribute('href') : n.getAttribute('src'),
          cap: n.getAttribute('data-caption') || pic.getAttribute('alt') || ''
        });
      }
      return arr;
    }

    function hiddenByFilter(n, box) {
      var t = n.parentNode;
      while (t && t !== box) {
        if (t.classList && t.classList.contains('hide')) return true;
        t = t.parentNode;
      }
      return false;
    }

    function render() {
      var it = list[idx];
      lb.classList.remove('loaded');
      img.src = it.src;
      img.alt = it.cap;
      txt.textContent = it.cap;
      count.textContent = (idx + 1) + ' / ' + list.length;
      if (img.complete) {
        lb.classList.add('loaded');
      } else {
        img.onload = function () { lb.classList.add('loaded'); };
      }
    }

    function open(box, el) {
      list = collect(box);
      if (!list.length) return;
      for (var i = 0; i < list.length; i++) {
        if (list[i].el === el) { idx = i; break; }
      }
      lastTrigger = document.activeElement;
      lb.classList.add('open');
      document.body.classList.add('lb_lock');
      render();
      btnClose.focus();
    }

    function close() {
      lb.classList.remove('open', 'loaded');
      document.body.classList.remove('lb_lock');
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    }

    function step(d) {
      idx = (idx + d + list.length) % list.length;
      render();
    }

    for (var b = 0; b < boxes.length; b++) {
      // 链接模式优先；容器内没有 <a> 时（如 pic_grid 裸图）退回 img 模式
      var box = boxes[b];
      var mode = box.querySelectorAll('a').length ? 'A' : 'IMG';
      (function (box, tag) {
        box.addEventListener('click', function (e) {
          // 手动向上查找目标元素，避免依赖 Element.closest
          var t = e.target, hit = null;
          while (t && t !== box) {
            if (t.tagName === tag) { hit = t; break; }
            t = t.parentNode;
          }
          if (!hit) return;
          e.preventDefault();
          open(box, hit);
        });
      })(box, mode);
    }

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { step(-1); });
    btnNext.addEventListener('click', function () { step(1); });

    // 点击空白处关闭
    lb.addEventListener('click', function (e) {
      var n = e.target;
      if (n === lb || n === lb.querySelector('.lb_body')) close();
    });

    // 键盘：Esc 关闭 / 左右切换 / Tab 在按钮间循环
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.keyCode === 27) close();
      else if (e.keyCode === 37) step(-1);
      else if (e.keyCode === 39) step(1);
      else if (e.keyCode === 9) {
        var f = lb.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // 移动端左右滑动切换
    var sx = 0;
    lb.addEventListener('touchstart', function (e) {
      sx = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  })();

  /* ---------- 首页：图片展示轮播 ---------- */
  (function () {
    var wrap = document.getElementById('gcWrap');
    var track = document.getElementById('gcTrack');
    if (!wrap || !track) return;
    var items = track.children;
    var dotsBox = document.getElementById('gcDots');
    var prevBtn = document.getElementById('gcPrev');
    var nextBtn = document.getElementById('gcNext');
    var idx = 0, timer = null;

    // 视口内同时显示的张数：>=1000px 一屏 3 张，>=640px 2 张，其余 1 张
    function perView() {
      var w = window.innerWidth;
      if (w >= 1000) return 3;
      if (w >= 640) return 2;
      return 1;
    }
    function maxIdx() { return Math.max(0, items.length - perView()); }

    function buildDots() {
      dotsBox.innerHTML = '';
      for (var i = 0; i <= maxIdx(); i++) {
        var d = document.createElement('span');
        d.setAttribute('data-i', i);
        dotsBox.appendChild(d);
      }
    }

    // 轨道宽度恒等于可视区宽度，平移百分比即单张宽度
    function show(n) {
      idx = Math.max(0, Math.min(n, maxIdx()));
      track.style.transform = 'translateX(-' + (idx * 100 / perView()) + '%)';
      var dots = dotsBox.children;
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('on', i === idx);
    }

    function play() {
      stop();
      timer = setInterval(function () {
        show(idx >= maxIdx() ? 0 : idx + 1);
      }, 4000);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function relayout() {
      buildDots();
      if (idx > maxIdx()) idx = maxIdx();
      show(idx);
    }

    prevBtn.addEventListener('click', function () {
      show(idx <= 0 ? maxIdx() : idx - 1);
      play();
    });
    nextBtn.addEventListener('click', function () {
      show(idx >= maxIdx() ? 0 : idx + 1);
      play();
    });
    dotsBox.addEventListener('click', function (e) {
      if (e.target.tagName === 'SPAN') {
        show(parseInt(e.target.getAttribute('data-i'), 10));
        play();
      }
    });

    // 悬停暂停自动播放
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', play);

    // 移动端左右滑动切换
    var sx = 0;
    wrap.addEventListener('touchstart', function (e) {
      sx = e.changedTouches[0].clientX;
      stop();
    }, { passive: true });
    wrap.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) show(dx < 0 ? idx + 1 : idx - 1);
      play();
    }, { passive: true });

    window.addEventListener('resize', relayout);
    relayout();
    play();
  })();
})();
