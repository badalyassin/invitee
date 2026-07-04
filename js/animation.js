/* ==========================================================================
   SIRAJ & ANGELI — Wedding Invitation
   js/animation.js — Scroll reveal via IntersectionObserver (fade + rise up)
   ========================================================================== */
(function () {
  'use strict';

  var targets = document.querySelectorAll('.reveal-up, .timeline-row');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (el) { observer.observe(el); });
})();

