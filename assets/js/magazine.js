/* Accessible cover opening and realistic, pointer-tracked page turns. */
(function () {
  'use strict';

  var modal = document.getElementById('magazine-modal');
  if (!modal) return;

  var dialog = modal.querySelector('.magazine-dialog');
  var coverState = modal.querySelector('.magazine-cover-state');
  var cover = modal.querySelector('.magazine-closed-book');
  var bookState = modal.querySelector('.magazine-book-state');
  var flipbookHost = modal.querySelector('#magazine-flipbook');
  var previousButton = modal.querySelector('[data-page-prev]');
  var nextButton = modal.querySelector('[data-page-next]');
  var pageRange = modal.querySelector('[data-page-range]');
  var pageProgress = modal.querySelector('[data-page-progress]');
  var issuePageCount = 18;
  var bookPageCount = issuePageCount - 1;
  var currentIndex = 0;
  var pageFlip = null;
  var isOpen = false;
  var returnFocus = null;
  var timers = [];

  function motionTime(milliseconds) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : milliseconds;
  }

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function isPortrait() {
    return pageFlip ? pageFlip.getOrientation() === 'portrait' : window.matchMedia('(max-width: 760px)').matches;
  }

  function updateSpread(index) {
    if (typeof index === 'number') currentIndex = index;
    var firstPage = Math.min(currentIndex + 2, issuePageCount);
    var lastPage = isPortrait() ? firstPage : Math.min(firstPage + 1, issuePageCount);
    pageRange.textContent = isPortrait()
      ? 'Page ' + firstPage + ' of ' + issuePageCount
      : 'Pages ' + firstPage + '\u2013' + lastPage + ' of ' + issuePageCount;
    pageProgress.style.width = (lastPage / issuePageCount * 100) + '%';
    previousButton.disabled = !isOpen || currentIndex <= 0;
    nextButton.disabled = !isOpen || currentIndex >= bookPageCount - 1;
  }

  function connectFlipbook() {
    if (pageFlip || !window.St || !window.St.PageFlip) return;

    pageFlip = new window.St.PageFlip(flipbookHost, {
      width: 550,
      height: 778,
      size: 'stretch',
      minWidth: 260,
      maxWidth: 1100,
      minHeight: 360,
      maxHeight: 780,
      autoSize: true,
      usePortrait: true,
      showCover: false,
      drawShadow: true,
      maxShadowOpacity: 0.38,
      flippingTime: 880,
      mobileScrollSupport: false,
      swipeDistance: 24,
      useMouseEvents: true,
      disableFlipByClick: false
    });

    pageFlip.on('init', function (event) {
      isOpen = true;
      updateSpread(event.data.page);
    });
    pageFlip.on('flip', function (event) {
      updateSpread(event.data);
    });
    pageFlip.on('changeOrientation', function () {
      window.requestAnimationFrame(function () { updateSpread(); });
    });

    var pages = [];
    for (var index = 2; index <= issuePageCount; index += 1) {
      pages.push('assets/newsletter/pages/page-' + String(index).padStart(2, '0') + '.webp');
    }
    pageFlip.loadFromImages(pages);
  }

  function openReader(trigger) {
    if (!modal.hidden) return;
    clearTimers();
    returnFocus = trigger || document.activeElement;
    isOpen = false;
    currentIndex = 0;
    if (pageFlip) pageFlip.turnToPage(0);
    coverState.hidden = false;
    coverState.classList.remove('is-opening');
    cover.classList.remove('is-opened');
    bookState.hidden = true;
    bookState.classList.remove('is-visible');
    updateSpread(0);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    dialog.focus({ preventScroll: true });
  }

  function openCover() {
    if (isOpen || coverState.classList.contains('is-opening')) return;
    coverState.classList.add('is-opening');
    cover.classList.add('is-opened');
    timers.push(window.setTimeout(function () {
      bookState.hidden = false;
      bookState.classList.add('is-visible');
      var alreadyLoaded = !!pageFlip;
      connectFlipbook();
      if (alreadyLoaded && pageFlip) {
        pageFlip.turnToPage(0);
        isOpen = true;
        updateSpread(0);
      }
    }, motionTime(380)));
    timers.push(window.setTimeout(function () {
      coverState.hidden = true;
      coverState.classList.remove('is-opening');
    }, motionTime(1050)));
  }

  function closeReader() {
    if (modal.hidden) return;
    clearTimers();
    modal.hidden = true;
    document.body.style.overflow = '';
    isOpen = false;
    currentIndex = 0;
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus({ preventScroll: true });
  }

  function turnPage(direction) {
    if (!isOpen || !pageFlip) return;
    if (direction === 'next') pageFlip.flipNext('bottom');
    else pageFlip.flipPrev('bottom');
  }

  document.querySelectorAll('[data-open-magazine]').forEach(function (button) {
    button.addEventListener('click', function () { openReader(button); });
  });
  modal.querySelectorAll('[data-close-magazine]').forEach(function (button) {
    button.addEventListener('click', closeReader);
  });
  modal.querySelector('[data-open-cover]').addEventListener('click', openCover);
  previousButton.addEventListener('click', function () { turnPage('prev'); });
  nextButton.addEventListener('click', function () { turnPage('next'); });

  document.addEventListener('keydown', function (event) {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeReader();
    } else if (isOpen && event.key === 'ArrowRight') {
      event.preventDefault();
      turnPage('next');
    } else if (isOpen && event.key === 'ArrowLeft') {
      event.preventDefault();
      turnPage('prev');
    } else if (event.key === 'Tab') {
      var focusables = Array.prototype.slice.call(dialog.querySelectorAll('a[href],button:not(:disabled)'));
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  updateSpread(0);
}());
