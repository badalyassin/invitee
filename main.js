/* ==========================================================================
   SIRAJ & ANGELI — Wedding Invitation
   js/main.js — Envelope-opening sequence + RSVP modal + audio toggle
   Mirrors the reference site's own mechanism exactly:
     1. Tap #weiOverlay -> it fades out (1.4s) while the opening video plays
     2. Video wrap fades out 0.8s before the video's natural end
     3. Background music starts at tap; floating toggle appears after reveal
   ========================================================================== */
(function () {
  'use strict';

  var overlay   = document.getElementById('weiOverlay');
  var videoWrap = document.getElementById('weiVideoWrap');
  var video     = document.getElementById('weiVideo');
  var audio     = document.getElementById('wei-audio');
  var audioBtn  = document.getElementById('audio-toggle');
  var iconPlay  = document.getElementById('icon-play');
  var iconPause = document.getElementById('icon-pause');

  var FADE_OUT_LEAD = 0.8;   // seconds before video ends to start fading the wrap
  var FADE_OUT_DUR  = 1400;  // ms, matches CSS transition on #weiVideoWrap
  var hasOpened = false;

  function revealPage() {
    videoWrap.classList.remove('wei-video-in');
    videoWrap.classList.add('wei-video-out');
    setTimeout(function () {
      videoWrap.style.display = 'none';
      overlay.style.display = 'none';
      showAudioToggle();
    }, FADE_OUT_DUR);
  }

  function scheduleFadeOut() {
    var duration = video.duration;
    if (!isFinite(duration) || duration <= 0) {
      // Fallback: if metadata never resolves, reveal after a safe timeout
      setTimeout(revealPage, 4500);
      return;
    }
    var leadMs = Math.max((duration - FADE_OUT_LEAD) * 1000, 200);
    setTimeout(revealPage, leadMs);
  }

  function openEnvelope() {
    if (hasOpened) return;
    hasOpened = true;

    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';

    videoWrap.style.display = 'flex';
    videoWrap.classList.add('wei-video-in');

    video.currentTime = 0;
    var playPromise = video.play();
    if (playPromise && playPromise.catch) playPromise.catch(function () {});

    if (video.readyState >= 1) {
      scheduleFadeOut();
    } else {
      video.addEventListener('loadedmetadata', scheduleFadeOut, { once: true });
    }
    // Safety net in case timeupdate/loadedmetadata never fire as expected
    video.addEventListener('ended', function () {
      if (!videoWrap.classList.contains('wei-video-out')) revealPage();
    }, { once: true });

    tryPlayMusic();
  }

  function tryPlayMusic() {
    if (!audio) return;
    audio.volume = 0.55;
    var p = audio.play();
    if (p && p.catch) {
      p.then(function () {
        setPauseIcon(true);
      }).catch(function () {
        // Autoplay with sound blocked by the browser — user can start it
        // manually via the floating toggle; keep icon in "play" state.
        setPauseIcon(false);
      });
    }
  }

  function showAudioToggle() {
    if (!audioBtn) return;
    audioBtn.style.visibility = 'visible';
    audioBtn.style.opacity = '1';
  }

  function setPauseIcon(isPlaying) {
    if (!iconPlay || !iconPause) return;
    iconPlay.style.display  = isPlaying ? 'none' : 'block';
    iconPause.style.display = isPlaying ? 'block' : 'none';
  }

  overlay.addEventListener('click', openEnvelope);
  overlay.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });
  overlay.setAttribute('tabindex', '0');
  overlay.setAttribute('role', 'button');
  overlay.setAttribute('aria-label', 'Tap to open your wedding invitation');

  if (audioBtn) {
    audioBtn.addEventListener('click', function () {
      if (!audio) return;
      if (audio.paused) {
        audio.play().then(function () { setPauseIcon(true); }).catch(function () {});
      } else {
        audio.pause();
        setPauseIcon(false);
      }
    });
  }

  /* ------------------------------------------------------------------
     Scroll-to-content indicator on hero
  ------------------------------------------------------------------ */
  var scrollBtn = document.getElementById('scroll-indicator');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      var blessing = document.getElementById('blessing');
      if (blessing) blessing.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     RSVP modal — opened by the wax-seal button, closed by X / backdrop / Esc
  ------------------------------------------------------------------ */
  var rsvpOpenBtn  = document.getElementById('rsvp-open-btn');
  var rsvpModal    = document.getElementById('rsvp-modal');
  var rsvpClose    = document.getElementById('rsvp-modal-close');
  var rsvpForm     = document.getElementById('rsvp-form');
  var rsvpStatus   = document.getElementById('rsvp-status');
  var lastFocused  = null;

  function openModal() {
    lastFocused = document.activeElement;
    rsvpModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (rsvpClose) rsvpClose.focus();
  }
  function closeModal() {
    rsvpModal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (rsvpOpenBtn) rsvpOpenBtn.addEventListener('click', openModal);
  if (rsvpClose) rsvpClose.addEventListener('click', closeModal);
  if (rsvpModal) {
    rsvpModal.addEventListener('click', function (e) {
      if (e.target === rsvpModal) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && rsvpModal && !rsvpModal.hidden) closeModal();
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = rsvpForm.elements['name'].value.trim();
      var attending = rsvpForm.querySelector('input[name="attending"]:checked');
      var guests = rsvpForm.elements['guests'].value;

      if (!name) {
        rsvpStatus.textContent = 'Please enter your name.';
        rsvpForm.elements['name'].focus();
        return;
      }

      var attendingLabel = attending && attending.value === 'yes' ? 'joining us' : 'unable to attend';
      rsvpStatus.textContent = 'Thank you, ' + name + '! We have noted you are ' + attendingLabel +
        (attending && attending.value === 'yes' ? ' with ' + guests + ' guest(s).' : '.');
      rsvpForm.reset();
    });
  }
})();

