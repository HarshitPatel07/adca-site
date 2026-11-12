(function(){
  'use strict';
  var gear=document.querySelector('[data-scroll-gear]');
  if(!gear||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var frame=0;
  function update(){
    frame=0;
    var rect=gear.getBoundingClientRect();
    var viewport=window.innerHeight||document.documentElement.clientHeight;
    var progress=Math.max(0,Math.min(1,(viewport-rect.top)/(viewport+rect.height)));
    var angle=progress*540;
    gear.style.setProperty('--gear-main-angle',angle+'deg');
    gear.style.setProperty('--gear-small-angle',(-angle*1.5)+'deg');
  }
  function schedule(){if(!frame)frame=window.requestAnimationFrame(update);}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  update();
})();
