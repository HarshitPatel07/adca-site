/* Inline, mouse-driven page curl for The Bottom Line newsletter. */
(function () {
  'use strict';

  var host = document.getElementById('magazine-flipbook');
  if (!host || !window.St || !window.St.PageFlip) return;

  var bookScene = document.getElementById('magazine-book-scene');
  var previousButton = document.querySelector('[data-page-prev]');
  var nextButton = document.querySelector('[data-page-next]');
  var pageRange = document.querySelector('[data-page-range]');
  var pageProgress = document.querySelector('[data-page-progress]');
  var pageCount = 18;
  var currentIndex = 0;
  var isReady = false;

  function isPortrait() {
    return pageFlip.getOrientation() === 'portrait';
  }

  function updateSpread(index) {
    if (typeof index === 'number') currentIndex = index;
    var isCover = currentIndex === 0 || currentIndex === pageCount - 1;
    var firstPage = Math.min(currentIndex + 1, pageCount);
    var lastPage = isPortrait() || isCover ? firstPage : Math.min(currentIndex + 2, pageCount);
    pageRange.textContent = isPortrait() || isCover
      ? 'Page ' + firstPage + ' of ' + pageCount
      : 'Pages ' + firstPage + '\u2013' + lastPage + ' of ' + pageCount;
    pageProgress.style.width = (lastPage / pageCount * 100) + '%';
    previousButton.disabled = !isReady || currentIndex <= 0;
    nextButton.disabled = !isReady || currentIndex >= pageCount - 1;
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
    showCover: true,
    drawShadow: true,
    maxShadowOpacity: 0.42,
    flippingTime: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 880,
    mobileScrollSupport: false,
    swipeDistance: 24,
    useMouseEvents: true,
    disableFlipByClick: false
  });

  pageFlip.on('init', function () {
    isReady = true;
    updateSpread(pageFlip.getCurrentPageIndex());
  });
  pageFlip.on('flip', function () {
    updateSpread(pageFlip.getCurrentPageIndex());
  });
  pageFlip.on('changeOrientation', function () {
    window.requestAnimationFrame(function () { updateSpread(pageFlip.getCurrentPageIndex()); });
  });

  var pages = [];
  for (var index = 1; index <= pageCount; index += 1) {
    pages.push('assets/newsletter/pages/page-' + String(index).padStart(2, '0') + '.webp');
  }
  pageFlip.loadFromImages(pages);

  function turnPage(direction) {
    if (!isReady) return;
    if (direction === 'next') pageFlip.flipNext('bottom');
    else pageFlip.flipPrev('bottom');
  }

  previousButton.addEventListener('click', function () { turnPage('prev'); });
  nextButton.addEventListener('click', function () { turnPage('next'); });
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
