/* ============================================================================
   SHANYIN 山隐 — journal (news list + single note)
   ----------------------------------------------------------------------------
   One module, two jobs, decided by which markup it finds:

   • news.html      — [data-news-feat] / [data-news-list] present → render the
                      featured dispatch and the index rows from POSTS.
   • news-post.html — [data-post-title] present → render the article for
                      ?post=SLUG (title, dek, body, figure, quote, prev/next)
                      and update title / meta / JSON-LD.

   Every page ships with the newest note in its markup, so crawlers and
   no-JS visitors see real content either way. Unknown slugs fall back to
   the newest post. Ordering is newest first, by stamp.
   ========================================================================== */

(function () {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };

  var POSTS = {
    'off-season-on-the-north-slope': {
      title: 'Off-season on the north slope.',
      cat: 'Field note',
      date: '30 September 2026',
      stamp: '2026-09-30',
      short: '30 Sep 2026',
      read: '3 min',
      dek: 'The terraces are resting. What the mountain does between Octobers — and why a cold winter is a good vintage announcement.',
      body: [
        'By late September the picking is a memory and the terraces belong to the mist again. The work that remains is slow: terrace walls to mend before the winter freeze, channels to clear, and the pruning that decides next April\u2019s buds.',
        'The leaf does not stop, it only slows. Below eight degrees the bush shuts down and spends the winter counting its reserves. A cold winter is a good vintage announcement — the bud that struggles wakes up concentrated.',
        'In the village the woks are re-seasoned and the drying room is quiet. We taste last spring against the spring before it, and start the argument about which lots get the best of next year\u2019s windows. The mountain keeps its own time. We keep its calendar.'
      ],
      quote: 'The mountain keeps its own time. We keep its calendar.',
      fig: {
        plate: 'ph--n1',
        spec: '16:10 · Photo — the resting terraces',
        alt: 'Placeholder image: misty terraces resting in the off-season',
        cap: 'The home terrace in late September — unpicked since April, and in no hurry.'
      }
    },
    'organic-renewal-and-the-486-panel': {
      title: 'Organic renewal, and the 486 panel, explained.',
      cat: 'Assurance',
      date: '15 July 2026',
      stamp: '2026-07-15',
      short: '15 Jul 2026',
      read: '4 min',
      dek: 'Two certificates, one audit trail, and why we publish the failures too.',
      body: [
        'Our EU organic certification renewed in June without findings, which is the boring best case. The interesting part is what \u201cwithout findings\u201d costs: buffer rows left unharvested, sprays we do not use even when permitted, and a paper trail for every kilo from terrace to tin.',
        'Alongside it runs the 486-parameter SGS panel, every lot, before shipment. Most buyers check the dozen headline numbers. We read the whole thing, because the value of a clean panel is in the long tail — the parameters that never make it onto a marketing page.',
        'We reject roughly one lot in eight. The rejected leaf is sold locally, unlabelled. It never carries this name, and the rejection is recorded on the lot sheet like everything else. A paper trail that only shows wins is not a paper trail.'
      ],
      quote: 'A paper trail that only shows wins is not a paper trail.',
      fig: {
        plate: 'ph--n3',
        spec: '16:10 · Photo — the sorting table',
        alt: 'Placeholder image: documents and leaf samples on a lit sorting table',
        cap: 'Every panel, every certificate, filed under the lot number it belongs to.'
      }
    },
    'how-to-read-a-lot-sheet': {
      title: 'How to read a lot sheet.',
      cat: 'Trade',
      date: '02 June 2026',
      stamp: '2026-06-02',
      short: '02 Jun 2026',
      read: '5 min',
      dek: 'Every shipment comes with papers. Here is what the numbers mean, and which ones to argue with.',
      body: [
        'A lot sheet looks like bureaucracy, and it is — deliberately. Each line exists because a buyer, somewhere, once asked for it after something went wrong. Read top to bottom, it tells you the tea\u2019s biography: terrace, picking team, morning, wok, drying, panel.',
        'The lot number is the spine. SY-2026-03 is the third lot accepted from the 2026 spring pick; everything else on the sheet hangs off that number. If a report, a certificate or a box label does not carry it, it does not belong to this tea.',
        'The panel matters most. Ours runs 486 pesticide parameters at SGS before any lot leaves the factory, and we forward it unedited — the report shows the method detection limits, not a summary. Argue with numbers there if you are going to argue anywhere.',
        'What you can argue with: price, on volume; and allocation, politely. What you cannot: the harvest date. Leaf picked on 3 April ships as 3 April, even if the boat leaves in June.'
      ],
      quote: 'Leaf picked on 3 April ships as 3 April, even if the boat leaves in June.',
      fig: {
        plate: 'ph--n3',
        spec: '16:10 · Photo — papers and tins',
        alt: 'Placeholder image: a lot sheet weighted down by a sealed tea tin',
        cap: 'One sheet per lot, from the drying room to the buyer\u2019s desk.'
      }
    },
    'fog-needle-joins-the-archive': {
      title: 'Fog Needle joins the archive.',
      cat: 'Release',
      date: '06 May 2026',
      stamp: '2026-05-06',
      short: '06 May 2026',
      read: '3 min',
      dek: 'The experiment that stayed: the same leaf as Mist Peak, one week later, finished by steam.',
      body: [
        'For three years we ran a small side experiment: take leaf from the same north-slope terrace a week after the Mist Peak pick and finish it in a steamer instead of a wok. The first year it was a curiosity. The second, the staff hid the best batches. This year we made enough to number it.',
        'Lot 06 — Fog Needle — is steamed for forty seconds, no more, then rolled and dried slowly. Nori and snow pea on the nose; a thicker, rounder cup than its roasted sibling. It wants sixty-degree water and a small cup.',
        'Steamed lots are a headache at export — greener leaf reads as \u201cpoor firing\u201d to customs officers who have seen a thousand wok-fired Maofeng and very few deliberate exceptions. The papers explain. The tea explains better.'
      ],
      quote: 'The first year it was a curiosity. The second, the staff hid the best batches.',
      fig: {
        plate: 'ph--n2',
        spec: '16:10 · Photo — the steamer at work',
        alt: 'Placeholder image: steam rising from a basket of fresh leaf',
        cap: 'Forty seconds in the steamer — long enough to fix the green, short enough to keep the sweetness.'
      }
    },
    'the-2026-pick-is-in': {
      title: 'The 2026 pick is in.',
      cat: 'Harvest',
      date: '18 April 2026',
      stamp: '2026-04-18',
      short: '18 Apr 2026',
      read: '4 min',
      dek: 'Four days, two hundred hands, and the shortest window of our year. The lots are out of the drying room and into the tins.',
      body: [
        'The last wok was emptied at 23:40 on 4 April, which is late — the fog held on the north slope until nearly ten every morning, and the leaf came in slow and small. Slow is good. Small is better.',
        'In total the terraces gave us 610 kilos of finished tea from the four days before Qingming, a shade under last year and exactly the quality band we hold out for. Nine lots made the cut; four did not, and went to the village market unlabelled, as always.',
        'Lot 01 — Mist Peak — is the pick of the spring: orchid up front, chestnut behind, and a sweetness that survived the slow, cold leaf. Lot 06, our steamed Fog Needle, surprised everyone twice.',
        'The archive is open now. Samples leave within five working days, DHL, buyer\u2019s account — and when a lot is gone, it is gone until next April.'
      ],
      quote: 'Slow is good. Small is better.',
      fig: {
        plate: 'ph--n1',
        spec: '16:10 · Photo — the last pick at dusk',
        alt: 'Placeholder image: the last basket of leaf coming off the slope at dusk',
        cap: 'The last pick of the season comes off the north slope at dusk, 4 April.'
      }
    },
    'why-we-pick-before-qingming': {
      title: 'Why we pick before Qingming.',
      cat: 'Field note',
      date: '28 March 2026',
      stamp: '2026-03-28',
      short: '28 Mar 2026',
      read: '3 min',
      dek: 'The four days before the rains are not superstition. They are chemistry, and a little stubbornness.',
      body: [
        'Qingming falls on 4 or 5 April, and everything we pick has to be off the slope before the first proper warm rain arrives. After that rain the leaf grows fast, and fast leaf is thin tea — more water, less of everything else.',
        'Before it, the buds have spent all winter concentrating. Cold nights, short days, a soil that sits at five degrees into April. The leaf wakes up dense: more theanine, which reads as sweetness; fewer catechins, which read as bite.',
        'It is also simply harder. Two hundred hands working a slope that gives up its pick in four mornings, taking one bud and one leaf, never two. The easy version of this tea exists. It is not this tea.',
        'So the window is short because the tea is only itself for four days. Everything else we do — the woks, the papers, the lot numbers — is bookkeeping around that fact.'
      ],
      quote: 'The tea is only itself for four days.',
      fig: {
        plate: 'ph--n2',
        spec: '16:10 · Photo — buds before the rain',
        alt: 'Placeholder image: tight pale buds on the bush before the warm rains',
        cap: 'Tight buds the morning before the warm rain — the whole year in one frame.'
      }
    }
  };

  var ORDER = [
    'off-season-on-the-north-slope',
    'organic-renewal-and-the-486-panel',
    'how-to-read-a-lot-sheet',
    'fog-needle-joins-the-archive',
    'the-2026-pick-is-in',
    'why-we-pick-before-qingming'
  ];

  function getSlug() {
    var m = location.search.match(/[?&]post=([a-z0-9-]+)/);
    return (m && POSTS[m[1]]) ? m[1] : ORDER[0];
  }

  function rowHTML(slug) {
    var p = POSTS[slug];
    return '<a class="nrow__link" href="news-post.html?post=' + slug + '">' +
      '<span class="nrow__date">' + p.short + '</span>' +
      '<span class="nrow__text">' +
        '<span class="nrow__title">' + p.title + '</span>' +
        '<span class="nrow__dek">' + p.dek + '</span>' +
      '</span>' +
      '<span class="nrow__cat">' + p.cat + '</span>' +
      '<span class="nrow__arrow" aria-hidden="true">→</span>' +
    '</a>';
  }

  /* --- news.html: featured dispatch + index rows --------------------------- */
  function renderList() {
    var feat = POSTS[ORDER[0]];

    var plate = $('[data-feat-plate]');
    if (plate) {
      plate.className = 'ph ' + feat.fig.plate;
      plate.setAttribute('data-spec', '4:5 · Photo — ' + feat.cat.toLowerCase());
      plate.setAttribute('aria-label', feat.fig.alt);
    }
    setText('[data-feat-cat]', feat.cat);
    setText('[data-feat-date]', feat.date);
    setText('[data-feat-read]', feat.read + ' read');
    setText('[data-feat-title]', feat.title);
    setText('[data-feat-dek]', feat.dek);
    var links = document.querySelectorAll('[data-feat-link]');
    for (var i = 0; i < links.length; i++) links[i].setAttribute('href', 'news-post.html?post=' + ORDER[0]);

    var list = $('[data-news-list]');
    if (!list) return;
    list.innerHTML = ORDER.slice(1).map(function (slug) {
      return '<li class="nrow reveal is-in">' + rowHTML(slug) + '</li>';
    }).join('');
  }

  /* --- news-post.html: the note itself ------------------------------------- */
  function renderPost() {
    var slug = getSlug();
    var p = POSTS[slug];
    var idx = ORDER.indexOf(slug);

    document.title = p.title + ' · SHANYIN 山隐';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.dek);

    setText('[data-post-crumb]', p.title.replace(/\.$/, ''));
    setText('[data-post-cat]', p.cat);
    setText('[data-post-date]', p.date);
    setText('[data-post-read]', p.read + ' read');
    setText('[data-post-title]', p.title);
    setText('[data-post-dek]', p.dek);

    var plate = $('[data-post-plate]');
    if (plate) {
      plate.className = 'ph ' + p.fig.plate;
      plate.setAttribute('data-spec', p.fig.spec);
      plate.setAttribute('aria-label', p.fig.alt);
    }
    setText('[data-post-figcap]', p.fig.cap);

    var body = $('[data-post-body]');
    if (body) {
      body.innerHTML = p.body.map(function (para) {
        return '<p>' + para + '</p>';
      }).join('');
    }

    var quoteWrap = $('[data-post-quote-wrap]');
    if (quoteWrap) {
      if (p.quote) {
        quoteWrap.hidden = false;
        setText('[data-post-quote]', p.quote);
      } else {
        quoteWrap.hidden = true;
      }
    }

    // prev = newer (earlier in ORDER), next = older
    var newer = idx > 0 ? ORDER[idx - 1] : null;
    var older = idx < ORDER.length - 1 ? ORDER[idx + 1] : null;
    setNav('[data-post-prev]', '[data-post-prev-t]', newer);
    setNav('[data-post-next]', '[data-post-next-t]', older);

    var schema = $('[data-post-schema]');
    if (schema) {
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': p.title.replace(/\.$/, ''),
        'datePublished': p.stamp,
        'author': { '@type': 'Organization', 'name': 'SHANYIN 山隐' },
        'publisher': { '@type': 'Organization', 'name': 'SHANYIN 山隐' },
        'description': p.dek,
        'mainEntityOfPage': 'https://shanyin.example/news-post.html?post=' + slug
      }, null, 2);
    }
  }

  function setNav(linkSel, titleSel, slug) {
    var link = $(linkSel);
    if (!link) return;
    if (slug) {
      link.hidden = false;
      link.setAttribute('href', 'news-post.html?post=' + slug);
      setText(titleSel, POSTS[slug].title);
    } else {
      link.hidden = true;
    }
  }

  function setText(sel, text) {
    var el = $(sel);
    if (el) el.textContent = text;
  }

  if ($('[data-news-list]')) renderList();
  if ($('[data-post-title]')) renderPost();

})();
