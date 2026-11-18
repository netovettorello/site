/* Neto Vettorello — versão I
   Carrossel de abertura: controles reais, autoplay, pausa/retomada,
   progresso sincronizado, setas, teclado e gesto de arraste/swipe.
   Sem bibliotecas externas; não depende de GSAP nem de APIs pagas. */
(function(){
  'use strict';
  var d=document;
  var hero=d.querySelector('.nv-hero');
  var reduce=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(hero){
    var slides=Array.from(hero.querySelectorAll('.hero-media'));
    var segments=Array.from(hero.querySelectorAll('.nv-carousel-dot'));
    var toggle=hero.querySelector('[data-nv-autoplay]');
    var live=hero.querySelector('[data-nv-live]');
    var DURATION=6000;
    var index=0;
    var elapsed=0;
    var lastFrame=null;
    var isPlaying=!reduce && slides.length>1;
    var visibilityPaused=d.hidden;
    var rafId=0;

    function updateProgress(){
      var pct=Math.max(0,Math.min(1,elapsed/DURATION));
      segments.forEach(function(segment,i){
        var fill=segment.querySelector('.nv-carousel-fill');
        if(fill)fill.style.transform='scaleX('+(i===index?pct:0)+')';
      });
    }
    function updateToggle(){
      if(!toggle)return;
      var label=isPlaying?toggle.dataset.labelPause:toggle.dataset.labelPlay;
      if(label){ toggle.setAttribute('aria-label',label); toggle.setAttribute('title',label); }
      toggle.setAttribute('aria-pressed', String(isPlaying));
    }
    function render(userAction){
      slides.forEach(function(img,i){
        img.classList.toggle('on', i===index);
        img.setAttribute('aria-hidden', String(i!==index));
      });
      segments.forEach(function(dot,i){
        var selected=i===index;
        dot.classList.toggle('is-active',selected);
        dot.setAttribute('aria-current', String(selected));
      });
      if(userAction && live) live.textContent=slides[index].getAttribute('alt') || '';
      updateProgress();
      updateToggle();
    }
    function go(target,userAction){
      if(slides.length<2)return;
      index=((target % slides.length)+slides.length)%slides.length;
      elapsed=0;lastFrame=null;
      render(userAction);
    }
    function setPlaying(value){
      isPlaying=Boolean(value) && slides.length>1;
      lastFrame=null;
      updateToggle();
    }
    function tick(timestamp){
      if(!d.hidden && isPlaying){
        if(lastFrame!==null){
          elapsed+=Math.max(0,Math.min(120,timestamp-lastFrame));
          if(elapsed>=DURATION){
            go(index+1,false);
          }
        }
        lastFrame=timestamp;
        updateProgress();
      }else{lastFrame=null;}
      rafId=requestAnimationFrame(tick);
    }
    function step(delta){go(index+delta,true);}

    // Destinations: slide dots
    segments.forEach(function(dot,i){
      dot.addEventListener('click',function(){go(i,true);});
    });
    // Direction arrows, both side handles and capsule handles
    hero.querySelectorAll('[data-nv-slide-prev],[data-nv-slide-prev-bottom]').forEach(function(btn){
      btn.addEventListener('click',function(){step(-1);});
    });
    hero.querySelectorAll('[data-nv-slide-next],[data-nv-slide-next-bottom]').forEach(function(btn){
      btn.addEventListener('click',function(){step(1);});
    });
    if(toggle){
      toggle.dataset.labelPause=toggle.getAttribute('aria-label') || 'Pause slideshow';
      toggle.dataset.labelPlay=(d.documentElement.lang==='pt-BR'?'Reproduzir apresentação':'Play slideshow');
      toggle.addEventListener('click',function(){setPlaying(!isPlaying);});
    }

    // Swipe on touch screens, drag on desktop. Vertical scrolling stays native.
    var start=null;
    var lastSwipeTime=0;
    function begin(x,y){start={x:x,y:y};}
    function finish(x,y){
      if(!start)return;
      var dx=x-start.x,dy=y-start.y;start=null;
      if(Math.abs(dx)>62 && Math.abs(dx)>Math.abs(dy)*1.25){lastSwipeTime=Date.now();step(dx<0?1:-1);}
    }
    hero.addEventListener('pointerdown',function(e){
      if(e.target.closest('button,a'))return;
      if(e.pointerType==='mouse' && e.button!==0)return;
      begin(e.clientX,e.clientY);
    });
    hero.addEventListener('pointerup',function(e){
      if(start)finish(e.clientX,e.clientY);
    });
    hero.addEventListener('pointercancel',function(){start=null;});
    // Native touch fallback for browsers that cancel pointer gestures on pan.
    var touchOrigin=null;
    hero.addEventListener('touchstart',function(e){
      if(e.target.closest('button,a'))return;
      if(e.touches.length===1) touchOrigin={x:e.touches[0].clientX,y:e.touches[0].clientY};
    },{passive:true});
    hero.addEventListener('touchend',function(e){
      if(!touchOrigin || !e.changedTouches.length)return;
      var dx=e.changedTouches[0].clientX-touchOrigin.x;
      var dy=e.changedTouches[0].clientY-touchOrigin.y;
      touchOrigin=null;
      if(start){ start=null; }
      if(Math.abs(dx)>62 && Math.abs(dx)>Math.abs(dy)*1.25 && Date.now()-lastSwipeTime>450){
        lastSwipeTime=Date.now();step(dx<0?1:-1);
      }
    },{passive:true});
    hero.addEventListener('touchcancel',function(){touchOrigin=null;},{passive:true});

    d.addEventListener('keydown',function(e){
      if(e.altKey||e.metaKey||e.ctrlKey||e.target.closest('button,input,textarea,select,[contenteditable="true"]'))return;
      var r=hero.getBoundingClientRect();
      if(r.bottom<innerHeight*.18 || r.top>innerHeight*.8)return;
      if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}
      else if(e.key==='ArrowRight'){e.preventDefault();step(1);}
    });
    d.addEventListener('visibilitychange',function(){lastFrame=null;visibilityPaused=d.hidden;});
    render(false);
    if(window.requestAnimationFrame)rafId=requestAnimationFrame(tick);
  }

  // Existing works rail: functional buttons and desktop drag.
  var rail=d.querySelector('[data-immersive-rail]');
  if(rail){
    function advance(direction){
      rail.scrollBy({left:direction*rail.clientWidth*.78,behavior:reduce?'auto':'smooth'});
    }
    var prev=d.querySelector('[data-nv-prev]');
    var next=d.querySelector('[data-nv-next]');
    if(prev)prev.addEventListener('click',function(){advance(-1);});
    if(next)next.addEventListener('click',function(){advance(1);});
    var down=false,x=0,base=0,dragged=false;
    rail.addEventListener('pointerdown',function(e){
      if(e.pointerType==='mouse'&&e.button===0){down=true;x=e.clientX;base=rail.scrollLeft;dragged=false;}
    });
    rail.addEventListener('pointermove',function(e){
      if(!down)return;
      var dx=e.clientX-x;
      if(Math.abs(dx)>7){dragged=true;rail.style.cursor='grabbing';}
      rail.scrollLeft=base-dx;
    });
    ['pointerup','pointercancel','pointerleave'].forEach(function(type){
      rail.addEventListener(type,function(){down=false;rail.style.cursor='';});
    });
    rail.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(e){if(dragged){e.preventDefault();dragged=false;}});
    });
  }
})();
