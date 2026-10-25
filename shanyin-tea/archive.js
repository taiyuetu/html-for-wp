/* ============================================================================
   SHANYIN 山隐 — archive page filter
   ----------------------------------------------------------------------------
   One module: chip filters over the lot list, with chip counts read from the
   rows themselves, an aria-live result line, deep links via location.hash
   (products.html#pan-fired opens with that drawer already pulled out), and a
   light stagger when the visible set changes. Exits quietly if the toolbar
   markup is missing. Filtering works under prefers-reduced-motion; only the
   stagger animation is dropped.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var filters = document.querySelector('[data-filters]');
  if (!filters) return;

  var chips = Array.prototype.slice.call(filters.querySelectorAll('.chip'));
  var rows  = Array.prototype.slice.call(document.querySelectorAll('[data-row]'));
  var count = document.querySelector('[data-count]');
  var empty = document.querySelector('[data-empty]');
  if (!chips.length || !rows.length) return;

  var LABELS = {
    'all':       'Spring 2026',
    'roasted':   'Roasted',
    'pan-fired': 'Pan-fired',
    'steamed':   'Steamed'
  };

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* Chip counts are read from the rows, so the two can never drift apart */
  chips.forEach(function (chip) {
    var key = chip.getAttribute('data-filter');
    var n = key === 'all'
      ? rows.length
      : rows.filter(function (row) {
          return row.getAttribute('data-process') === key;
        }).length;
    var slot = chip.querySelector('.chip__n');
    if (slot) slot.textContent = pad(n);
  });

  function apply(key, updateHash) {
    var shown = 0;

    rows.forEach(function (row) {
      var match = key === 'all' || row.getAttribute('data-process') === key;
      row.hidden = !match;
      if (match) shown += 1;
    });

    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed',
        chip.getAttribute('data-filter') === key ? 'true' : 'false');
    });

    if (count) {
      count.textContent = key === 'all'
        ? 'Showing all ' + pad(rows.length) + ' lots — ' + LABELS.all
        : 'Showing ' + pad(shown) + (shown === 1 ? ' lot' : ' lots') + ' — ' + (LABELS[key] || key);
    }
    if (empty) empty.hidden = shown !== 0;

    settle();

    if (updateHash) {
      var url = key === 'all'
        ? location.pathname + location.search
        : '#' + key;
      try {
        window.history.replaceState(null, '', url);
      } catch (e) {
        /* file:// and older browsers — the filter still applies, the URL just
           does not record it */
      }
    }
  }

  /* Re-run the entrance stagger over whatever is visible now */
  function settle() {
    if (reduceMotion.matches) return;
    var visible = rows.filter(function (row) { return !row.hidden; });

    visible.forEach(function (row, i) {
      row.classList.remove('is-entering');
      row.style.setProperty('--d', Math.min(i * 45, 360) + 'ms');
    });

    // One reflow so removing the class genuinely restarts the animation
    if (visible.length) void visible[0].offsetWidth;

    visible.forEach(function (row) { row.classList.add('is-entering'); });
  }

  rows.forEach(function (row) {
    row.addEventListener('animationend', function () {
      row.classList.remove('is-entering');
    });
  });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      apply(chip.getAttribute('data-filter'), true);
    });
  });

  // Deep link: #roasted / #pan-fired / #steamed opens the archive filtered.
  // Lot anchors (#lot-04) are left to the browser's own scroll behaviour.
  var initial = location.hash.replace('#', '');
  if (initial && LABELS[initial]) apply(initial, false);

})();
