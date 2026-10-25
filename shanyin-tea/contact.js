/* ============================================================================
   SHANYIN 山隐 — contact page
   ----------------------------------------------------------------------------
   One small job: when the visitor arrives from a lot page
   (contact.html?lot=04), pre-fill the message so the enquiry names the tea
   they were just reading about, and set the interest select accordingly.
   Everything else — validation, the success state — is main.js's form module.
   ========================================================================== */

(function () {
  'use strict';

  var NAMES = {
    '01': 'Lot 01 — Mist Peak',
    '02': 'Lot 02 — Jade Dew',
    '03': 'Lot 03 — White Leaf',
    '04': 'Lot 04 — Monkey Chief',
    '05': 'Lot 05 — Spring Snail',
    '06': 'Lot 06 — Fog Needle',
    '07': 'Lot 07 — Silver Tip',
    '08': 'Lot 08 — Melon Seed',
    '09': 'Lot 09 — Dragon Well'
  };

  var m = window.location.search.match(/[?&]lot=(\d{1,2})/);
  if (!m) return;
  var key = ('0' + m[1]).slice(-2);
  if (!NAMES[key]) return;

  var message = document.querySelector('#f-message');
  if (message && !message.value) {
    message.value = 'Enquiry about ' + NAMES[key] + '.';
  }

  var interest = document.querySelector('#f-interest');
  if (interest && !interest.value) interest.value = 'wholesale';

})();
