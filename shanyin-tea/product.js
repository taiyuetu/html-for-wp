/* ============================================================================
   SHANYIN 山隐 — single product page
   ----------------------------------------------------------------------------
   One template, nine lots. The page ships as Lot 01 in the markup (that is
   what crawlers and no-JS visitors see); this module reads ?lot=NN and re-
   renders every data-driven block from the LOTS map below — title, breadcrumb,
   plate, status, price, spec ledger, story, figures, brewing ritual, the
   "more from the archive" rows, and the JSON-LD block.

   Only ?lot=NN (two digits) is accepted; anything else falls back to Lot 01.
   ========================================================================== */

(function () {
  'use strict';

  var STATUS = {
    ok:  { label: 'Available',    cls: 'stat--ok',  availability: 'https://schema.org/InStock' },
    mid: { label: 'Allocated',    cls: 'stat--mid', availability: 'https://schema.org/LimitedAvailability' },
    off: { label: 'Sold out',     cls: 'stat--off', availability: 'https://schema.org/SoldOut' }
  };

  var ENQUIRE = {
    ok:  'Enquire about this lot',
    mid: 'Ask about allocation',
    off: 'Join the 2027 list'
  };

  var LOTS = {
    '01': {
      name: 'Mist Peak',
      han: '云雾 · Huangshan Maofeng',
      process: 'Roasted',
      garden: 'Fuxi',
      altitude: '800 m',
      picked: 'April 2026',
      price: 42,
      status: 'ok',
      plate: 'ph--t1',
      imgAlt: 'Placeholder image: dried Maofeng leaves, pale down visible',
      lead: 'The flagship lot — the home terrace at eight hundred metres, where the fog sits longest and the buds come in small, tight and pale.',
      plotTitle: 'Picked in the fog,<br>finished in the <em>wok</em>.',
      story: [
        'Mist Peak comes off the north shoulder of the home terrace, the part the cloud crosses last each morning. The leaf is small and the picking is slow: three to four kilos of fresh leaf per picker in a morning, most of it in the two hours before the sun clears the ridge.',
        'The firing is low and patient — ninety seconds in the wok, then a rest over charcoal while the orchid note settles. Drink it inside the first month for the chestnut sweetness, or leave it six and the mountain comes back through the cup.'
      ],
      figures: [
        ['Pick window', '1–4 April'],
        ['Terrace', 'North slope, Fuxi'],
        ['Buds per kilo', '40,000']
      ],
      brewTitle: 'Three grams.<br>Eighty degrees.<br><em>Ninety</em> seconds.',
      brewNote: 'Water below boiling, and no lid on the first infusion — the second will be the better one.',
      steps: [
        ['03 g', 'leaf per 150 ml'],
        ['80 °C', 'spring water, never boiling'],
        ['90 s', 'first infusion, no lid'],
        ['×3', 'the leaf will keep giving']
      ]
    },
    '02': {
      name: 'Jade Dew',
      han: '玉露 · Enshi Yulu',
      process: 'Steamed',
      garden: 'Enshi',
      altitude: '1,100 m',
      picked: 'April 2026',
      price: 56,
      status: 'ok',
      plate: 'ph--t2',
      imgAlt: 'Placeholder image: deep green steamed needles, straight and glossy',
      lead: 'The one lot we never wok: steamed within three hours of picking, and greener than anything else we make.',
      plotTitle: 'The one lot that never<br>meets the <em>wok</em>.',
      story: [
        'Jade Dew grows on the highest garden we work, at eleven hundred metres in Enshi, where the leaf ripens a full two weeks behind the valley. Steam, not fire, stops the oxidation — within three hours of picking, in batches of a few kilos at a time.',
        'The result pins the green in place: sweet pea and cut grass, a liquor the colour of young bamboo. It asks for cooler water than the fired lots, and rewards the patience.'
      ],
      figures: [
        ['Pick window', '2–5 April'],
        ['Terrace', 'High garden, Enshi'],
        ['Steamed within', '3 hours']
      ],
      brewTitle: 'Three grams.<br><em>Sixty</em> degrees.<br>Two minutes.',
      brewNote: 'The cooler the water, the longer the green holds. Sixty degrees feels wrong and tastes right.',
      steps: [
        ['03 g', 'leaf per 100 ml'],
        ['60 °C', 'cooled spring water'],
        ['120 s', 'first infusion, no lid'],
        ['×4', 'and it stays sweet']
      ]
    },
    '03': {
      name: 'White Leaf',
      han: '白叶 · Anji Baicha',
      process: 'Pan-fired',
      garden: 'Anji',
      altitude: '600 m',
      picked: 'April 2026',
      price: 48,
      status: 'ok',
      plate: 'ph--t3',
      imgAlt: 'Placeholder image: pale white-leaf cultivar leaves on paper',
      lead: 'A pale cultivar that only turns white below eighteen degrees — which is why it is always the first leaf we pick.',
      plotTitle: 'Pale until the spring<br>turns <em>warm</em>.',
      story: [
        'The Anji cultivar only turns white below eighteen degrees, which narrows the picking window to a handful of mornings each April. Against white paper the leaf is nearly translucent.',
        'It is pan-fired like a Longjing but tastes of nowhere else: cream, melon, a cool mineral finish. The bitterness barely arrives; the theanine does the talking.'
      ],
      figures: [
        ['Pick window', '5–9 April'],
        ['Terrace', 'Valley garden, Anji'],
        ['Leaf turns white', 'Below 18 °C']
      ],
      brewTitle: 'Three grams.<br>Eighty degrees.<br><em>Barely</em> a minute.',
      brewNote: 'A short pull at eighty degrees. If the cup turns bitter, the water was the problem, not the leaf.',
      steps: [
        ['03 g', 'leaf per 150 ml'],
        ['80 °C', 'spring water, never boiling'],
        ['75 s', 'first infusion, no lid'],
        ['×4', 'the cup stays quiet']
      ]
    },
    '04': {
      name: 'Monkey Chief',
      han: '太平猴魁 · Taiping Houkui',
      process: 'Pan-fired',
      garden: 'Taiping',
      altitude: '700 m',
      picked: 'April 2026',
      price: 64,
      status: 'mid',
      plate: 'ph--t4',
      imgAlt: 'Placeholder image: long flat Houkui leaves pressed between paper',
      lead: 'Two leaves and a bud pressed flat as paper. The largest leaf we handle, and the gentlest hand it needs.',
      plotTitle: 'The biggest leaf,<br>the gentlest <em>hand</em>.',
      story: [
        'Monkey Chief is the drama of the season — leaves up to seven centimetres, pressed flat between meshes while they fire, which chars a faint net into the surface and holds the magnolia scent in.',
        'It drinks greener than it looks and forgives everything: a big flask, cool water, an hour of steeping on the desk. The last cup is rarely the worst one.'
      ],
      figures: [
        ['Pick window', '12–16 April'],
        ['Terrace', 'Gully garden, Taiping'],
        ['Leaf length', 'Up to 7 cm']
      ],
      brewTitle: 'Four grams.<br>Eighty-five degrees.<br><em>Three</em> minutes.',
      brewNote: 'Forgiving by nature — hot water, a big vessel, and time. It is the one lot made to be forgotten on the desk.',
      steps: [
        ['04 g', 'leaf per 300 ml'],
        ['85 °C', 'hot but never boiling'],
        ['3 min', 'steeped long, no strainer'],
        ['×3', 'top up as you go']
      ]
    },
    '05': {
      name: 'Spring Snail',
      han: '碧螺春 · Dongting Biluochun',
      process: 'Pan-fired',
      garden: 'Dongting',
      altitude: '300 m',
      picked: 'April 2026',
      price: 58,
      status: 'off',
      plate: 'ph--t5',
      imgAlt: 'Placeholder image: small curled Biluochun spirals, white-fleeced',
      lead: 'Picked between the peach and plum trees above Lake Tai, and curled by hand the same afternoon. The smallest leaf we buy.',
      plotTitle: 'Half a morning<br>per finished <em>kilo</em>.',
      story: [
        'Spring Snail grows between the orchard rows above Lake Tai, and the fruit is quietly in the cup — apricot first, then wild honey. Half a morning\u2019s picking by thirty hands makes one kilo.',
        'The curling is done the same afternoon by two women we have worked with for six years. This year\u2019s lot was gone inside a fortnight; it returns with the April boats.'
      ],
      figures: [
        ['Pick window', '18–22 April'],
        ['Terrace', 'Orchard rows, Dongting'],
        ['Buds per kilo', '≈ 60,000']
      ],
      brewTitle: 'Three grams.<br>Seventy-five degrees.<br><em>One</em> minute.',
      brewNote: 'Sixty seconds, no more, in water that never boils. The third cup is the reason you bought it.',
      steps: [
        ['03 g', 'leaf per 150 ml'],
        ['75 °C', 'soft water, below boiling'],
        ['60 s', 'first infusion, no lid'],
        ['×3', 'small cup, often']
      ]
    },
    '06': {
      name: 'Fog Needle',
      han: '雾针 · Steamed Maofeng',
      process: 'Steamed',
      garden: 'Fuxi',
      altitude: '840 m',
      picked: 'April 2026',
      price: 52,
      status: 'ok',
      plate: 'ph--t6',
      imgAlt: 'Placeholder image: misty green needles on bamboo',
      lead: 'Our own terrace again, one week after Mist Peak — the same leaf, finished by steam instead of fire.',
      plotTitle: 'The same terrace,<br>one week <em>later</em>.',
      story: [
        'Fog Needle is the experiment that stayed: the same leaf as Mist Peak, picked a week later from the same slope, finished in a four-kilo steamer instead of the wok.',
        'Nori and snow pea on the nose, a thicker and rounder cup than its roasted sibling. Pouring the two side by side is the shortest lesson we know in what firing does.'
      ],
      figures: [
        ['Pick window', '9–12 April'],
        ['Terrace', 'North slope, Fuxi'],
        ['Steamed', '40 s, once']
      ],
      brewTitle: 'Three grams.<br><em>Sixty</em> degrees.<br>Ninety seconds.',
      brewNote: 'Treat it like Jade Dew: cool water, small vessel. Heat is the enemy of the nori note.',
      steps: [
        ['03 g', 'leaf per 120 ml'],
        ['60 °C', 'low and slow'],
        ['90 s', 'first infusion, no lid'],
        ['×4', 'sweet to the end']
      ]
    },
    '07': {
      name: 'Silver Tip',
      han: '毛尖 · Xinyang Maojian',
      process: 'Roasted',
      garden: 'Xinyang',
      altitude: '500 m',
      picked: 'April 2026',
      price: 38,
      status: 'ok',
      plate: 'ph--t7',
      imgAlt: 'Placeholder image: silver-tipped Maojian, grey-green and downy',
      lead: 'The everyday lot. Honest, roasted, and the first to go in the tearooms that pour it.',
      plotTitle: 'An honest leaf,<br>fired to a <em>curve</em>.',
      story: [
        'Silver Tip comes from a partner garden in the Dabie hills, picked to our brief and fired to our curve — three passes, ending when the sound of the leaf changes, not when the clock does.',
        'Chestnut and fresh soy, no surprises, which is the point. It is the lot we drink at the sorting table, and the one that teaches new buyers what we mean by green.'
      ],
      figures: [
        ['Pick window', '6–10 April'],
        ['Terrace', 'Partner garden, Xinyang'],
        ['Fired', 'Three passes']
      ],
      brewTitle: 'Three grams.<br>Eighty degrees.<br><em>Ninety</em> seconds.',
      brewNote: 'Ninety seconds at eighty. If you must take it to the office kettle, let the water stand a minute first.',
      steps: [
        ['03 g', 'leaf per 150 ml'],
        ['80 °C', 'spring water, never boiling'],
        ['90 s', 'first infusion, no lid'],
        ['×3', 'steady to the last']
      ]
    },
    '08': {
      name: 'Melon Seed',
      han: '瓜片 · Lu\u2019an Guapian',
      process: 'Roasted',
      garden: 'Lu\u2019an',
      altitude: '400 m',
      picked: 'May 2026',
      price: 36,
      status: 'ok',
      plate: 'ph--t8',
      imgAlt: 'Placeholder image: flat Guapian leaf pieces, olive and gold',
      lead: 'The late lot: mature leaves only, no buds, smoked gently over paulownia charcoal. It holds for a year without complaint.',
      plotTitle: 'No buds, no stems —<br>only the <em>leaf</em>.',
      story: [
        'Guapian breaks the rule of the whole category: no buds, no stems, only the flesh of the leaf, dried and smoked gently over paulownia coal. Toasted melon seed and a warm thread of smoke.',
        'It is the last lot to leave the mountain each spring and the first the restaurant kitchens ask for. Kept cool and dark, it is still itself a year later.'
      ],
      figures: [
        ['Pick window', 'May 2026'],
        ['Terrace', 'South terrace, Lu\u2019an'],
        ['Charcoal', 'Paulownia, twice']
      ],
      brewTitle: 'Five grams.<br>Eighty-five degrees.<br><em>Two</em> minutes.',
      brewNote: 'Built for endurance — two minutes, hot, unbothered. It is the lot you make in a thermos for the field.',
      steps: [
        ['05 g', 'leaf per 200 ml'],
        ['85 °C', 'just off the boil'],
        ['2 min', 'first infusion'],
        ['×3', 'it holds all day']
      ]
    },
    '09': {
      name: 'Dragon Well',
      han: '龙井 · West Lake Longjing',
      process: 'Pan-fired',
      garden: 'West Lake',
      altitude: '300 m',
      picked: 'April 2026',
      price: 62,
      status: 'mid',
      plate: 'ph--t9',
      imgAlt: 'Placeholder image: flat jade-green Longjing leaves, pale gold tips',
      lead: 'The classic, from a garden we have leased beside the lake since 2021, fired by a master who will not hurry the second pass.',
      plotTitle: 'Fired beside the lake,<br>never in <em>haste</em>.',
      story: [
        'Our Longjing garden sits on the lake\u2019s south shore, leased since 2021 and fired by a third-generation master who will not hurry the second pass, whatever the calendar says.',
        'Flat, jade-green, hazelnut and cream. The lot is allocated to standing buyers before it leaves the lake — ask early for 2027.'
      ],
      figures: [
        ['Pick window', '16–20 March'],
        ['Terrace', 'South shore, West Lake'],
        ['Fired', 'Hand-fired, twice']
      ],
      brewTitle: 'Four grams.<br>Eighty degrees.<br><em>Barely</em> a minute.',
      brewNote: 'Seventy-five seconds at eighty degrees. Longer and the hazelnut turns to toast — the master\u2019s only warning.',
      steps: [
        ['04 g', 'leaf per 150 ml'],
        ['80 °C', 'spring water, never boiling'],
        ['75 s', 'first infusion, no lid'],
        ['×4', 'keep it moving']
      ]
    }
  };

  var $ = function (sel) { return document.querySelector(sel); };

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function getLotKey() {
    var m = location.search.match(/[?&]lot=(\d{1,2})/);
    var key = m ? ('0' + m[1]).slice(-2) : '01';
    return LOTS[key] ? key : '01';
  }

  function setText(sel, text) {
    var el = $(sel);
    if (el) el.textContent = text;
  }

  /* The three lots that follow the current one, wrapping at the end of the
     archive — the continuation reads as a sequence, not a recommendation */
  function otherLots(key) {
    var keys = Object.keys(LOTS);
    var i = keys.indexOf(key);
    var out = [];
    for (var n = 1; n <= 3; n++) out.push(keys[(i + n) % keys.length]);
    return out;
  }

  function renderOthers(key) {
    var list = $('[data-others]');
    if (!list) return;

    var frag = document.createDocumentFragment();

    otherLots(key).forEach(function (otherKey) {
      var lot = LOTS[otherKey];
      var st = STATUS[lot.status];

      var li = document.createElement('li');
      li.className = 'lrow reveal is-in';
      if (lot.status === 'off') li.setAttribute('data-status', 'sold');
      li.innerHTML =
        '<a class="lrow__link" href="product.html?lot=' + otherKey + '">' +
          '<span class="lrow__thumb ph ' + lot.plate + '" role="img" aria-label="' + lot.imgAlt + '"></span>' +
          '<span class="lrow__id">' +
            '<span class="lrow__lot">Lot ' + otherKey + '</span>' +
            '<span class="lrow__name">' + lot.name + '</span>' +
            '<span class="lrow__han" lang="zh-Hans">' + lot.han + '</span>' +
          '</span>' +
          '<span class="lrow__buy">' +
            '<span class="lrow__price">From £' + lot.price + ' <span class="lrow__per">/ 50 g</span></span>' +
            '<span class="stat ' + st.cls + '">' + st.label + '</span>' +
          '</span>' +
          '<span class="lrow__arrow" aria-hidden="true">→</span>' +
        '</a>';
      frag.appendChild(li);
    });

    list.innerHTML = '';
    list.appendChild(frag);
  }

  function renderSchema(key, lot) {
    var block = $('[data-product-schema]');
    if (!block) return;
    var st = STATUS[lot.status];
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': 'Lot ' + key + ' — ' + lot.name + ' · ' + lot.han.split(' · ')[1],
      'description': lot.lead,
      'brand': { '@type': 'Organization', 'name': 'SHANYIN 山隐' },
      'sku': 'SY-2026-' + key,
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'GBP',
        'price': lot.price.toFixed(2),
        'availability': st.availability,
        'url': 'https://shanyin.example/product.html?lot=' + key
      }
    };
    block.textContent = JSON.stringify(schema, null, 2);
  }

  function render(key) {
    var lot = LOTS[key];
    var st = STATUS[lot.status];

    document.title = 'Lot ' + key + ' — ' + lot.name + ' · SHANYIN 山隐';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', lot.lead + ' Wholesale and private label enquiries welcome.');

    setText('[data-crumb]', 'Lot ' + key + ' — ' + lot.name);
    setText('[data-stamp]', 'Lot ' + key);
    setText('[data-fig-no]', 'Fig. ' + key);
    setText('[data-kicker]', 'Lot ' + key + ' · Spring 2026');
    setText('[data-plot-no]', key);
    setText('[data-brew-no]', key);

    var status = $('[data-status-chip]');
    if (status) {
      status.className = 'stat ' + st.cls;
      status.textContent = st.label;
    }

    setText('[data-name]', lot.name);
    setText('[data-han]', lot.han);
    setText('[data-price]', '£' + lot.price);
    setText('[data-lead]', lot.lead);
    setText('[data-process]', lot.process);
    setText('[data-garden]', lot.altitude + ' · ' + lot.garden);
    setText('[data-picked]', lot.picked);

    var enquire = $('[data-enquire]');
    if (enquire) {
      enquire.textContent = ENQUIRE[lot.status];
      enquire.setAttribute('href', 'contact.html?lot=' + key);
    }
    var sample = $('[data-sample]');
    if (sample) sample.setAttribute('href', 'contact.html?lot=' + key);

    var plate = $('[data-hero-plate]');
    if (plate) {
      plate.className = 'phero__plate ph ' + lot.plate + ' ph--framed';
      plate.setAttribute('data-spec', '4:5 · Photo — lot ' + key + ' · loose leaf');
      plate.setAttribute('aria-label', lot.imgAlt);
    }

    var plotTitle = $('[data-plot-title]');
    if (plotTitle) plotTitle.innerHTML = lot.plotTitle; // authored strings from the map above
    setText('[data-story-1]', lot.story[0]);
    setText('[data-story-2]', lot.story[1]);

    var figs = $('[data-figures]');
    if (figs) {
      figs.innerHTML = lot.figures.map(function (pair) {
        return '<div><dt>' + pair[0] + '</dt><dd>' + pair[1] + '</dd></div>';
      }).join('');
    }

    var brewTitle = $('[data-brew-title]');
    if (brewTitle) brewTitle.innerHTML = lot.brewTitle; // authored strings from the map above
    setText('[data-brew-note]', lot.brewNote);

    var steps = $('[data-steps]');
    if (steps) {
      steps.innerHTML = lot.steps.map(function (pair) {
        return '<li><span class="steps__k">' + pair[0] + '</span><span class="steps__v">' + pair[1] + '</span></li>';
      }).join('');
    }

    renderOthers(key);
    renderSchema(key, lot);
  }

  if (LOTS) render(getLotKey());

})();
