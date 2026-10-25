/* ============================================================================
   SHANYIN 山隐 — site search
   ----------------------------------------------------------------------------
   A small static index and a scoring client. No backend: the whole mountain
   is in INDEX below — the nine lots, the six journal notes, and the pages
   between them. The query arrives as ?q=… (the form is a plain GET form, so
   it works without JS up to the point of carrying the query across; ranking
   the results needs this file).

   Scoring: each query term is matched against title (weight 3), keywords
   (weight 2) and body text (weight 1); entries need at least one hit.
   ========================================================================== */

(function () {
  'use strict';

  var input  = document.querySelector('#s-q');
  var out    = document.querySelector('[data-results]');
  var count  = document.querySelector('[data-count]');
  var empty  = document.querySelector('[data-empty]');
  if (!input || !out) return;

  /* --- the index ------------------------------------------------------------ */

  var LOTS = [
    ['Lot 01 — Mist Peak · Huangshan Maofeng', 'product.html?lot=01',
     'lot 01 mist peak yunwu maofeng roasted orchid chestnut fuxi flagship green tea',
     'Roasted · orchid, chestnut. 800 m · Fuxi. Picked April 2026. From £42 / 50 g.'],
    ['Lot 02 — Jade Dew · Enshi Yulu', 'product.html?lot=02',
     'lot 02 jade dew yulu steamed sweet pea cut grass enshi green tea',
     'Steamed · sweet pea, cut grass. 1,100 m · Enshi. Picked April 2026. From £56 / 50 g.'],
    ['Lot 03 — White Leaf · Anji Baicha', 'product.html?lot=03',
     'lot 03 white leaf baicha pan-fired cream melon anji theanine green tea',
     'Pan-fired · cream, melon. 600 m · Anji. Picked April 2026. From £48 / 50 g.'],
    ['Lot 04 — Monkey Chief · Taiping Houkui', 'product.html?lot=04',
     'lot 04 monkey chief houkui taiping pan-fired magnolia bamboo allocated',
     'Pan-fired · magnolia, fresh bamboo. 700 m · Taiping. Picked April 2026. From £64 / 50 g.'],
    ['Lot 05 — Spring Snail · Dongting Biluochun', 'product.html?lot=05',
     'lot 05 spring snail biluochun dongting pan-fired apricot honey sold out',
     'Pan-fired · apricot, wild honey. 300 m · Dongting. Picked April 2026. From £58 / 50 g.'],
    ['Lot 06 — Fog Needle · Steamed Maofeng', 'product.html?lot=06',
     'lot 06 fog needle steamed maofeng nori snow pea fuxi green tea release',
     'Steamed · cut grass, nori, snow pea. 840 m · Fuxi. Picked April 2026. From £52 / 50 g.'],
    ['Lot 07 — Silver Tip · Xinyang Maojian', 'product.html?lot=07',
     'lot 07 silver tip maojian xinyang roasted chestnut soy everyday',
     'Roasted · chestnut, fresh soy. 500 m · Xinyang. Picked April 2026. From £38 / 50 g.'],
    ['Lot 08 — Melon Seed · Lu\u2019an Guapian', 'product.html?lot=08',
     'lot 08 melon seed guapian luan roasted toasted smoke charcoal may',
     'Roasted · toasted seed, warm smoke. 400 m · Lu\u2019an. Picked May 2026. From £36 / 50 g.'],
    ['Lot 09 — Dragon Well · West Lake Longjing', 'product.html?lot=09',
     'lot 09 dragon well longjing west lake pan-fired hazelnut cream allocated',
     'Pan-fired · toasted hazelnut, cream. 300 m · West Lake. Picked April 2026. From £62 / 50 g.']
  ];

  var NOTES = [
    ['Off-season on the north slope', 'news-post.html?post=off-season-on-the-north-slope',
     'off season winter rest pruning terrace october september cold',
     'The terraces are resting. What the mountain does between Octobers — and why a cold winter is a good vintage announcement.'],
    ['Organic renewal, and the 486 panel, explained', 'news-post.html?post=organic-renewal-and-the-486-panel',
     'organic eu certification renewal sgs pesticide panel audit rejection',
     'Two certificates, one audit trail, and why we publish the failures too.'],
    ['How to read a lot sheet', 'news-post.html?post=how-to-read-a-lot-sheet',
     'lot sheet papers trade shipping documents numbers argue harvest date',
     'Every shipment comes with papers. Here is what the numbers mean, and which ones to argue with.'],
    ['Fog Needle joins the archive', 'news-post.html?post=fog-needle-joins-the-archive',
     'fog needle release steamed experiment new lot archive export',
     'The experiment that stayed: the same leaf as Mist Peak, one week later, finished by steam.'],
    ['The 2026 pick is in', 'news-post.html?post=the-2026-pick-is-in',
     '2026 pick harvest spring lots kilos qingming drying room',
     'Four days, two hundred hands, and the shortest window of our year. The lots are out of the drying room and into the tins.'],
    ['Why we pick before Qingming', 'news-post.html?post=why-we-pick-before-qingming',
     'qingming pre-qingming picking chemistry theanine catechins rain window',
     'The four days before the rains are not superstition. They are chemistry, and a little stubbornness.']
  ];

  var PAGES = [
    ['About — two families, one mountain', 'about.html',
     'about people family founded 2019 story pickers principles team li wenshan visit',
     'Three terraces on the north slopes of Huangshan, worked by two families and two hundred pairs of hands.'],
    ['Contact — enquiries', 'contact.html',
     'contact enquiry wholesale private label hospitality press sample email phone visit appointment',
     'Write to the mountain. We reply within two working days, Huangshan time.'],
    ['The archive — spring 2026 lots', 'products.html',
     'archive lots collection all nine spring 2026 filter roasted pan-fired steamed',
     'Nine lots, one spring — every lot numbered, dated and traceable to a single terrace.'],
    ['Origin — cloud, stone, leaf', 'index.html#origin',
     'origin altitude terraces huangshan soil granite slope north facing elevation',
     'Cloud first, then stone, then leaf. The north slopes between 760 and 840 metres.'],
    ['Harvest — four days a year', 'index.html#harvest',
     'harvest picking qingming hands buds kilo morning fog season',
     'Four days a year. Two hundred pairs of hands. Forty thousand buds per finished kilo.'],
    ['Craft — wither, fix, shape', 'index.html#craft',
     'craft wither fix shape wok 220 rolling firing process',
     'The leaf decides. We only follow — three moves, a hundred and ten years of habit.'],
    ['Ritual — brewing', 'index.html#ritual',
     'ritual brewing grams degrees seconds gaiwan infusion pour water temperature',
     'Three grams. Eighty degrees. Ninety seconds. Green tea is not brewed, it is interrupted.'],
    ['Assurance — papers & certificates', 'index.html#quality',
     'assurance quality organic eu iso 22000 haccp pesticide panel trace qr papers',
     'Every lot carries its own papers — EU Organic, the SGS panel, ISO 22000, farm trace.'],
    ['Export — twenty-one countries', 'index.html#export',
     'export countries fob shanghai ningbo minimum order volume ports shipping',
     'Quietly, to twenty-one countries. FOB Shanghai or Ningbo, minimum order twenty kilos.']
  ];

  var INDEX = [];
  LOTS.forEach(function (e)  { INDEX.push({ t: e[0], url: e[1], k: e[2], x: e[3], type: 'Lot' }); });
  NOTES.forEach(function (e) { INDEX.push({ t: e[0], url: e[1], k: e[2], x: e[3], type: 'Journal' }); });
  PAGES.forEach(function (e) { INDEX.push({ t: e[0], url: e[1], k: e[2], x: e[3], type: 'Page' }); });

  /* --- scoring --------------------------------------------------------------- */

  function tokens(q) {
    return q.toLowerCase().split(/[^a-z0-9\u4e00-\u9fff']+/).filter(function (t) {
      return t.length > 1;
    });
  }

  function hits(term, text) {
    if (!term) return 0;
    var n = 0, i = -1;
    text = text.toLowerCase();
    while ((i = text.indexOf(term, i + 1)) !== -1) n++;
    return n;
  }

  function search(q) {
    var terms = tokens(q);
    if (!terms.length) return [];
    return INDEX.map(function (entry) {
      var score =
        terms.reduce(function (s, t) { return s + hits(t, entry.t) * 3; }, 0) +
        terms.reduce(function (s, t) { return s + hits(t, entry.k) * 2; }, 0) +
        terms.reduce(function (s, t) { return s + hits(t, entry.x); }, 0);
      return { entry: entry, score: score };
    }).filter(function (r) {
      return r.score > 0;
    }).sort(function (a, b) {
      return b.score - a.score;
    }).map(function (r) {
      return r.entry;
    });
  }

  /* --- rendering -------------------------------------------------------------- */

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function render(q) {
    var results = q ? search(q) : [];

    input.value = q;

    if (!q) {
      count.textContent = 'Type above to search the mountain.';
      out.hidden = true;
      out.innerHTML = '';
      empty.hidden = true;
      return;
    }

    count.textContent = results.length
      ? 'Showing ' + pad(results.length) + (results.length === 1 ? ' result' : ' results') + ' for \u201c' + q + '\u201d'
      : 'No results for \u201c' + q + '\u201d';

    out.innerHTML = results.map(function (e) {
      return '<a class="srow" href="' + e.url + '">' +
        '<span class="srow__type">' + e.type + '</span>' +
        '<span class="srow__title">' + e.t + '</span>' +
        '<span class="srow__x">' + e.x + '</span>' +
      '</a>';
    }).join('');
    out.hidden = results.length === 0;
    empty.hidden = results.length !== 0;
  }

  // Submit without a full page reload — keeps the URL shareable either way
  var form = input.form;
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      try {
        window.history.replaceState(null, '', q ? '?q=' + encodeURIComponent(q) : location.pathname);
      } catch (err) { /* file:// — the results still render */ }
      render(q);
    });
  }

  var initial = '';
  try {
    initial = new URLSearchParams(window.location.search).get('q') || '';
  } catch (err) {
    initial = (window.location.search.match(/[?&]q=([^&]*)/) || ['', ''])[1];
    initial = initial ? decodeURIComponent(initial) : '';
  }
  render(initial.trim());

})();
