/* VERSION H — home premium interactions */
(function(){
  'use strict';
  var d=document;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- hero slideshow ---------- */
  var hero=d.querySelector('.nv-hero');
  if(hero){
    var slides=[].slice.call(hero.querySelectorAll('.hero-media'));
    var dots=[].slice.call(hero.querySelectorAll('.nv-dot'));
    var currentLabel=hero.querySelector('[data-nv-current]');
    var fill=hero.querySelector('[data-nv-progress-fill]');
    var caption=hero.querySelector('[data-nv-caption]');
    var current=0, timer=null, dur=5600;

    function render(index){
      current=index;
      slides.forEach(function(img,i){ img.classList.toggle('on', i===index); });
      dots.forEach(function(dot,i){ dot.classList.toggle('is-active', i===index); dot.setAttribute('aria-current', String(i===index)); });
      if(currentLabel) currentLabel.textContent=String(index+1).padStart(2,'0');
      if(fill) fill.style.width=((index+1)/slides.length*100)+'%';
      if(caption) caption.textContent=slides[index] && slides[index].dataset.cap ? slides[index].dataset.cap : '';
    }
    function go(index, user){
      render((index+slides.length)%slides.length);
      if(!reduce){
        clearTimeout(timer);
        timer=setTimeout(function(){ go(current+1); }, dur);
      }
    }
    dots.forEach(function(dot){
      dot.addEventListener('click', function(){ go(+dot.getAttribute('data-index')||0, true); });
    });
    render(0);
    if(slides.length>1 && !reduce) timer=setTimeout(function(){ go(1); }, dur);
  }

  /* ---------- immersive rail ---------- */
  var rail=d.querySelector('[data-immersive-rail]');
  if(rail){
    function advance(direction){
      rail.scrollBy({left:direction*rail.clientWidth*.78, behavior:reduce?'auto':'smooth'});
    }
    var prev=d.querySelector('[data-nv-prev]'), forward=d.querySelector('[data-nv-next]');
    if(prev) prev.addEventListener('click', function(){ advance(-1); });
    if(forward) forward.addEventListener('click', function(){ advance(1); });

    var down=false,x=0,start=0,dragged=false;
    rail.addEventListener('pointerdown', function(e){
      if(e.pointerType==='mouse'){
        down=true; dragged=false; x=e.clientX; start=rail.scrollLeft; rail.style.cursor='grabbing';
      }
    });
    rail.addEventListener('pointermove', function(e){
      if(!down) return;
      var delta=e.clientX-x;
      if(Math.abs(delta)>6) dragged=true;
      rail.scrollLeft=start-delta;
    });
    ['pointerup','pointercancel','pointerleave'].forEach(function(k){
      rail.addEventListener(k, function(){ down=false; rail.style.cursor=''; });
    });
    rail.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(e){ if(dragged) e.preventDefault(); });
    });
  }
})();
