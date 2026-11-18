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

/* Versão K — Resistance series: swipe-friendly rail, navigation and accessible art detail. */
(function(){
  'use strict';
  var root=document.querySelector('[data-resistance-carousel]');
  if(!root)return;
  var track=root.querySelector('[data-resistance-track]');
  var slides=[].slice.call(root.querySelectorAll('.nv-resistance-slide'));
  var indicators=[].slice.call(root.querySelectorAll('[data-resistance-go]'));
  var previous=root.querySelector('[data-resistance-prev]');
  var next=root.querySelector('[data-resistance-next]');
  var dialog=document.querySelector('[data-resistance-lightbox]');
  var image=dialog && dialog.querySelector('[data-resistance-full]');
  var close=dialog && dialog.querySelector('[data-resistance-close]');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index=0;

  function update(){
    indicators.forEach(function(button,i){button.setAttribute('aria-current',String(i===index));});
    if(previous) previous.disabled=index===0;
    if(next) next.disabled=index===slides.length-1;
  }
  function go(i,animate){
    index=Math.max(0,Math.min(slides.length-1,i));
    var item=slides[index];
    var maxScroll=Math.max(0,track.scrollWidth-track.clientWidth);
    var left=Math.min(maxScroll,Math.max(0,item.offsetLeft-slides[0].offsetLeft));
    track.scrollTo({left:left,behavior:animate&&!reduce?'smooth':'instant'});
    update();
  }
  if(previous)previous.addEventListener('click',function(){go(index-1,true)});
  if(next)next.addEventListener('click',function(){go(index+1,true)});
  indicators.forEach(function(b,i){b.addEventListener('click',function(){go(i,true)})});
  track.addEventListener('keydown',function(event){
    if(event.key==='ArrowRight'){event.preventDefault();go(index+1,true)}
    if(event.key==='ArrowLeft'){event.preventDefault();go(index-1,true)}
  });
  var raf=0;
  function sync(){
    raf=0;
    var scroll=track.scrollLeft;
    var max=Math.max(0,track.scrollWidth-track.clientWidth);
    if(scroll>=max-5 && max>5){index=slides.length-1;update();return;}
    var closest=0,dist=Infinity;
    slides.forEach(function(slide,i){
      var delta=Math.abs((slide.offsetLeft-slides[0].offsetLeft)-scroll);
      if(delta<dist){dist=delta;closest=i;}
    });
    index=closest;update();
  }
  track.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(sync)},{passive:true});
  window.addEventListener('resize',function(){sync()},{passive:true});

  // Mouse drag. Touch devices use native horizontal swipe/scroll.
  var drag=null;
  var suppressClick=false;
  track.addEventListener('pointerdown',function(e){
    if(e.pointerType!=='mouse'||e.button!==0)return;
    drag={x:e.clientX,left:track.scrollLeft,moved:false};
  });
  track.addEventListener('pointermove',function(e){
    if(!drag)return;
    var dx=e.clientX-drag.x;
    if(Math.abs(dx)>7){drag.moved=true;track.style.cursor='grabbing';track.scrollLeft=drag.left-dx;}
  });
  ['pointerup','pointercancel','pointerleave'].forEach(function(type){
    track.addEventListener(type,function(){
      if(drag){suppressClick=drag.moved;drag=null;track.style.cursor='';}
    });
  });
  track.addEventListener('click',function(e){
    if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false;}
  },true);
  
  // Enlarged artwork opens on click; the single series CTA opens the dedicated project page.
  slides.forEach(function(button){
    button.addEventListener('click',function(){
      if(!dialog||!image||!dialog.showModal)return;
      image.src=button.getAttribute('data-resistance-image');
      image.alt=button.getAttribute('data-resistance-label')||'';
      dialog.showModal();
    });
  });
  if(close)close.addEventListener('click',function(){dialog.close()});
  if(dialog)dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close()});
  update();
})();
