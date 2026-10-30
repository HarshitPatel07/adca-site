/* Inline, mouse-driven page curl for The Bottom Line newsletter. */
(function () {
  'use strict';

  var host = document.getElementById('magazine-flipbook');
  var stage = document.querySelector('.magazine-reader-stage--inline');
  var coverIntro = document.getElementById('magazine-cover-intro');
  var coverButton = document.querySelector('[data-open-magazine]');
  var bookScene = document.getElementById('magazine-book-scene');
  var backCover = document.getElementById('magazine-back-cover');
  var controls = document.querySelector('.magazine-inline-reader__controls');
  var pageRange = document.querySelector('[data-page-range]');
  var pageProgress = document.querySelector('[data-page-progress]');
  var pageCount = 18;
  var currentIndex = 0;
  var isReady = false;
  var isOpen = false;
  var isOpening = false;
  var isClosing = false;
  var isBackCover = false;
  var isBackCoverClosing = false;
  var pendingOpen = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!host || !stage || !coverIntro || !coverButton || !bookScene || !backCover || !window.St || !window.St.PageFlip) return;

  function isPortrait() {
    return pageFlip.getOrientation() === 'portrait';
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
    backCover.focus({ preventScroll: true });
  }

  function hideBackCover() {
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

  function updateSpread(index) {
    if (typeof index === 'number') currentIndex = index;
    var isEndCover = currentIndex === pageCount - 1;
    var isFrontCover = currentIndex === 0;
    var firstPage = Math.min(currentIndex + 1, pageCount);
    var lastPage = isPortrait() || isFrontCover || isEndCover
      ? firstPage
      : Math.min(firstPage + 1, pageCount);
    pageRange.textContent = isPortrait() || firstPage === lastPage
      ? 'Page ' + firstPage + ' of ' + pageCount
      : 'Pages ' + firstPage + '\u2013' + lastPage + ' of ' + pageCount;
    pageProgress.style.width = (lastPage / pageCount * 100) + '%';
    host.setAttribute('aria-label', 'The Bottom Line, page ' + firstPage + ' of ' + pageCount);
    if (isOpen && isEndCover) showBackCover();
    else if (isBackCover && !isBackCoverClosing) hideBackCover();
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
  pageFlip.on('flip', function () {
    var index = pageFlip.getCurrentPageIndex();
    if (isBackCoverClosing && index < pageCount - 1) hideBackCover();
    updateSpread(index);
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
      controls.hidden = false;
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
      controls.hidden = true;
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
    if (!isReady || !isOpen || isClosing || isBackCoverClosing || currentIndex > 1) return;
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

  function closeFromBackCoverCorner(event) {
    if (!isOpen || !isBackCover || isBackCoverClosing) return;
    var point = event.touches && event.touches.length ? event.touches[0] : event;
    var coverImage = backCover.querySelector('img');
    var rect = coverImage.getBoundingClientRect();
    var x = point.clientX - rect.left;
    var y = point.clientY - rect.top;
    var nearOuterCorner = x <= 80 || x >= rect.width - 80;
    var nearPageTopOrBottom = y <= 86 || y >= rect.height - 86;
    if (!nearOuterCorner || !nearPageTopOrBottom) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    closeBackCover();
  }

  coverButton.addEventListener('click', openMagazine);
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
  backCover.addEventListener('click', closeBackCover);
  backCover.addEventListener('mousedown', closeFromBackCoverCorner, true);
  backCover.addEventListener('touchstart', closeFromBackCoverCorner, { capture: true, passive: false });
  backCover.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeBackCover();
    }
  });

  pageRange.textContent = 'Page 1 of ' + pageCount;
}());
