/* ROR Bible+ site interactions */
(function(){
  var header=document.querySelector('.site-header');
  function onScroll(){ if(header){ header.classList.toggle('is-scrolled', window.scrollY>8); } }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Mobile drawer
  var drawer=document.getElementById('mobile-menu');
  document.querySelectorAll('[data-open-menu]').forEach(function(b){
    b.addEventListener('click', function(){ drawer.classList.add('is-open'); document.body.classList.add('no-scroll'); b.setAttribute('aria-expanded','true'); var c=drawer.querySelector('[data-close-menu]'); if(c){c.focus();} });
  });
  document.querySelectorAll('[data-close-menu]').forEach(function(b){
    b.addEventListener('click', function(){ drawer.classList.remove('is-open'); document.body.classList.remove('no-scroll'); document.querySelectorAll('[data-open-menu]').forEach(function(o){o.setAttribute('aria-expanded','false');}); });
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ if(drawer){drawer.classList.remove('is-open');} document.body.classList.remove('no-scroll'); closeMega(); } });

  // Products mega menu (desktop)
  var trigger=document.querySelector('[data-mega-trigger]'); var mega=document.getElementById('products-menu');
  function closeMega(){ if(mega){ mega.classList.remove('is-open'); } if(trigger){ trigger.setAttribute('aria-expanded','false'); } }
  if(trigger && mega){
    trigger.addEventListener('click', function(e){ e.preventDefault(); var open=!mega.classList.contains('is-open'); mega.classList.toggle('is-open', open); trigger.setAttribute('aria-expanded', open?'true':'false'); });
    document.addEventListener('click', function(e){ if(!mega.contains(e.target) && !trigger.contains(e.target)){ closeMega(); } });
  }

  // Pricing period toggle
  document.querySelectorAll('[data-period]').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('[data-period]').forEach(function(x){ var on=x===b; x.setAttribute('aria-pressed', on?'true':'false'); x.style.background=on?'#19688B':'transparent'; x.style.color=on?'#FFFFFF':'#19688B'; });
      document.querySelectorAll('[data-per]').forEach(function(p){ p.textContent = b.getAttribute('data-period')==='yearly' ? '/ year' : '/ month'; });
    });
  });

  // TV promo
  document.querySelectorAll('[data-play-promo]').forEach(function(b){
    b.addEventListener('click', function(){ var v=document.getElementById('promo-video'); if(v){ v.hidden=false; b.closest('.promo-poster').hidden=true; v.play(); } });
  });
})();
