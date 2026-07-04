/* ==========================================================================
   SIRAJ & ANGELI — Wedding Invitation
   js/countdown.js — Days / Hours / Minutes / Seconds, updates every second
   ========================================================================== */
(function () {
  'use strict';

  var grid = document.getElementById('countdown-grid');
  if (!grid) return;

  var targetDateStr = grid.getAttribute('data-wedding-date');
  var target = new Date(targetDateStr).getTime();

  var elDays    = grid.querySelector('[data-count="days"]');
  var elHours   = grid.querySelector('[data-count="hours"]');
  var elMinutes = grid.querySelector('[data-count="minutes"]');
  var elSeconds = grid.querySelector('[data-count="seconds"]');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var now = Date.now();
    var diff = target - now;

    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      clearInterval(timer);
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  tick();
  var timer = setInterval(tick, 1000);
})();

