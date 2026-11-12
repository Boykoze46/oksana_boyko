/* =========================================================
   Оксана Бойко — скрипты сайта
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Настройки ---------- */
  var WHATSAPP_NUMBER = '77058298547';
  var COURSE_MESSAGE_PREFIX = 'Здравствуйте, хотела бы пройти курс ';

  /*
   * Сертификаты Оксаны.
   * Чтобы добавить сертификаты: положите изображения в папку assets/certificates/
   * и перечислите их здесь, например:
   *   { src: 'assets/certificates/cert-01.jpg', alt: 'Сертификат Оксаны Бойко о повышении квалификации' },
   */
  var CERTIFICATES = [];

  document.documentElement.classList.add('js');

  /* ---------- Ссылки WhatsApp ---------- */
  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  document.querySelectorAll('[data-course]').forEach(function (el) {
    el.setAttribute('href', waLink(COURSE_MESSAGE_PREFIX + el.getAttribute('data-course')));
  });
  document.querySelectorAll('[data-wa-text]').forEach(function (el) {
    el.setAttribute('href', waLink(el.getAttribute('data-wa-text')));
  });

  /* ---------- Шапка и мобильное меню ---------- */
  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var waFloat = document.querySelector('.wa-float');
  var hero = document.querySelector('.hero');

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', y > 20);
    if (waFloat && hero) {
      waFloat.classList.toggle('is-visible', y > hero.offsetHeight * 0.6);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('no-scroll', open);
  }

  burger.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      burger.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980 && nav.classList.contains('is-open')) setMenu(false);
  });

  /* ---------- Подсветка активного пункта меню ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sectionMap = {
    about: '#about', works: '#works', certificates: '#certificates', contacts: '#contacts',
    courses: '#courses', 'course-zero': '#courses', 'course-pedicure': '#courses', 'course-reboot': '#courses'
  };

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var target = sectionMap[entry.target.id];
        navLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(sectionMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Появление блоков при прокрутке ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
          return c.classList.contains('reveal');
        });
        var index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(index * 80, 400) + 'ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Фильтр работ ---------- */
  var filters = document.querySelectorAll('.filter');
  var tiles = document.querySelectorAll('.masonry .tile');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      tiles.forEach(function (tile) {
        var show = cat === 'all' || tile.getAttribute('data-cat') === cat;
        tile.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- Вкладки в галереях курсов ---------- */
  document.querySelectorAll('.tabs').forEach(function (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('.tab'));

    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var active = t === tab;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
        t.setAttribute('tabindex', active ? '0' : '-1');
        if (panel) {
          panel.hidden = !active;
          panel.classList.toggle('is-active', active);
          if (active) {
            var strip = panel.querySelector('.strip');
            if (strip) strip.scrollLeft = 0;
          }
        }
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) { e.preventDefault(); activate(next, true); }
      });
    });
  });

  /* ---------- Стрелки прокрутки галерей курсов ---------- */
  document.querySelectorAll('.course-gallery').forEach(function (gallery) {
    var head = gallery.querySelector('.course-gallery__head');
    var tabsEl = head.querySelector('.tabs');
    var controls = document.createElement('div');
    controls.className = 'course-gallery__controls';
    var navEl = document.createElement('div');
    navEl.className = 'strip-nav';
    navEl.innerHTML =
      '<button type="button" data-dir="-1" aria-label="Прокрутить фото назад"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>' +
      '<button type="button" data-dir="1" aria-label="Прокрутить фото вперёд"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>';
    head.insertBefore(controls, tabsEl);
    controls.appendChild(tabsEl);
    controls.appendChild(navEl);

    navEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var strip = gallery.querySelector('.tab-panel:not([hidden]) .strip');
      if (!strip) return;
      strip.scrollBy({ left: Number(btn.getAttribute('data-dir')) * strip.clientWidth * 0.8, behavior: 'smooth' });
    });
  });

  /* ---------- Сертификаты ---------- */
  var certsGrid = document.getElementById('certsGrid');
  if (certsGrid) {
    if (CERTIFICATES.length) {
      CERTIFICATES.forEach(function (cert) {
        var fig = document.createElement('figure');
        fig.className = 'cert';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cert__btn';
        btn.setAttribute('data-full', cert.src);
        var img = document.createElement('img');
        img.src = cert.src;
        img.alt = cert.alt || 'Сертификат Оксаны Бойко';
        img.loading = 'lazy';
        btn.appendChild(img);
        fig.appendChild(btn);
        certsGrid.appendChild(fig);
      });
    } else {
      certsGrid.innerHTML =
        '<div class="certs__empty">' +
        '<svg aria-hidden="true"><use href="#i-nail"/></svg>' +
        '<p>Фотографии сертификатов Оксаны появятся в этом разделе. ' +
        'Узнать о них подробнее можно, написав Оксане в WhatsApp или Instagram.</p>' +
        '</div>';
    }
  }

  /* ---------- Полноэкранный просмотр (лайтбокс) ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = lightbox.querySelector('.lightbox__img');
  var lbCaption = lightbox.querySelector('.lightbox__caption');
  var lbCounter = lightbox.querySelector('.lightbox__counter');
  var lbClose = lightbox.querySelector('.lightbox__close');
  var lbPrev = lightbox.querySelector('.lightbox__nav--prev');
  var lbNext = lightbox.querySelector('.lightbox__nav--next');
  var lbItems = [];
  var lbIndex = 0;
  var lastFocus = null;

  function galleryItems(container) {
    return Array.prototype.filter.call(container.querySelectorAll('[data-full]'), function (el) {
      var tile = el.closest('.tile');
      return !(tile && tile.classList.contains('is-hidden'));
    });
  }

  function showItem(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    var item = lbItems[lbIndex];
    var thumb = item.querySelector('img');
    var alt = thumb ? thumb.getAttribute('alt') : '';
    lbImg.classList.add('is-loading');
    lbImg.onload = function () { lbImg.classList.remove('is-loading'); };
    lbImg.src = item.getAttribute('data-full');
    lbImg.alt = alt;
    lbCaption.textContent = alt;
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbItems.length;
    // предзагрузка соседних фото
    [lbIndex + 1, lbIndex - 1].forEach(function (n) {
      var near = lbItems[(n + lbItems.length) % lbItems.length];
      if (near) { var pre = new Image(); pre.src = near.getAttribute('data-full'); }
    });
  }

  function openLightbox(trigger) {
    var container = trigger.closest('[data-gallery]');
    lbItems = container ? galleryItems(container) : [trigger];
    lastFocus = trigger;
    lightbox.classList.toggle('is-single', lbItems.length < 2);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    showItem(Math.max(0, lbItems.indexOf(trigger)));
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () {
      lightbox.hidden = true;
      lbImg.removeAttribute('src');
    }, 250);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-full]');
    if (trigger) { e.preventDefault(); openLightbox(trigger); }
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { showItem(lbIndex - 1); });
  lbNext.addEventListener('click', function () { showItem(lbIndex + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__figure')) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight' && lbItems.length > 1) showItem(lbIndex + 1);
    else if (e.key === 'ArrowLeft' && lbItems.length > 1) showItem(lbIndex - 1);
    else if (e.key === 'Tab') {
      // удерживаем фокус внутри окна просмотра
      var focusables = Array.prototype.filter.call(lightbox.querySelectorAll('button'), function (b) {
        return b.offsetParent !== null;
      });
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // свайпы на телефоне
  var touchX = null;
  lightbox.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (touchX === null || lbItems.length < 2) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showItem(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* ---------- Год в подвале ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
