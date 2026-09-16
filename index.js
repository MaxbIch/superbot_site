(function(){'use strict';
var legacy=document.createElement('script');
legacy.src='https://cdn.jsdelivr.net/gh/MaxbIch/superbot_site@8dfa3f43426da0d7cc003388476b4b3ce63646e2/index.js';
legacy.onload=function(){
  var s=document.createElement('style');
  s.textContent=''+
  'body.menu-open{overflow:hidden}'+
  '.container{max-width:1120px}'+
  '.section{padding-top:42px;padding-bottom:42px}'+
  '.section__title{font-size:clamp(21px,3vw,28px)}'+
  '.section__header{margin-bottom:20px}'+
  '.product-card{border-radius:14px}'+
  '.product-card__image{aspect-ratio:16/10}'+
  '.product-card__body{padding:12px}'+
  '.product-card__title{font-size:15px;margin-bottom:4px}'+
  '.product-card__desc{font-size:11px;line-height:1.35;margin-bottom:7px}'+
  '.product-card__price{font-size:14px}'+
  '#bikes .cards-grid,#housing .cards-grid{gap:12px!important}'+
  '.tour-mini-grid{gap:12px!important}'+
  '.tour-mini-card{border-radius:14px}'+
  '.tour-mini-card__image{height:150px!important}'+
  '.tour-mini-card__body{padding:11px 12px 12px}'+
  '.tour-mini-card__body strong{font-size:18px}'+
  '.tour-mini-card__body span{font-size:10px;margin-top:2px}'+
  '.tour-mini-card__body small{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;height:28px;min-height:28px;margin-top:5px;font-size:10px;line-height:1.4}'+
  '.tour-mini-card__body em{font-size:11px;margin-top:6px}'+
  '.places-map-shell{gap:12px!important;padding:7px!important;border-radius:16px!important}'+
  '.places-map-main{border-radius:13px!important}'+
  '.google-map-frame{height:420px!important}'+
  '.places-panel{padding:5px!important}'+
  '.places-panel__head{padding:2px 5px 7px}'+
  '.places-panel__title{font-size:16px}'+
  '.places-list-modern{gap:6px;padding:1px 2px;max-height:370px}'+
  '.place-card{padding:8px;grid-template-columns:32px minmax(0,1fr) 12px;gap:7px;border-radius:10px}'+
  '.place-card__icon{width:32px;height:32px;border-radius:8px;font-size:15px}'+
  '.place-card__name{font-size:11px}'+
  '.place-card__desc{font-size:9px;margin-top:2px}'+
  '.map-legend{left:9px;top:9px;padding:6px 8px;font-size:9px}'+
  '.google-map-open{right:9px;bottom:9px;padding:7px 9px;font-size:9px}'+
  '@media(max-width:800px){'+
    '.container{padding-left:10px;padding-right:10px}'+
    '.section{padding-top:28px;padding-bottom:28px}'+
    '.section__title{font-size:20px}'+
    '.section__header{margin-bottom:13px}'+
    '.services-grid{gap:6px}'+
    '.service-card{padding:9px;border-radius:10px}'+
    '.service-card__icon{font-size:18px}'+
    '.service-card__title{font-size:11px}'+
    '.service-card__desc{font-size:9px;line-height:1.25}'+
    '.cards-grid{gap:10px!important}'+
    '#bikes .cards-grid,#housing .cards-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}'+
    '.product-card__image{aspect-ratio:16/9}'+
    '.product-card__body{padding:9px}'+
    '.product-card__title{font-size:12px}'+
    '.product-card__desc{font-size:9px;line-height:1.3;margin-bottom:5px}'+
    '.product-card__price{font-size:12px}'+
    '.tour-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}'+
    '.tour-mini-card__image{height:100px!important}'+
    '.tour-mini-card__body{padding:8px 9px 9px}'+
    '.tour-mini-card__body strong{font-size:15px}'+
    '.tour-mini-card__body span{font-size:8px}'+
    '.tour-mini-card__body small{font-size:9px;line-height:1.3;height:24px;min-height:24px;-webkit-line-clamp:2;margin-top:4px}'+
    '.tour-mini-card__body em{font-size:9px;margin-top:4px}'+
    '.places-map-shell{grid-template-columns:1fr;padding:5px!important;border-radius:14px!important}'+
    '.places-map-main{order:1}'+
    '.places-panel{order:2}'+
    '.google-map-frame{height:290px!important}'+
    '.places-list-modern{max-height:none;overflow:visible}'+
    '.place-card{padding:7px;grid-template-columns:30px minmax(0,1fr) 10px;gap:6px}'+
    '.place-card__icon{width:30px;height:30px;font-size:14px}'+
    '.place-card__name{font-size:10px}'+
    '.place-card__desc{font-size:8px}'+
    '.burger{position:relative;z-index:10001}'+
    '.nav{z-index:10000}'+
  '}'+
  '@media(max-width:480px){'+
    '.hero{padding:22px 0 28px}'+
    '.hero__title{font-size:30px;margin-bottom:10px}'+
    '.hero__subtitle{font-size:12px;line-height:1.45;margin-bottom:14px}'+
    '.tour-mini-card__image{height:88px!important}'+
    '.google-map-frame{height:270px!important}'+
  '}';
  document.head.appendChild(s);

  var burger=document.querySelector('.burger'),nav=document.querySelector('.nav');
  if(!burger||!nav)return;
  function closeMenu(){nav.classList.remove('is-open');burger.classList.remove('is-open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Открыть меню');document.body.classList.remove('menu-open')}
  function openMenu(){nav.classList.add('is-open');burger.classList.add('is-open');burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Закрыть меню');document.body.classList.add('menu-open')}
  burger.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();nav.classList.contains('is-open')?closeMenu():openMenu()});
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu)});
  document.addEventListener('click',function(e){if(nav.classList.contains('is-open')&&!nav.contains(e.target)&&!burger.contains(e.target))closeMenu()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
};
legacy.onerror=function(){console.error('SuperBot app script failed to load')};
document.head.appendChild(legacy);
})();