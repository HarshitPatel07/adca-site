/* ==========================================================================
   Agarwal & Dhandhania — behaviour + rendering
   --------------------------------------------------------------------------
   Reads window.ADCA (assets/js/data.js) and renders the navigation, slider,
   counters, service tiles and detail accordions, the "Why" arch, branches,
   camp-office network, publications and gallery.

   Each page carries <body data-page="KEY"> plus empty mount points; whatever
   is present on the page gets filled, whatever is absent is skipped.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.ADCA;
  if (!D) { console.error('ADCA data not loaded'); return; }

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMG = 'assets/img/';

  /* ======================================================================
     NAVIGATION
     ====================================================================== */
  function navHref(item) { return item.href; }

  function renderNav() {
    var active = document.body.getAttribute('data-page') || '';
    var caret = '<svg class="caret" viewBox="0 0 10 10"><path d="M0 2h10L5 8z"/></svg>';

    var main = $('.main-nav');
    if (main) {
      main.innerHTML = D.nav.map(function (it) {
        var cls = it.key === active ? ' class="active"' : '';
        var sub = '';
        if (it.sub === 'budgets') {
          sub = '<div class="sub sub--scroll">' +
            D.budgets.map(function (b) {
              return '<a href="publication.html#' + b.slug + '">' + b.label + '</a>';
            }).join('') + '</div>';
        } else if (it.sub) {
          sub = '<div class="sub">' + it.sub.map(function (s) {
            return '<a href="' + s.href + '">' + s.label + '</a>';
          }).join('') + '</div>';
        }
        return '<li><a' + cls + ' href="' + navHref(it) + '">' + it.label +
               (sub ? caret : '') + '</a>' + sub + '</li>';
      }).join('');
    }

    var foot = $('.foot-nav ul');
    if (foot) {
      foot.innerHTML = D.nav.map(function (it) {
        return '<li><a' + (it.key === active ? ' class="active"' : '') +
               ' href="' + navHref(it) + '">' + it.label + '</a></li>';
      }).join('');
    }
  }

  /* ======================================================================
     HERO SLIDER
     ====================================================================== */
  function renderSlider() {
    var wrap = $('.slides');
    if (!wrap) return;

    wrap.innerHTML = D.slides.map(function (s, i) {
      return '<div class="slide' + (i === 0 ? ' is-active' : '') + '">' +
        '<img class="slide-img" src="' + s.img + '" alt=""' +
          (i === 0 ? '' : ' loading="lazy"') + '>' +
        '<div class="slide-caption"><div class="container">' +
          '<h2>' + s.h + '</h2><p>' + s.p + '</p>' +
          '<a class="btn btn--amber" href="' + s.href + '">' + s.cta + '</a>' +
        '</div></div></div>';
    }).join('');

    var slides = $$('.slide', wrap);
    var dotsWrap = $('.hero-dots');
    var i = 0, timer = null;
    var DELAY = 6000;

    var dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = slides.map(function (_, n) {
        return '<button type="button" aria-label="Slide ' + (n + 1) + '"></button>';
      }).join('');
      dots = $$('button', dotsWrap);
      dots.forEach(function (b, n) { b.addEventListener('click', function () { go(n); }); });
    }

    function paint() {
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      dots.forEach(function (d, n) { d.classList.toggle('is-active', n === i); });
    }
    function go(n) { i = (n + slides.length) % slides.length; paint(); restart(); }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, DELAY); }

    var prev = $('.hero-arrow.prev'), next = $('.hero-arrow.next');
    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });

    /* pause while hovered or when the tab is hidden */
    var hero = $('.hero');
    hero.addEventListener('mouseenter', function () { clearInterval(timer); });
    hero.addEventListener('mouseleave', restart);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer); else restart();
    });

    /* keyboard */
    document.addEventListener('keydown', function (e) {
      if ($('.lightbox.is-on')) return;
      if (e.key === 'ArrowLeft')  go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });

    /* touch swipe */
    var x0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) go(dx < 0 ? i + 1 : i - 1);
      x0 = null;
    });

    paint(); restart();
  }

  /* ======================================================================
     COUNTERS
     ====================================================================== */
  function renderStats() {
    var box = $('#stats');
    if (!box) return;
    box.innerHTML = D.stats.map(function (s) {
      return '<div><div class="n" data-to="' + s.n + '" data-suffix="' + s.suffix +
             '">0' + s.suffix + '</div><div class="l">' + s.label + '</div></div>';
    }).join('');

    var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    $$('.n', box).forEach(function (el) {
      var to = +el.getAttribute('data-to');
      var sfx = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = to + sfx; return; }
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || seen) return;
        seen = true;
        var dur = 1400, t0 = null;
        function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + sfx;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.disconnect();
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  /* ======================================================================
     ABOUT (home)
     ====================================================================== */
  function renderAbout() {
    var box = $('#about-copy');
    if (!box) return;
    box.innerHTML = D.about.paras.map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }

  function renderSeal() {
    var el = $('#seal-years');
    if (el) el.textContent = (new Date().getFullYear() - D.firm.founded) + ' Years';
  }

  /* ======================================================================
     SERVICES
     ====================================================================== */
  function renderServiceTiles() {
    var grid = $('#svc-grid');
    if (!grid) return;
    grid.innerHTML = D.services.map(function (s) {
      return '<a class="svc-card reveal" href="services.html#' + s.id + '">' +
        '<span class="ico">' +
          '<img class="c" src="' + IMG + s.icon + '" alt="" loading="lazy">' +
          '<img class="w" src="' + IMG + s.iconWhite + '" alt="" loading="lazy">' +
        '</span><h3>' + s.name + '</h3></a>';
    }).join('');
  }

  function renderServiceDetail() {
    var box = $('#svc-detail');
    if (!box) return;
    box.innerHTML = D.services.map(function (s, n) {
      var body = '';
      if (s.intro)  body += '<p>' + s.intro + '</p>';
      if (s.paras)  body += s.paras.map(function (p) { return '<p>' + p + '</p>'; }).join('');
      if (s.items)  body += '<ul>' + s.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
      if (s.groups) body += s.groups.map(function (g) {
        return '<h4>' + g.title + '</h4><ul>' +
          g.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
      }).join('');

      var count = (s.items ? s.items.length : 0) +
        (s.groups ? s.groups.reduce(function (a, g) { return a + g.items.length; }, 0) : 0);

      return '<div class="acc' + (n === 0 ? ' is-open' : '') + '" id="' + s.id + '">' +
        '<button type="button" aria-expanded="' + (n === 0) + '">' +
          '<span class="ai"><img src="' + IMG + s.icon + '" alt="" loading="lazy"></span>' +
          '<span>' + s.name + '</span>' +
          (count ? '<span class="count">' + count + ' services</span>' : '') +
          '<span class="plus"></span>' +
        '</button>' +
        '<div class="acc-body">' + body + '</div></div>';
    }).join('');
  }

  /* ======================================================================
     WHY — the firm's arch graphic with labels placed geometrically
     ====================================================================== */
  function renderWhy() {
    var wrap = $('#arc-wrap');
    var list = $('#why-list');

    /* centre (500,430), node ring r=300 — outside the arch's 274px radius */
    var POS = {
      l3:  { x: 200, y: 430, anchor: 'end',    ico: 'M12 3l2 5 5 .4-3.8 3.3 1.1 5-4.3-2.6L7.7 16.7l1.1-5L5 8.4 10 8z' },
      l2:  { x: 240, y: 280, anchor: 'end',    ico: 'M12 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 20a6 6 0 0 1 12 0' },
      l1:  { x: 350, y: 170, anchor: 'end',    ico: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3.6 3 14.4 0 18M12 3c-3 3.6-3 14.4 0 18' },
      top: { x: 500, y: 130, anchor: 'middle', ico: 'M4 18l6-7 4 3 6-8M20 6h-4M20 6v4' },
      r1:  { x: 650, y: 170, anchor: 'start',  ico: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l4 2' },
      r2:  { x: 760, y: 280, anchor: 'start',  ico: 'M4 5h16v11h-8l-4 4v-4H4zM8 9h8M8 12.5h5' },
      r3:  { x: 800, y: 430, anchor: 'start',  ico: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01' }
    };

    if (wrap) {
      var nodes = '', labels = '';
      D.why.forEach(function (w) {
        var p = POS[w.pos];
        if (!p) return;
        nodes += '<g class="arc-node"><circle cx="' + p.x + '" cy="' + p.y + '" r="26"/>' +
          '<g transform="translate(' + (p.x - 11) + ',' + (p.y - 11) + ') scale(.92)">' +
          '<path d="' + p.ico + '"/></g></g>';

        var lines = w.text.split(/<br\s*\/?>/i);
        var lx = p.anchor === 'end' ? p.x - 32 : p.anchor === 'start' ? p.x + 32 : p.x;
        var ly;
        if (p.anchor === 'middle') ly = p.y - 42;                    /* above the top node */
        else ly = lines.length > 1 ? p.y - 3 : p.y + 5;
        labels += '<text class="arc-label" x="' + lx + '" y="' + ly +
          '" text-anchor="' + p.anchor + '">' + lines[0] +
          lines.slice(1).map(function (l) {
            return '<tspan x="' + lx + '" dy="16">' + l + '</tspan>';
          }).join('') + '</text>';
      });

      wrap.innerHTML =
        '<svg viewBox="0 0 1000 470" role="img" aria-label="Why Agarwal &amp; Dhandhania">' +
          '<image href="' + IMG + 'why-1.png" x="226" y="156" width="548" height="274"/>' +
          /* the stroke follows the stylesheet's green rather than a copy of it —
             a hard-coded #17703f here kept the old brighter green after the
             palette was matched to the live site, so the node rings sat a shade
             off everything around them */
          '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" ' +
            'stroke-linejoin="round">' + nodes + '</g>' +
          labels +
        '</svg>';
    }

    if (list) {
      list.innerHTML = D.why.map(function (w, n) {
        return '<li><b>' + (n < 9 ? '0' : '') + (n + 1) + '</b><span>' +
               w.text.replace(/<br\s*\/?>/i, ' ') + '</span></li>';
      }).join('');
    }
  }

  /* ======================================================================
     TEAM / DESIGNATIONS
     ====================================================================== */
  function renderDesignations() {
    var box = $('#designations');
    if (!box) return;
    box.innerHTML = D.team.designations.map(function (d) {
      return '<span class="chip">' + d + '</span>';
    }).join('');
  }

  /* ======================================================================
     BRANCHES + CAMP OFFICE
     ====================================================================== */
  function renderBranches() {
    var box = $('#branch-grid');
    if (!box) return;
    var f = D.firm;
    var head = '<div class="branch branch--head reveal"><h3>Head Office — Surat</h3>' +
      '<p>' + f.address + '</p>' +
      '<a href="' + f.phoneHref + '">' + f.phone + '</a> &nbsp;·&nbsp; ' +
      '<a href="mailto:' + f.email + '">' + f.email + '</a></div>';

    box.innerHTML = head + D.branches.map(function (b) {
      return '<div class="branch reveal"><h3>' + b.city + '</h3><p>' + b.addr + '</p>' +
        (b.phone ? '<a href="tel:' + b.phone.replace(/[^0-9+]/g, '') + '">' + b.phone + '</a>' : '') +
        '</div>';
    }).join('');
  }

  function renderCamp() {
    var box = $('#camp-list');
    if (!box) return;

    /* counts are derived from the data, never hand-typed */
    var totalCities = D.camp.reduce(function (a, s) { return a + s.cities.length; }, 0);
    var summary = $('#camp-summary');
    if (summary) {
      summary.textContent = D.camp.length + ' states  ·  ' + totalCities + ' cities';
    }

    box.innerHTML = D.camp.map(function (s) {
      return '<div class="acc"><button type="button" aria-expanded="false">' +
        '<span>' + s.state + '</span>' +
        '<span class="count">' + s.cities.length + ' cities</span>' +
        '<span class="plus"></span></button>' +
        '<div class="acc-body"><ul>' +
          s.cities.map(function (c) { return '<li>' + c + '</li>'; }).join('') +
        '</ul></div></div>';
    }).join('');
  }

  /* ======================================================================
     PUBLICATIONS
     ====================================================================== */
  function renderBudgets() {
    var box = $('#pub-grid');
    if (!box) return;
    var ico = '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/></svg>';
    box.innerHTML = D.budgets.map(function (b) {
      return '<a id="' + b.slug + '" href="https://www.adcaindia.com/publication/' + b.slug +
             '/" target="_blank" rel="noopener">' + ico + '<span>' + b.label + '</span></a>';
    }).join('');
  }

  /* ======================================================================
     GALLERY + LIGHTBOX
     ====================================================================== */
  function renderGallery() {
    var box = $('#gal-grid');
    if (!box) return;

    box.innerHTML = D.gallery.map(function (src, n) {
      return '<button type="button" data-i="' + n + '" aria-label="Open photograph ' +
             (n + 1) + '"><img src="' + src + '" alt="Agarwal &amp; Dhandhania event photograph ' +
             (n + 1) + '" loading="lazy"></button>';
    }).join('');

    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous">&lsaquo;</button>' +
      '<img alt="">' +
      '<button class="lb-next" aria-label="Next">&rsaquo;</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);

    var img = $('img', lb), cnt = $('.lb-count', lb), cur = 0;

    function show(n) {
      cur = (n + D.gallery.length) % D.gallery.length;
      img.src = D.gallery[cur];
      cnt.textContent = (cur + 1) + ' / ' + D.gallery.length;
    }
    function open(n) { show(n); lb.classList.add('is-on'); document.body.style.overflow = 'hidden'; }
    function close() { lb.classList.remove('is-on'); document.body.style.overflow = ''; }

    $$('button', box).forEach(function (b) {
      b.addEventListener('click', function () { open(+b.getAttribute('data-i')); });
    });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { show(cur - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ======================================================================
     ACCORDIONS (delegated — works for services and camp office)
     ====================================================================== */
  function wireAccordions() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.acc > button');
      if (!btn) return;
      var acc = btn.parentElement;
      var open = acc.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  /* ======================================================================
     HEADER / SCROLL / REVEAL
     ====================================================================== */
  function wireChrome() {
    var header = $('.site-header');
    var toTop  = $('.to-top');
    var bar    = $('.progress');

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle('is-stuck', y > 70);
      if (toTop)  toTop.classList.toggle('is-on', y > 400);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* mobile drawer */
    var burger = $('.burger'), nav = $('.main-nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        nav.classList.toggle('is-open');
        burger.classList.toggle('is-open');
      });
    }
    /* nested submenu opens on tap below 860px */
    $$('.main-nav > li').forEach(function (li) {
      var a = li.querySelector(':scope > a');
      if (!li.querySelector('.sub') || !a) return;
      a.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width:860px)').matches) {
          e.preventDefault();
          li.classList.toggle('is-open');
        }
      });
    });

    /* scroll reveal */
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var sibs = Array.prototype.indexOf.call(en.target.parentElement.children, en.target);
        en.target.style.transitionDelay = Math.min(sibs, 6) * 70 + 'ms';
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     FORMS (front-end validation only — nothing is transmitted)
     ====================================================================== */
  /* Where enquiries go. Kept here rather than scattered through the markup so
     it is changed in one place if the firm ever moves address. */
  var MAIL = 'connect@adcaindia.com';

  /* Build a mailto: from whatever the form holds. The inputs carry no name
     attributes — only placeholders — so the placeholder is the label, with its
     required marker trimmed off. */
  function mailtoFrom(form, subject) {
    var lines = [];
    $$('input,textarea', form).forEach(function (f) {
      if (f.type === 'checkbox' || f.type === 'submit' || f.type === 'button') return;
      var label = (f.getAttribute('placeholder') || f.name || 'Detail')
        .replace(/\s*\*+\s*$/, '').trim();
      var v = (f.value || '').trim();
      if (v) lines.push(label + ': ' + v);
    });
    return 'mailto:' + MAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n') + '\n\n— sent from adcaindia.com');
  }

  function wireForms() {
    var qc = $('.qc form');
    if (qc) {
      qc.addEventListener('submit', function (e) {
        e.preventDefault();
        var out = $('.msg', qc), ok = true;

        $$('input[required],textarea[required]', qc).forEach(function (f) {
          var err = f.parentElement.querySelector('.err');
          var v = f.value.trim(), m = '';
          if (!v) m = 'Required.';
          else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = 'Enter a valid email.';
          else if (f.type === 'tel' && v.replace(/\D/g, '').length < 7) m = 'Enter a valid phone.';
          f.setAttribute('aria-invalid', m ? 'true' : 'false');
          if (err) err.textContent = m;
          if (m) ok = false;
        });

        var robot = $('.robot input', qc);
        if (robot && !robot.checked) { out.textContent = 'Please confirm you are not a robot.'; return; }
        if (!ok) { out.textContent = 'Please correct the highlighted fields.'; return; }

        /* The site is static, so there is nowhere on the server to post to.
           The enquiry is handed to the visitor's own mail program instead —
           no third party sees it, and nothing has to be signed up for. The
           form used to say thank you and throw the enquiry away, which is
           worse than not having the form at all. */
        var link = mailtoFrom(qc, 'Website enquiry');
        qc.dataset.mailto = link;          /* recorded so the build can be checked */
        window.location.href = link;

        out.textContent = 'Opening your email app with the enquiry ready to send — ' +
          'please press send there. If nothing opens, email us at ' + MAIL + '.';
        qc.reset();
        $$('.err', qc).forEach(function (el) { el.textContent = ''; });
      });
    }

    var nl = $('.newsletter form');
    if (nl) {
      nl.addEventListener('submit', function (e) {
        e.preventDefault();
        var out = $('.nl-msg');
        var v = $('input', nl).value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
          if (out) out.textContent = 'Please enter a valid email address.';
          return;
        }
        var nlLink = 'mailto:' + MAIL +
          '?subject=' + encodeURIComponent('Newsletter subscription') +
          '&body=' + encodeURIComponent('Please add this address to the newsletter: ' + v +
                                        '\n\n— sent from adcaindia.com');
        nl.dataset.mailto = nlLink;
        window.location.href = nlLink;
        if (out) out.textContent = 'Opening your email app to confirm — please press send there.';
        nl.reset();
      });
    }
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function boot() {
    renderNav();
    renderSlider();
    renderStats();
    renderAbout();
    renderSeal();
    renderServiceTiles();
    renderServiceDetail();
    renderWhy();
    renderDesignations();
    renderBranches();
    renderCamp();
    renderBudgets();
    renderGallery();
    wireAccordions();
    wireForms();
    wireChrome();   /* last: reveal observer must see rendered nodes */

    /* if the URL carries a #hash for an accordion, open it */
    if (location.hash) {
      var t = document.getElementById(location.hash.slice(1));
      if (t && t.classList.contains('acc')) {
        t.classList.add('is-open');
        t.querySelector('button').setAttribute('aria-expanded', 'true');
        t.scrollIntoView({ block: 'center' });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
