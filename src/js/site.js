/**
 * Anna Studios — site behaviour.
 *
 * Plain ES2020, no framework, no build step, no third-party request. Every
 * feature degrades: the markup it enhances is complete and usable on its own.
 */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /**
   * Bind a self-contained component once per matching root.
   *
   * Every page this site builds carries at most one header, one slideshow, one
   * gallery, one map and one reservation form, so a `querySelector` looked
   * safe enough. It is not: the moment a document holds two of anything — a
   * landing page with two galleries, or the single-file preview that stacks
   * all four language versions into one document — the second one silently
   * does nothing. Looping costs nothing when there is only one match.
   */
  function each(selector, init) {
    $$(selector).forEach(init);
  }

  /* --- Header shadow once the page has scrolled -------------------------- */

  (function stickyHeader() {
    each('[data-header]', function (header) {
      var ticking = false;
      function update() {
        header.classList.toggle('is-stuck', window.scrollY > 8);
        ticking = false;
      }

      window.addEventListener(
        'scroll',
        function () {
          if (ticking) return;
          ticking = true;
          window.requestAnimationFrame(update);
        },
        { passive: true },
      );
      update();
    });
  })();

  /* --- Mobile drawer ------------------------------------------------------ */

  (function drawer() {
    var toggle = $('[data-menu-toggle]');
    var panel = $('[data-drawer]');
    if (!toggle || !panel) return;

    var label = $('.u-visually-hidden', toggle);
    var openLabel = label ? label.textContent : '';
    var closeLabel = openLabel;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      document.body.classList.toggle('is-locked', open);
      if (label) label.textContent = open ? closeLabel : openLabel;
      if (open) {
        var first = $('a, button', panel);
        if (first) first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // A resize past the breakpoint leaves the drawer hidden by CSS; make sure
    // the button and the scroll lock agree with what is on screen.
    window.matchMedia('(min-width: 1081px)').addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  })();

  /* --- Language switcher -------------------------------------------------- */

  (function langSwitch() {
    var root = $('[data-langswitch]');
    if (!root) return;

    var button = $('.langswitch__button', root);
    var menu = $('.langmenu', root);
    if (!button || !menu) return;

    function setOpen(open) {
      button.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    }

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

    // Remember the visitor's choice so the suggestion bar stops nagging.
    menu.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link) return;
      try {
        localStorage.setItem('anna:lang', link.getAttribute('lang') || '');
      } catch (error) {
        /* storage disabled — the switcher still works */
      }
    });
  })();

  /* --- Home slideshow ----------------------------------------------------- */

  (function slideshow() {
    each('[data-slideshow]', function (root) {
      var slides = $$('[data-slide]', root);
      var dots = $$('[data-slide-to]', root);
      var toggle = $('[data-slide-toggle]', root);
      if (slides.length < 2) return;

      var index = 0;
      var timer = null;
      var playing = false;
      var DELAY = 6000;

      function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          var active = i === index;
          slide.classList.toggle('is-active', active);
          if (active) slide.removeAttribute('aria-hidden');
          else slide.setAttribute('aria-hidden', 'true');
          // Only the visible slide should be reachable by assistive tech.
          var img = $('img', slide);
          if (img) img.setAttribute('aria-hidden', active ? 'false' : 'true');
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }

      function play() {
        if (playing || reduceMotion.matches) return;
        playing = true;
        timer = window.setInterval(function () {
          show(index + 1);
        }, DELAY);
        if (toggle) {
          toggle.classList.remove('is-paused');
          toggle.setAttribute('aria-label', toggle.dataset.labelPause);
        }
      }

      function pause() {
        playing = false;
        window.clearInterval(timer);
        if (toggle) {
          toggle.classList.add('is-paused');
          toggle.setAttribute('aria-label', toggle.dataset.labelPlay);
        }
      }

      var prev = $('[data-slide-prev]', root);
      var next = $('[data-slide-next]', root);
      if (prev)
        prev.addEventListener('click', function () {
          pause();
          show(index - 1);
        });
      if (next)
        next.addEventListener('click', function () {
          pause();
          show(index + 1);
        });

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          pause();
          show(i);
        });
      });

      if (toggle)
        toggle.addEventListener('click', function () {
          if (playing) pause();
          else play();
        });

      // Don't burn CPU (or advance unseen) while the tab is in the background.
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) window.clearInterval(timer);
        else if (playing) play();
      });

      show(0);
      if (reduceMotion.matches) pause();
      else play();
    });
  })();

  /* --- Gallery filters ---------------------------------------------------- */

  (function filters() {
    each('[data-gallery]', function (root) {
      var chips = $$('[data-filter]', root);
      var items = $$('.grid__item', root);
      var status = $('[data-gallery-status]', root);
      var empty = $('[data-gallery-empty]', root);
      if (!chips.length) return;

      var counterWord = status ? status.textContent.replace(/^\d+\s*/, '') : '';

      function apply(key) {
        var shown = 0;
        items.forEach(function (item) {
          var match = key === 'all' || item.dataset.group === key;
          item.hidden = !match;
          if (match) shown += 1;
        });

        chips.forEach(function (chip) {
          var active = chip.dataset.filter === key;
          chip.classList.toggle('is-active', active);
          chip.setAttribute('aria-pressed', String(active));
        });

        if (status) status.textContent = shown + ' ' + counterWord;
        if (empty) empty.hidden = shown !== 0;
      }

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          apply(chip.dataset.filter);
        });
      });
    });
  })();

  /* --- Lightbox ----------------------------------------------------------- */

  (function lightbox() {
    var root = $('[data-lightbox-root]');
    if (!root) return;

    var image = $('[data-lightbox-image]', root);
    var caption = $('[data-lightbox-caption]', root);
    var counter = $('[data-lightbox-counter]', root);
    var dialog = $('.lightbox__dialog', root);

    var items = [];
    var index = 0;
    var opener = null;

    function collect(group) {
      var container = document.querySelector('[data-lightbox-group="' + group + '"]');
      if (!container) return [];
      return $$('.grid__item', container)
        .filter(function (item) {
          return !item.hidden;
        })
        .map(function (item) {
          var img = $('img', item);
          var source = $('source', item);
          return {
            src: img.getAttribute('src'),
            srcset: source ? source.getAttribute('srcset') : '',
            alt: img.getAttribute('alt') || '',
          };
        });
    }

    function render() {
      var item = items[index];
      if (!item) return;
      // Hand the browser the whole ladder so it picks a rendition that suits
      // the viewport instead of always pulling the 1200px JPEG.
      if (item.srcset) image.setAttribute('srcset', item.srcset);
      else image.removeAttribute('srcset');
      image.setAttribute('sizes', '95vw');
      image.setAttribute('src', item.src);
      image.setAttribute('alt', item.alt);
      caption.textContent = item.alt;
      counter.textContent = index + 1 + ' / ' + items.length;
    }

    function open(group, start, trigger) {
      items = collect(group);
      if (!items.length) return;
      index = Math.max(0, Math.min(start, items.length - 1));
      opener = trigger;
      root.hidden = false;
      document.body.classList.add('is-locked');
      render();
      var close = $('[data-lightbox-close].lightbox__btn', root);
      if (close) close.focus();
    }

    function close() {
      root.hidden = true;
      document.body.classList.remove('is-locked');
      if (opener) opener.focus();
      opener = null;
    }

    function step(delta) {
      index = (index + delta + items.length) % items.length;
      render();
    }

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-lightbox]');
      if (!trigger) return;
      event.preventDefault();
      // The stored index counts every tile; re-derive it from the visible set
      // so filtering and the lightbox stay in step.
      var group = trigger.dataset.lightbox;
      var container = document.querySelector('[data-lightbox-group="' + group + '"]');
      var visible = $$('.grid__item', container).filter(function (item) {
        return !item.hidden;
      });
      var position = visible.indexOf(trigger.closest('.grid__item'));
      open(group, position < 0 ? 0 : position, trigger);
    });

    $$('[data-lightbox-close]', root).forEach(function (button) {
      button.addEventListener('click', close);
    });
    var prev = $('[data-lightbox-prev]', root);
    var next = $('[data-lightbox-next]', root);
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    document.addEventListener('keydown', function (event) {
      if (root.hidden) return;
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'Tab') {
        // Keep focus inside the dialog while it is open.
        var focusable = $$('button, [href]', dialog);
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

    // Swipe on touch devices.
    var startX = null;
    root.addEventListener(
      'touchstart',
      function (event) {
        startX = event.changedTouches[0].clientX;
      },
      { passive: true },
    );
    root.addEventListener(
      'touchend',
      function (event) {
        if (startX === null) return;
        var delta = event.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1);
        startX = null;
      },
      { passive: true },
    );
  })();

  /* --- Click-to-load map -------------------------------------------------- */

  (function map() {
    each('[data-map]', function (box) {
      var button = $('[data-map-load]', box);
      if (!button) return;

      function load() {
        var frame = document.createElement('iframe');
        frame.setAttribute('src', box.dataset.mapSrc);
        frame.setAttribute('title', box.dataset.mapTitle || 'Map');
        frame.setAttribute('loading', 'lazy');
        frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        box.innerHTML = '';
        box.appendChild(frame);
        try {
          localStorage.setItem('anna:map', '1');
        } catch (error) {
          /* storage disabled — the map still loads for this visit */
        }
      }

      button.addEventListener('click', load);

      // Someone who has already agreed should not have to agree again.
      try {
        if (localStorage.getItem('anna:map') === '1') load();
      } catch (error) {
        /* ignore */
      }
    });
  })();

  /* --- Reservation form --------------------------------------------------- */

  (function reservationForm() {
    each('[data-reservation-form]', function (form) {
      var summary = $('[data-form-summary]', form);
      var summaryText = $('[data-form-summary-text]', form);
      var done = $('[data-form-done]', form);
      var submit = $('[data-submit]', form);

      // Error strings are rendered into the page by the build, one per language.
      var messages = JSON.parse(form.dataset.messages || '{}');

      function setError(input, message) {
        var wrap = input.closest('.field');
        var slot = wrap ? $('[data-error-for="' + input.id + '"]', wrap) : null;
        if (wrap) wrap.classList.toggle('is-invalid', Boolean(message));
        if (slot) slot.textContent = message || '';
        input.setAttribute('aria-invalid', message ? 'true' : 'false');
      }

      /** The old Divi datepicker submitted d-m-Y; keep that exactly. */
      function toLegacyDate(value) {
        if (!value) return '';
        var parts = value.split('-');
        if (parts.length !== 3) return value;
        return parts[2] + '-' + parts[1] + '-' + parts[0];
      }

      function validate() {
        var problems = [];

        $$('[required]', form).forEach(function (input) {
          var value = (input.value || '').trim();
          var message = '';

          if (!value) message = messages[input.id] || messages.generic || '';
          else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
            message = messages[input.id] || '';

          setError(input, message);
          if (message) problems.push(input);
        });

        var arrival = $('#r-arrival', form);
        var departure = $('#r-departure', form);
        if (arrival && departure && arrival.value && departure.value) {
          if (departure.value <= arrival.value) {
            setError(departure, messages['r-departure'] || '');
            problems.push(departure);
          }
        }

        return problems;
      }

      function payload() {
        var data = {};
        // Mirror the two visible date fields into their legacy-named twins.
        $$('[data-date-for]', form).forEach(function (input) {
          var hidden = form.querySelector('input[type="hidden"][name="' + input.dataset.dateFor + '"]');
          if (hidden) hidden.value = toLegacyDate(input.value);
        });

        $$('[name]', form).forEach(function (input) {
          if (input.name === 'company') return;
          data[input.name] = input.value;
        });
        return data;
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Honeypot: a real visitor never sees this field.
        if ($('#r-company', form) && $('#r-company', form).value) return;

        var problems = validate();
        if (problems.length) {
          if (summary && summaryText) {
            summaryText.textContent = messages.summary || '';
            summary.hidden = false;
          }
          problems[0].focus();
          return;
        }
        if (summary) summary.hidden = true;

        var data = payload();
        var provider = form.dataset.provider;

        if (provider === 'endpoint' && form.dataset.endpoint) {
          submit.disabled = true;
          submit.textContent = submit.dataset.labelSending;
          fetch(form.dataset.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
            .then(function () {
              form.reset();
              if (done) done.hidden = false;
            })
            .finally(function () {
              submit.disabled = false;
              submit.textContent = submit.dataset.labelSubmit || submit.textContent;
            });
          return;
        }

        if (provider === 'netlify') {
          form.submit();
          return;
        }

        // Default: open the visitor's own mail client with everything filled in.
        var lines = Object.keys(data).map(function (key) {
          return key + ': ' + data[key];
        });
        var href =
          'mailto:' +
          form.dataset.email +
          '?subject=' +
          encodeURIComponent(form.dataset.subject) +
          '&body=' +
          encodeURIComponent(lines.join('\n'));
        window.location.href = href;
        if (done) done.hidden = false;
      });

      // Clear a field's error as soon as the visitor starts fixing it.
      form.addEventListener('input', function (event) {
        var input = event.target;
        if (input.getAttribute('aria-invalid') === 'true') setError(input, '');
      });
    });
  })();

  /* --- "Also available in your language" bar ------------------------------- */

  (function languageHint() {
    var data = $('#lang-data');
    if (!data) return;

    var options;
    try {
      options = JSON.parse(data.textContent);
    } catch (error) {
      return;
    }
    if (!options.length) return;

    var dismissed;
    try {
      dismissed = localStorage.getItem('anna:langbar') === '1' || localStorage.getItem('anna:lang');
    } catch (error) {
      dismissed = false;
    }
    if (dismissed) return;

    var preferred = (navigator.languages || [navigator.language || '']).map(function (code) {
      return String(code).slice(0, 2).toLowerCase();
    });

    var current = document.documentElement.lang.slice(0, 2).toLowerCase();
    if (preferred.indexOf(current) === 0) return;

    var match = null;
    for (var i = 0; i < preferred.length && !match; i += 1) {
      for (var j = 0; j < options.length; j += 1) {
        if (options[j].code === preferred[i]) {
          match = options[j];
          break;
        }
      }
    }
    if (!match) return;

    var bar = document.createElement('div');
    bar.className = 'langbar';
    bar.setAttribute('role', 'region');
    bar.lang = match.code;
    bar.innerHTML =
      '<span class="langbar__text"></span>' +
      '<a class="langbar__action" href=""></a>' +
      '<button type="button" class="langbar__close" aria-label="">' +
      '<svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
      '<path d="M6 6l12 12M18 6 6 18"/></svg></button>';

    $('.langbar__text', bar).textContent = match.suggest;
    var action = $('.langbar__action', bar);
    action.textContent = match.action;
    action.setAttribute('href', match.href);
    var close = $('.langbar__close', bar);
    close.setAttribute('aria-label', match.dismiss);
    close.addEventListener('click', function () {
      bar.remove();
      try {
        localStorage.setItem('anna:langbar', '1');
      } catch (error) {
        /* ignore */
      }
    });

    document.body.appendChild(bar);
  })();
})();
