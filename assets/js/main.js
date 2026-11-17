/* ==========================================================================
   Agarwal & Dhandhania — behaviour + rendering
   --------------------------------------------------------------------------
   Reads window.ADCA (assets/js/data.js) and renders the navigation, slider,
   counters, service tiles and detail accordions, the "Why" arch, branches,
   publications and gallery.

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
     SOCIAL ACCOUNTS
     ----------------------------------------------------------------------
     Fills every .social-chips block — header and footer, every page — from
     the one list in data.js. These used to be twenty-six copies of the same
     markup across thirteen files, each with href="#", so none of them went
     anywhere and correcting them meant twenty-six edits.
     ====================================================================== */
  function renderSocial() {
    var links = D.social || [];
    if (!links.length) return;
    var html = links.map(function (s) {
      var external = s.href.indexOf('http') === 0;
      return '<a href="' + s.href + '" aria-label="' + s.name + '"' +
        (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
        '<svg viewBox="0 0 24 24"><path d="' + s.path + '"/></svg></a>';
    }).join('');
    $$('.social-chips').forEach(function (box) { box.innerHTML = html; });
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
    var prev = $('.hero-arrow.prev'), next = $('.hero-arrow.next');

    /* A single featured image has no paging controls or autoplay. */
    if (slides.length <= 1) {
      if (dotsWrap) { dotsWrap.innerHTML = ''; dotsWrap.style.display = 'none'; }
      if (prev) prev.style.display = 'none';
      if (next) next.style.display = 'none';
      return;
    }

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
  function serviceIcon(id) {
    var icons = {
      audit: '<svg class="svc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 6h15l7 7v29H13z"/><path d="M28 6v8h7"/><path d="m17 22 2 2 4-4M26 22h5M17 30l2 2 4-4M26 30h5"/></g><path d="m17 37 2 2 4-4" fill="none" stroke="#f6a12a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      corporate: '<svg class="svc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="18" width="34" height="23" rx="2"/><path d="M17 18v-5h14v5M7 26h34M23 26v5h2v-5"/></g><path d="m13 34 7-6 5 3 10-10m-1 0h-6m6 0v6" fill="none" stroke="#f6a12a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      management: '<svg class="svc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="11" r="5"/><circle cx="11" cy="36" r="4"/><circle cx="37" cy="36" r="4"/><path d="M24 16v8M11 32v-6h26v6M24 24v5M7 43v-3a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v3M33 43v-3a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v3"/></g><path d="M24 21v9" fill="none" stroke="#f6a12a" stroke-width="2.2" stroke-linecap="round"/></svg>',
      accounting: '<svg class="svc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="5" width="24" height="38" rx="3"/><path d="M17 11h14v7H17zM18 24h1M24 24h1M30 24h1M18 30h1M24 30h1M30 30h1M18 36h1M24 36h1M30 36h1"/></g><path d="M17 14h14" fill="none" stroke="#f6a12a" stroke-width="2.2" stroke-linecap="round"/></svg>',
      taxation: '<svg class="svc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 17 17-9 17 9H7zM10 39h28M13 20v16M20 20v16M28 20v16M35 20v16M8 43h32"/></g><circle cx="36" cy="11" r="6" fill="#fff" stroke="#f6a12a" stroke-width="2"/><path d="M36 8v6m2-5c-.6-1-3-1-3 0 0 2 3 1 3 3 0 1.3-2.3 1.7-3.5.5" fill="none" stroke="#f6a12a" stroke-width="1.5" stroke-linecap="round"/></svg>',
      forensic: '<svg class="svc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7h21l7 7v17M30 7v8h7M14 20h13M14 26h10"/><circle cx="29" cy="30" r="8"/><path d="m35 36 7 7"/></g><path d="m25 30 2.5 2.5 5-5" fill="none" stroke="#f6a12a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      turnkey: '<svg class="svc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="16" height="16" rx="2"/><path d="M24 5v8m0-8-3 3m3-3 3 3M24 43v-8m0 8-3-3m3 3 3-3M5 24h8m-8 0 3-3m-3 3 3 3M43 24h-8m8 0-3-3m3 3-3 3"/></g><path d="M20 22h8M20 26h8" fill="none" stroke="#f6a12a" stroke-width="2" stroke-linecap="round"/></svg>',
      kpo: '<svg class="svc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 25v-4a16 16 0 0 1 32 0v4M8 23a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h3V23zM40 23a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-3V23zM37 35c-2 4-6 6-12 6"/></g><circle cx="24" cy="18" r="6" fill="none" stroke="#f6a12a" stroke-width="2.2"/><path d="M24 15v6m2-5c-.8-1.4-3.8-1.1-3.8.4s3.8 1.2 3.8 3.2c0 1.5-2.7 2-4 .8" fill="none" stroke="#f6a12a" stroke-width="1.6" stroke-linecap="round"/></svg>'
    };
    return icons[id] || icons.audit;
  }

  function renderServiceTiles() {
    var grid = $('#svc-grid');
    if (!grid) return;
    grid.innerHTML = D.services.map(function (s) {
      return '<a class="svc-card reveal" href="services.html#' + s.id + '">' +
        '<span class="svc-card__top"><span class="ico" aria-hidden="true">' +
          serviceIcon(s.id) +
        '</span></span>' +
        '<h3>' + s.name + '</h3><span class="svc-card__arrow" aria-hidden="true">↗</span></a>';
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
          '<span class="ai">' + serviceIcon(s.id) + '</span>' +
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
    var circle = $('#why-circle');
    var nodes = $('#why-list');
    var insight = $('.why-insight');
    var insightTitle = $('#why-insight-title');
    var insightCopy = $('#why-insight-copy');
    var insightStep = $('#why-insight-step');
    var insightProgress = $('#why-insight-progress');
    if (!circle || !nodes || !insight || !insightTitle || !insightCopy || !insightStep) return;

    var icons = {
      l2: 'why-qualified.png',
      l1: 'why-network.png',
      top: 'why-cost.png',
      r1: 'why-reliable.png',
      r2: 'why-clients.png',
      r3: 'why-friendly.png'
    };
    var insightDetails = [
      'Our team brings audit, tax, advisory and consulting experience together, so clients can get coordinated support as their needs change.',
      'Eight offices connect clients with local teams and a broader network of professionals across India.',
      'Focused scopes and practical recommendations keep advice useful, clear and mindful of value.',
      'More than 300 professionals and staff support work across the firm’s services and offices.',
      'We take time to understand each business and shape advice around its priorities and context.',
      'Clear communication and an approachable team make it easier to move from questions to next steps.'
    ];
    var detailTimer;

    function labelFor(item) {
      return item.text.replace('<br>', ' ').replace(/&amp;/g, '&');
    }
    function select(index, animate) {
      var item = D.why[index];
      if (!item) return;
      nodes.querySelectorAll('[data-why-index]').forEach(function (button, n) {
        var active = n === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      var update = function () {
        var step = (index + 1 < 10 ? '0' : '') + (index + 1);
        var total = (D.why.length < 10 ? '0' : '') + D.why.length;
        insightStep.textContent = step + ' / ' + total;
        insightTitle.textContent = labelFor(item);
        insightCopy.textContent = insightDetails[index] || item.desc || '';
        if (insightProgress) insightProgress.style.width = ((index + 1) / D.why.length * 100) + '%';
        insight.classList.remove('is-changing');
      };
      window.clearTimeout(detailTimer);
      if (animate) {
        insight.classList.add('is-changing');
        detailTimer = window.setTimeout(update, 140);
      } else update();
    }

    var pointLabels = ['Professionals', 'National network', 'Cost conscious', 'Reliable service', 'Client focused', 'Friendly team'];
    nodes.innerHTML = D.why.map(function (item, index) {
      var number = (index + 1 < 10 ? '0' : '') + (index + 1);
      return '<button class="why-point" type="button" data-why-index="' + index +
        '" aria-label="' + labelFor(item) + '" aria-pressed="false" style="--point-index:' + index + '">' +
        '<span class="why-point__badge">' +
        '<span class="why-point__halo" aria-hidden="true"></span>' +
        '<img src="' + IMG + icons[item.pos] + '" alt="" aria-hidden="true" loading="eager">' +
        '<span class="why-point__number" aria-hidden="true">' + number + '</span>' +
        '</span>' +
        '<span class="why-point__label" aria-hidden="true">' + (pointLabels[index] || 'Firm difference') + '</span>' +
        '</button>';
    }).join('');

    nodes.addEventListener('click', function (event) {
      var button = event.target.closest('[data-why-index]');
      if (button) select(+button.getAttribute('data-why-index'), true);
    });
    nodes.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowDown' &&
          event.key !== 'ArrowLeft' && event.key !== 'ArrowUp') return;
      var buttons = Array.prototype.slice.call(nodes.querySelectorAll('[data-why-index]'));
      var current = buttons.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      var step = (event.key === 'ArrowRight' || event.key === 'ArrowDown') ? 1 : -1;
      var next = (current + step + buttons.length) % buttons.length;
      buttons[next].focus();
      select(next, true);
    });
    select(0, false);

    if ('IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      var revealCircle = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        circle.classList.add('is-in');
        revealCircle.disconnect();
      }, { threshold: 0.18 });
      revealCircle.observe(circle);
    } else {
      circle.classList.add('is-in');
    }
  }

  function renderDesignations() {
    var box = $('#designations');
    if (!box) return;
    box.innerHTML = D.team.designations.map(function (d) {
      return '<span class="chip">' + d + '</span>';
    }).join('');
  }

  /* ======================================================================
     BRANCHES
     ====================================================================== */
  function renderBranches() {
    var box = $('#branch-grid');
    if (!box) return;
    var f = D.firm;
    var head = '<div class="branch branch--head reveal"><h3>Head Office — Surat</h3>' +
      '<p>' + f.address + '</p>' +
      '<a href="' + f.phoneHref + '">' + f.phone + '</a> &nbsp;·&nbsp; ' +
      '<a href="mailto:' + f.email + '">' + f.email + '</a></div>';

    var search = $('#branch-search');
    if (!search) {
      box.innerHTML = head + D.branches.map(function (b) {
        return '<div class="branch reveal"><h3>' + b.city + '</h3><p>' + b.addr + '</p>' +
          (b.phone ? '<a href="tel:' + b.phone.replace(/[^0-9+]/g, '') + '">' + b.phone + '</a>' : '') +
          '</div>';
      }).join('');
      return;
    }

    var count = $('#branch-count');
    function renderMatches() {
      var query = search.value.trim().toLowerCase();
      var matches = D.branches.filter(function (b) {
        return (b.city + ' ' + b.addr).toLowerCase().indexOf(query) !== -1;
      });
      if (count) count.textContent = matches.length + (matches.length === 1 ? ' office' : ' offices');
      if (!matches.length) {
        box.innerHTML = '<p class="branch-empty">No offices match that search. Try another city or address.</p>';
        return;
      }
      box.innerHTML = matches.map(function (b) {
        var phone = b.phone ? '<a href="tel:' + b.phone.replace(/[^0-9+]/g, '') + '">' + b.phone + '</a>' : '<a href="' + f.phoneHref + '">Call Surat office</a>';
        var mapQuery = encodeURIComponent(b.addr + ', ' + b.city);
        return '<article class="contact-branch reveal is-in">' +
          '<div class="contact-branch__heading"><span class="contact-branch__pin" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path><circle cx="12" cy="10" r="2.3"></circle></svg></span>' +
          '<h3>' + b.city + '</h3></div>' +
          '<p class="contact-branch__address">' + b.addr + '</p>' +
          '<div class="contact-branch__actions">' + (phone ? '<span>' + phone + '</span>' : '<span class="contact-branch__muted">Contact details on request</span>') +
          '<a href="https://www.google.com/maps/search/?api=1&amp;query=' + mapQuery + '" target="_blank" rel="noopener noreferrer">Directions <span aria-hidden="true">↗</span></a></div>' +
          '</article>';
      }).join('');
    }
    search.addEventListener('input', renderMatches);
    renderMatches();
  }

  /* ======================================================================
     PUBLICATIONS
     ====================================================================== */
  function renderBudgets() {
    var box = $('#pub-grid');
    if (!box) return;
    var ico = '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/></svg>';
    /* Every publication is served from this site. These used to open the old
       site, which meant the whole archive went with it whenever that host was
       down — and it was down repeatedly. The seventeen that exist as PDFs are
       in assets/pdf; the three oldest were only ever web pages and are pages
       here too. */
    box.innerHTML = D.budgets.map(function (b) {
      var pdf = /\.pdf$/i.test(b.file);
      return '<a id="' + b.slug + '" href="' + b.file + '"' +
             (pdf ? ' target="_blank" rel="noopener"' : '') + '>' +
             ico + '<span>' + b.label + '</span></a>';
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
     ACCORDIONS (delegated)
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

    /* --------------------------------------------------------------------
       Why the header is not stuck from a scroll position.

       It shrinks by 75px when it sticks — two rows collapse into one — and it
       is in normal flow, so everything below rises by that much. Deciding on a
       single scroll threshold therefore feeds back on itself: collapse, page
       rises, y falls back under the threshold, expand, page drops, y rises,
       collapse. Measured at thirteen class flips while nudging around y=70,
       which is the flicker.

       A marker pinned 70px down the DOCUMENT settles it. It sits above the
       header and is positioned against the initial containing block, so no
       change in the header's height can move it, and watching it with an
       IntersectionObserver cannot feed back into its own trigger.
       -------------------------------------------------------------------- */
    if (header) {
      if ('IntersectionObserver' in window) {
        var mark = function (mod) {
          var el = document.createElement('span');
          el.className = 'stick-mark stick-mark--' + mod;
          document.body.insertBefore(el, document.body.firstChild);
          return el;
        };
        /* Two separate marks, so sticking and unsticking happen at different
           depths and neither can trigger the other. */
        new IntersectionObserver(function (e) {
          if (!e[0].isIntersecting) header.classList.add('is-stuck');
        }).observe(mark('on'));

        new IntersectionObserver(function (e) {
          if (e[0].isIntersecting) header.classList.remove('is-stuck');
        }).observe(mark('off'));
      } else {
        /* Same two thresholds, for browsers without the observer. */
        window.addEventListener('scroll', function () {
          var y = window.scrollY || document.documentElement.scrollTop;
          if (y > 160) header.classList.add('is-stuck');
          else if (y < 50) header.classList.remove('is-stuck');
        }, { passive: true });
      }
    }

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
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
    renderSocial();
    renderSlider();
    renderStats();
    renderAbout();
    renderSeal();
    renderServiceTiles();
    renderServiceDetail();
    renderWhy();
    renderDesignations();
    renderBranches();
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
