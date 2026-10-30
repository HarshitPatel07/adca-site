/* Inline, mouse-driven page curl for The Bottom Line newsletter. */
(function () {
  'use strict';

  var host = document.getElementById('magazine-flipbook');
  var stage = document.querySelector('.magazine-reader-stage--inline');
  var coverIntro = document.getElementById('magazine-cover-intro');
  var coverButton = document.querySelector('[data-open-magazine]');
  var bookScene = document.getElementById('magazine-book-scene');
  var controls = document.querySelector('.magazine-inline-reader__controls');
  var pageRange = document.querySelector('[data-page-range]');
  var pageProgress = document.querySelector('[data-page-progress]');
  var pageCount = 18;
  var currentIndex = 0;
  var isReady = false;
  var isOpen = false;
  var isOpening = false;
  var pendingOpen = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!host || !stage || !coverIntro || !coverButton || !bookScene || !window.St || !window.St.PageFlip) return;

  function isPortrait() {
    return pageFlip.getOrientation() === 'portrait';
  }

  function updateSpread(index) {
    if (typeof index === 'number') currentIndex = index;
    var firstPage = Math.min(currentIndex + 2, pageCount);
    var lastPage = isPortrait() ? firstPage : Math.min(firstPage + 1, pageCount);
    pageRange.textContent = isPortrait() || firstPage === lastPage
      ? 'Page ' + firstPage + ' of ' + pageCount
      : 'Pages ' + firstPage + '\u2013' + lastPage + ' of ' + pageCount;
    pageProgress.style.width = (lastPage / pageCount * 100) + '%';
    host.setAttribute('aria-label', 'The Bottom Line, page ' + firstPage + ' of ' + pageCount);
  }

  var pageFlip = new window.St.PageFlip(host, {
    width: 550,
    height: 778,
    size: 'stretch',
    minWidth: 260,
    maxWidth: 1000,
    minHeight: 360,
    maxHeight: 708,
    autoSize: true,
    usePortrait: true,
    showCover: false,
    drawShadow: true,
    maxShadowOpacity: 0.32,
    flippingTime: reducedMotion ? 1 : 900,
    mobileScrollSupport: false,
    swipeDistance: 22,
    useMouseEvents: true,
    disableFlipByClick: false
  });

  pageFlip.on('init', function () {
    isReady = true;
    updateSpread(pageFlip.getCurrentPageIndex());
    if (pendingOpen) openMagazine();
  });
  pageFlip.on('flip', function () {
    updateSpread(pageFlip.getCurrentPageIndex());
  });
  pageFlip.on('changeOrientation', function () {
    window.requestAnimationFrame(function () { updateSpread(pageFlip.getCurrentPageIndex()); });
  });

  var pages = [];
  for (var index = 2; index <= pageCount; index += 1) {
    pages.push('assets/newsletter/pages/page-' + String(index).padStart(2, '0') + '.webp');
  }
  pageFlip.loadFromImages(pages);

  function openMagazine() {
    if (isOpen || isOpening) return;
    if (!isReady) {
      pendingOpen = true;
      return;
    }
    pendingOpen = false;
    isOpening = true;
    stage.classList.add('is-opening');
    window.setTimeout(function () {
      coverIntro.hidden = true;
      stage.classList.remove('is-opening');
      stage.classList.add('is-open');
      bookScene.setAttribute('aria-hidden', 'false');
      host.setAttribute('tabindex', '0');
      controls.hidden = false;
      isOpen = true;
      isOpening = false;
      updateSpread(pageFlip.getCurrentPageIndex());
      host.focus({ preventScroll: true });
    }, reducedMotion ? 20 : 840);
  }

  function turnPage(direction) {
    if (!isReady || !isOpen) return;
    if (direction === 'next') pageFlip.flipNext('bottom');
    else pageFlip.flipPrev('bottom');
  }

  coverButton.addEventListener('click', openMagazine);
  bookScene.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      turnPage('next');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      turnPage('prev');
    }
  });

  updateSpread(0);
}());
