(function(){'use strict';
var legacy=document.createElement('script');
legacy.src='https://cdn.jsdelivr.net/gh/MaxbIch/superbot_site@8dfa3f43426da0d7cc003388476b4b3ce63646e2/index.js';
legacy.onload=function(){
  var s=document.createElement('style');
  s.textContent=''+
  '/* Compact layout */'+
  '.container{max-width:1140px;padding-left:16px;padding-right:16px}'+
  '.section{padding-top:44px;padding-bottom:44px}'+
  '.section__header{margin-bottom:22px}'+
  '.section__title{font-size:clamp(22px,3vw,28px)}'+
  '.product-card{border-radius:15px}'+
  '.product-card__image{aspect-ratio:16/10}'+
  '.product-card__body{padding:14px}'+
  '.product-card__title{font-size:15px;margin-bottom:5px}'+
  '.product-card__desc{font-size:12px;line-height:1.4;margin-bottom:9px}'+
  '.product-card__price{font-size:15px}'+
  '.tour-mini-grid{gap:14px!important}'+
  '.tour-mini-card{border-radius:15px}'+
  '.tour-mini-card__image{height:145px!important}'+
  '.tour-mini-card__body{padding:12px 14px 14px}'+
  '.tour-mini-card__body strong{font-size:19px}'+
  '.tour-mini-card__body span{font-size:11px;margin-top:2px}'+
  '.tour-mini-card__body small{margin-top:6px;font-size:11px;line-height:1.35;min-height:0;height:30px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}'+
  '.tour-mini-card__body em{margin-top:7px;font-size:12px}'+
  '#bikes .cards-grid,#housing .cards-grid{gap:14px!important}'+
  '.places-map-shell{gap:12px!important;padding:7px!important;border-radius:18px!important}'+
  '.places-map-main{border-radius:14px!important}'+
  '.google-map-frame{height:460px!important}'+
  '.places-panel{padding:6px!important}'+
  '.places-panel__head{padding:3px 6px 9px}'+
  '.places-panel__title{font-size:17px}'+
  '.places-list-modern{gap:7px;padding:1px 3px;max-height:405px}'+
  '.place-card{padding:9px;grid-template-columns:34px minmax(0,1fr) 14px;gap:8px;border-radius:12px}'+
  '.place-card__icon{width:34px;height:34px;border-radius:9px;font-size:16px}'+
  '.place-card__name{font-size:12px}'+
  '.place-card__desc{font-size:10px;margin-top:2px}'+
  '.map-legend{left:10px;top:10px;padding:7px 10px;font-size:10px}'+
  '@media(max-width:800px){'+
    '.container{padding-left:12px;padding-right:12px}'+
    '.section{padding-top:32px;padding-bottom:32px}'+
    '.section__title{font-size:22px}'+
    '.section__header{margin-bottom:16px}'+
    '.services-grid{gap:8px}'+
    '.service-card{padding:11px;border-radius:12px}'+
    '.service-card__icon{font-size:20px}'+
    '.service-card__title{font-size:12px}'+
    '.service-card__desc{font-size:10px;line-height:1.3}'+
    '.product-card__image{aspect-ratio:16/9}'+
    '.product-card__body{padding:11px}'+
    '.product-card__title{font-size:14px}'+
    '.product-card__desc{font-size:11px;line-height:1.35;margin-bottom:7px}'+
    '.product-card__price{font-size:14px}'+
    '.tour-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}'+
    '.tour-mini-card__image{height:105px!important}'+
    '.tour-mini-card__body{padding:9px 10px 10px}'+
    '.tour-mini-card__body strong{font-size:16px}'+
    '.tour-mini-card__body span{font-size:9px}'+
    '.tour-mini-card__body small{font-size:10px;line-height:1.3;height:26px;-webkit-line-clamp:2}'+
    '.tour-mini-card__body em{font-size:10px;margin-top:5px}'+
    '#bikes .cards-grid,#housing .cards-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}'+
    '.places-map-shell{padding:5px!important;border-radius:15px!important}'+
    '.google-map-frame{height:300px!important}'+
    '.places-list-modern{max-height:none;gap:6px}'+
    '.place-card{padding:8px;grid-template-columns:32px minmax(0,1fr) 12px;gap:7px}'+
    '.place-card__icon{width:32px;height:32px;font-size:15px}'+
    '.place-card__name{font-size:11px}'+
    '.place-card__desc{font-size:9px}'+
  '}'+
  '@media(max-width:480px){'+
    '.hero{padding:24px 0 32px}'+
    '.hero__title{font-size:32px;margin-bottom:12px}'+
    '.hero__subtitle{font-size:13px;margin-bottom:18px}'+
    '.tour-mini-card__image{height:95px!important}'+
    '.google-map-frame{height:280px!important}'+
  '}';
  document.head.appendChild(s);

  var burger=document.querySelector('.burger');
  var nav=document.querySelector('.nav');
  if(!burger||!nav)return;
  function closeMenu(){burger.classList.remove('is-open');nav.classList.remove('is-open');burger.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}
  function toggleMenu(){var open=!nav.classList.contains('is-open');burger.classList.toggle('is-open',open);nav.classList.toggle('is-open',open);burger.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)}
  burger.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleMenu()});
  nav.querySelectorAll('a').forEach(function(link){link.addEventListener('click',closeMenu)});
  document.addEventListener('click',function(e){if(nav.classList.contains('is-open')&&!nav.contains(e.target)&&!burger.contains(e.target))closeMenu()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
};
legacy.onerror=function(){console.error('SuperBot app script failed to load')};
document.head.appendChild(legacy);
})();