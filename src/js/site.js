/* =========================================================================
   Aglaia Studios — front-end behaviour
   Vanilla, no dependencies, and written so that the page stays usable if any
   single feature fails: nothing is hidden by CSS until the script has armed it.
   ========================================================================= */

(function () {
  'use strict';

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var store = {
    get: function (key) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        /* private mode — preferences simply are not remembered */
      }
    },
  };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Header: solid once the page scrolls ----------------------------- */

  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;

    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* --- Mobile drawer ---------------------------------------------------- */

  function initDrawer() {
    var toggle = $('[data-menu-toggle]');
    var drawer = $('[data-drawer]');
    if (!toggle || !drawer) return;

    var header = $('[data-header]');

    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      drawer.hidden = !open;
      document.body.classList.toggle('is-locked', open);
      // Give the bar a solid background so the drawer does not sit under a
      // transparent header floating over the hero photograph.
      if (header) header.classList.toggle('is-solid', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // A resize past the desktop breakpoint must not leave the body locked.
    window.matchMedia('(min-width: 62.01rem)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* --- Language menu ---------------------------------------------------- */

  function initLanguageSwitcher() {
    var root = $('[data-langswitch]');
    if (!root) return;

    var button = $('.langswitch__button', root);
    var menu = $('.langmenu', root);

    var setOpen = function (open) {
      button.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    };

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        button.focus();
      }
    });

    // Remember the visitor's pick so we can offer it again next time.
    $$('.langmenu__item', menu).forEach(function (link) {
      link.addEventListener('click', function () {
        store.set('aglaia-lang', link.getAttribute('lang'));
      });
    });
  }

  /* --- Offer the visitor's own language --------------------------------- */

  function initLanguageHint() {
    var data = $('#lang-data');
    if (!data) return;

    var current = document.documentElement.lang;
    var packs;
    try {
      packs = JSON.parse(data.textContent);
    } catch (e) {
      return;
    }

    if (store.get('aglaia-lang-hint') === 'off') return;

    var saved = store.get('aglaia-lang');
    var browser = (navigator.language || '').slice(0, 2).toLowerCase();
    var wanted = saved || browser;

    if (!wanted || wanted === current) return;

    var target = packs.filter(function (p) {
      return p.code === wanted;
    })[0];
    if (!target) return;

    var hint = document.createElement('div');
    hint.className = 'langhint';
    hint.setAttribute('role', 'region');
    hint.lang = target.code;
    hint.innerHTML =
      '<span class="langhint__text"></span>' +
      '<a class="langhint__action" href=""></a>' +
      '<button type="button" class="langhint__dismiss" aria-label="">' +
      '<svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
      '<path d="m6 6 12 12M18 6 6 18"/></svg></button>';

    $('.langhint__text', hint).textContent = target.suggest;
    var action = $('.langhint__action', hint);
    action.textContent = target.action;
    action.href = target.href;
    action.setAttribute('hreflang', target.code);
    action.addEventListener('click', function () {
      store.set('aglaia-lang', target.code);
    });

    var dismiss = $('.langhint__dismiss', hint);
    dismiss.setAttribute('aria-label', target.dismiss);
    dismiss.addEventListener('click', function () {
      store.set('aglaia-lang-hint', 'off');
      hint.remove();
    });

    document.body.appendChild(hint);
  }

  /* --- Reveal on scroll ------------------------------------------------- */

  function initReveal() {
    var targets = $$('[data-reveal]');
    if (!targets.length || reducedMotion || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('is-armed');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    targets.forEach(function (el) {
      el.classList.add('is-armed');
      observer.observe(el);
    });
  }

  /* --- Hero background film --------------------------------------------- */

  function initHeroVideo() {
    var mount = $('[data-hero-video]');
    var toggle = $('[data-video-toggle]');
    if (!mount || !toggle) return;

    // Auto-playing motion is opt-out for anyone who asked for less of it, and
    // not worth the bytes on a connection the visitor flagged as metered.
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reducedMotion || saveData) return;

    var label = $('[data-video-label]', toggle);
    var id = mount.dataset.videoId;

    var start = function () {
      var frame = document.createElement('iframe');
      frame.src =
        'https://www.youtube-nocookie.com/embed/' +
        id +
        '?autoplay=1&mute=1&loop=1&playlist=' +
        id +
        '&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1';
      frame.title = mount.dataset.videoTitle || '';
      frame.setAttribute('allow', 'autoplay; encrypted-media');
      frame.setAttribute('tabindex', '-1');
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      frame.addEventListener('load', function () {
        mount.classList.add('is-playing');
      });
      mount.appendChild(frame);
    };

    var stop = function () {
      mount.classList.remove('is-playing');
      mount.textContent = '';
    };

    toggle.addEventListener('click', function () {
      var paused = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', String(!paused));
      label.textContent = toggle.dataset[paused ? 'pauseLabel' : 'playLabel'] || label.textContent;
      if (paused) start();
      else stop();
    });

    // Keep the poster as the first paint; the film arrives afterwards.
    var begin = function () {
      toggle.hidden = false;
      start();
    };
    if (document.readyState === 'complete') begin();
    else window.addEventListener('load', begin);
  }

  /* --- Booking widget --------------------------------------------------- */

  function initBooking() {
    $$('[data-booking-form]').forEach(function (form) {
      var checkin = $('[data-booking-checkin]', form);
      var checkout = $('[data-booking-checkout]', form);
      if (!checkin || !checkout) return;

      var iso = function (date) {
        return date.toISOString().slice(0, 10);
      };
      var addDays = function (value, days) {
        var d = new Date(value + 'T12:00:00');
        d.setDate(d.getDate() + days);
        return iso(d);
      };

      var today = iso(new Date());
      checkin.min = today;

      // Sensible defaults so the widget is usable in one click.
      if (!checkin.value) checkin.value = addDays(today, 1);
      if (!checkout.value) checkout.value = addDays(checkin.value, 2);
      checkout.min = addDays(checkin.value, 1);

      checkin.addEventListener('change', function () {
        if (!checkin.value) return;
        checkout.min = addDays(checkin.value, 1);
        if (!checkout.value || checkout.value <= checkin.value) {
          checkout.value = addDays(checkin.value, 2);
        }
      });

      form.addEventListener('submit', function (event) {
        if (!checkin.value || !checkout.value) {
          event.preventDefault();
          (checkin.value ? checkout : checkin).focus();
          return;
        }

        // The reservation engine expects dd/mm/yyyy for the visible fields,
        // yyyy-mm-dd for `fromd`, and an explicit night count.
        var display = function (value) {
          var p = value.split('-');
          return p[2] + '/' + p[1] + '/' + p[0];
        };
        var nights = Math.max(
          1,
          Math.round(
            (new Date(checkout.value + 'T12:00:00') - new Date(checkin.value + 'T12:00:00')) /
              86400000,
          ),
        );

        $('[data-booking-checkin-web]', form).value = display(checkin.value);
        $('[data-booking-checkout-web]', form).value = display(checkout.value);
        $('[data-booking-fromd]', form).value = checkin.value;
        $('[data-booking-nights]', form).value = String(nights);
      });
    });
  }

  /* --- Lightbox --------------------------------------------------------- */

  function initLightbox() {
    var root = $('[data-lightbox-root]');
    if (!root) return;

    var image = $('[data-lightbox-image]', root);
    var caption = $('[data-lightbox-caption]', root);
    var counter = $('[data-lightbox-counter]', root);
    var closeBtn = $('[data-lightbox-close]', root);

    var items = [];
    var index = 0;
    var lastFocused = null;

    /** Pick the widest rendition a tile offers, for a full-screen view. */
    var bestSource = function (tile) {
      var source = $('source[srcset]', tile);
      var img = $('img', tile);
      if (source) {
        var candidates = source.getAttribute('srcset').split(',').map(function (part) {
          var bits = part.trim().split(/\s+/);
          return { url: bits[0], width: parseInt(bits[1], 10) || 0 };
        });
        candidates.sort(function (a, b) {
          return b.width - a.width;
        });
        if (candidates.length) return candidates[0].url;
      }
      return img ? img.currentSrc || img.src : '';
    };

    var show = function (i) {
      index = (i + items.length) % items.length;
      var item = items[index];
      image.src = item.src;
      image.alt = item.alt;
      caption.textContent = item.alt;
      counter.textContent = index + 1 + ' / ' + items.length;
    };

    var open = function (group, start) {
      var grid = $('[data-lightbox-group="' + group + '"]');
      if (!grid) return;

      items = $$('.tile', grid).map(function (tile) {
        return { src: bestSource(tile), alt: ($('img', tile) || {}).alt || '' };
      });
      if (!items.length) return;

      lastFocused = document.activeElement;
      root.hidden = false;
      root.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      show(start);
      closeBtn.focus();
    };

    var close = function () {
      root.hidden = true;
      root.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      image.src = '';
      if (lastFocused) lastFocused.focus();
    };

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-lightbox]');
      if (trigger) {
        event.preventDefault();
        open(trigger.getAttribute('data-lightbox'), parseInt(trigger.dataset.index, 10) || 0);
        return;
      }
      if (event.target.closest('[data-lightbox-close]')) close();
      if (event.target.closest('[data-lightbox-prev]')) show(index - 1);
      if (event.target.closest('[data-lightbox-next]')) show(index + 1);
    });

    document.addEventListener('keydown', function (event) {
      if (root.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
      if (event.key === 'Tab') {
        // Keep focus inside the dialog while it is open.
        var focusable = $$('button', root).filter(function (b) {
          return b.offsetParent !== null;
        });
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    var touchX = null;
    root.addEventListener(
      'touchstart',
      function (event) {
        touchX = event.changedTouches[0].clientX;
      },
      { passive: true },
    );
    root.addEventListener(
      'touchend',
      function (event) {
        if (touchX === null) return;
        var delta = event.changedTouches[0].clientX - touchX;
        if (Math.abs(delta) > 45) show(index + (delta < 0 ? 1 : -1));
        touchX = null;
      },
      { passive: true },
    );
  }

  /* --- Gallery filters -------------------------------------------------- */

  function initFilters() {
    var buttons = $$('.filters__btn');
    if (!buttons.length) return;

    var sections = $$('[data-section]');

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.dataset.filter;

        buttons.forEach(function (other) {
          var active = other === button;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-selected', String(active));
        });

        sections.forEach(function (section) {
          section.hidden = filter !== 'all' && section.dataset.section !== filter;
        });
      });
    });
  }

  /* --- Click-to-load map ------------------------------------------------ */

  function initMap() {
    var boxes = $$('[data-map]');
    if (!boxes.length) return;

    var load = function (box) {
      var frame = document.createElement('iframe');
      frame.src = box.dataset.mapSrc;
      frame.loading = 'lazy';
      frame.title = 'Google Maps';
      frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      frame.setAttribute('allowfullscreen', '');
      box.textContent = '';
      box.appendChild(frame);
    };

    boxes.forEach(function (box) {
      if (store.get('aglaia-map-consent') === 'yes') {
        load(box);
        return;
      }
      var button = $('[data-map-load]', box);
      if (!button) return;
      button.addEventListener('click', function () {
        store.set('aglaia-map-consent', 'yes');
        load(box);
      });
    });
  }

  /* --- Contact form ----------------------------------------------------- */

  function initContactForm() {
    var form = $('[data-contact-form]');
    if (!form) return;

    var status = $('[data-form-status]', form);
    var messages = JSON.parse(form.dataset.messages || '{}');
    var provider = form.dataset.provider;

    var setError = function (name, message) {
      var field = form.elements[name];
      var slot = $('[data-error-for="' + name + '"]', form);
      if (slot) slot.textContent = message || '';
      if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    };

    var validate = function () {
      var v = function (name) {
        return (form.elements[name].value || '').trim();
      };

      var ok = [
        setError('firstName', v('firstName') ? '' : messages.firstName),
        setError('lastName', v('lastName') ? '' : messages.lastName),
        setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')) ? '' : messages.email),
        setError('phone', v('phone').replace(/[^\d]/g, '').length >= 6 ? '' : messages.phone),
      ].every(Boolean);

      if (!ok) {
        var firstInvalid = $('[aria-invalid="true"]', form);
        if (firstInvalid) firstInvalid.focus();
      }
      return ok;
    };

    /**
     * @param {string} text
     * @param {string} [kind]  'success' | 'error'
     * @param {string} [href]  when given, the address is rendered as a link so
     *                         the visitor can still reach us if the mail client
     *                         never opened.
     */
    var say = function (text, kind, href) {
      status.className = 'form__status ' + (kind ? 'is-' + kind : '');
      status.textContent = text + ' ';
      if (!href) return;
      var link = document.createElement('a');
      link.href = href;
      link.textContent = form.dataset.mailto;
      status.appendChild(link);
    };

    var payload = function () {
      var data = {};
      ['firstName', 'lastName', 'email', 'phone', 'comments'].forEach(function (name) {
        data[name] = (form.elements[name].value || '').trim();
      });
      return data;
    };

    form.addEventListener('submit', function (event) {
      // Honeypot: silently accept and drop anything that fills the hidden field.
      if ((form.elements.company.value || '').trim()) {
        event.preventDefault();
        say(messages.success, 'success');
        return;
      }

      if (!validate()) {
        event.preventDefault();
        say(messages.generic, 'error');
        return;
      }

      if (provider === 'netlify') return; // let the host capture it natively

      event.preventDefault();
      var data = payload();

      if (provider === 'endpoint' && form.dataset.endpoint) {
        var button = $('button[type="submit"]', form);
        var label = button.textContent;
        button.disabled = true;
        button.textContent = messages.sending;

        fetch(form.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
          .then(function (response) {
            if (!response.ok) throw new Error(response.status);
            form.reset();
            say(messages.success, 'success');
          })
          .catch(function () {
            say(messages.error, 'error', 'mailto:' + form.dataset.mailto);
          })
          .finally(function () {
            button.disabled = false;
            button.textContent = label;
          });
        return;
      }

      // Default: hand the message to the visitor's own mail application. The
      // same address is echoed as a link, because a browser with no mail client
      // registered will silently do nothing here.
      var lines = [
        data.firstName + ' ' + data.lastName,
        data.email,
        data.phone,
        '',
        data.comments,
      ];
      var mailto =
        'mailto:' +
        form.dataset.mailto +
        '?subject=' +
        encodeURIComponent(form.dataset.subject) +
        '&body=' +
        encodeURIComponent(lines.join('\n'));

      say(messages.mailtoNotice, 'success', mailto);
      window.location.assign(mailto);
    });

    // Clear an error as soon as the visitor starts fixing it.
    $$('input, textarea', form).forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') setError(field.name, '');
      });
    });
  }

  /* --- Boot ------------------------------------------------------------- */

  function boot() {
    initHeader();
    initDrawer();
    initLanguageSwitcher();
    initLanguageHint();
    initReveal();
    initHeroVideo();
    initBooking();
    initLightbox();
    initFilters();
    initMap();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
