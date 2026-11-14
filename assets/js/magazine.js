/* Inline, mouse-driven page curl for The Bottom Line newsletter. */
(function () {
  'use strict';

  var host = document.getElementById('magazine-flipbook');
  var stage = document.querySelector('.magazine-reader-stage--inline');
  var coverIntro = document.getElementById('magazine-cover-intro');
  var coverButton = document.querySelector('[data-open-magazine]');
  var bookScene = document.getElementById('magazine-book-scene');
  var pageCount = 18;
  var currentIndex = 0;
  var isReady = false;
  var isOpen = false;
  var isOpening = false;
  var isClosing = false;
  var pendingOpen = false;
  var isBackCover = false;
  var isBackCoverClosing = false;
  var backCover = document.getElementById('magazine-back-cover');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!host || !stage || !coverIntro || !coverButton || !bookScene || !backCover || !window.St || !window.St.PageFlip) return;

  function updateSpread(index) {
    if (typeof index === 'number') currentIndex = index;
    var firstPage = Math.min(currentIndex + 1, pageCount);
    host.setAttribute('aria-label', 'The Bottom Line, page ' + firstPage + ' of ' + pageCount);
  }

  function showBackCover() {
    if (isBackCover) return;
    isBackCover = true;
    backCover.hidden = false;
    backCover.setAttribute('aria-hidden', 'false');
    backCover.setAttribute('tabindex', '0');
    bookScene.setAttribute('aria-hidden', 'true');
    host.setAttribute('tabindex', '-1');
    stage.classList.add('is-back-cover');
  }

  function hideBackCover() {
    if (!isBackCover) return;
    isBackCover = false;
    isBackCoverClosing = false;
    stage.classList.remove('is-back-cover', 'is-back-cover-closing');
    backCover.hidden = true;
    backCover.setAttribute('aria-hidden', 'true');
    backCover.setAttribute('tabindex', '-1');
    if (isOpen) {
      bookScene.setAttribute('aria-hidden', 'false');
      host.setAttribute('tabindex', '0');
      host.focus({ preventScroll: true });
    }
  }

  var pageFlip = new window.St.PageFlip(host, {
    width: 550,
    height: 778,
    size: 'stretch',
    minWidth: 260,
    maxWidth: 1150,
    minHeight: 360,
    maxHeight: 815,
    autoSize: true,
    usePortrait: window.matchMedia('(max-width: 900px)').matches,
    showCover: true,
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
    pageFlip.turnToPage(1);
    updateSpread(pageFlip.getCurrentPageIndex());
    if (pendingOpen) openMagazine();
  });
  pageFlip.on('flip', function (event) {
    var index = event && typeof event.data === 'number'
      ? event.data
      : pageFlip.getCurrentPageIndex();
    updateSpread(index);
  });
  pageFlip.on('changeState', function (event) {
    if (!event || event.data !== 'read') return;
    if (currentIndex === pageCount - 1 && isOpen) showBackCover();
    else if (isBackCoverClosing && currentIndex < pageCount - 1) hideBackCover();
  });
  pageFlip.on('changeOrientation', function () {
    window.requestAnimationFrame(function () { updateSpread(pageFlip.getCurrentPageIndex()); });
  });

  var pages = [];
  for (var index = 1; index <= pageCount; index += 1) {
    pages.push('assets/newsletter/pages/page-' + String(index).padStart(2, '0') + '.webp');
  }
  pageFlip.loadFromImages(pages);

  function openMagazine() {
    if (isOpen || isOpening || isClosing) return;
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
      isOpen = true;
      isOpening = false;
      updateSpread(pageFlip.getCurrentPageIndex());
      host.focus({ preventScroll: true });
    }, reducedMotion ? 20 : 840);
  }

  function closeMagazine() {
    if (!isOpen || isClosing) return;
    isClosing = true;
    coverIntro.hidden = false;
    stage.classList.add('is-closing');
    window.setTimeout(function () {
      stage.classList.remove('is-open', 'is-closing');
      bookScene.setAttribute('aria-hidden', 'true');
      host.setAttribute('tabindex', '-1');
      isOpen = false;
      isClosing = false;
      coverButton.focus({ preventScroll: true });
    }, reducedMotion ? 20 : 840);
  }

  function closeBackCover() {
    if (!isOpen || !isBackCover || isBackCoverClosing) return;
    isBackCoverClosing = true;
    stage.classList.add('is-back-cover-closing');
    pageFlip.flipPrev('bottom');
  }

  function turnPage(direction) {
    if (!isReady || !isOpen || isClosing || isBackCoverClosing) return;
    if (direction === 'next') pageFlip.flipNext('bottom');
    else if (currentIndex <= 1) closeMagazine();
    else pageFlip.flipPrev('bottom');
  }

  function closeFromFirstPageCorner(event) {
    if (!isReady || !isOpen || isClosing || currentIndex > 1) return;
    var point = event.touches && event.touches.length ? event.touches[0] : event;
    var rect = bookScene.getBoundingClientRect();
    var x = point.clientX - rect.left;
    var y = point.clientY - rect.top;
    var nearOuterLeftCorner = x <= Math.min(86, rect.width * 0.16);
    var nearPageTopOrBottom = y <= 86 || y >= rect.height - 86;
    if (!nearOuterLeftCorner || !nearPageTopOrBottom) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    closeMagazine();
  }

  coverButton.addEventListener('click', openMagazine);
  backCover.addEventListener('click', closeBackCover);
  backCover.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeBackCover();
    }
  });
  bookScene.addEventListener('mousedown', closeFromFirstPageCorner, true);
  bookScene.addEventListener('touchstart', closeFromFirstPageCorner, { capture: true, passive: false });
  bookScene.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      turnPage('next');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      turnPage('prev');
    }
  });
}());
