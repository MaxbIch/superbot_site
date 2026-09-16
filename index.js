(function(){'use strict';
/* Keep the mobile menu hidden until the burger is pressed. */
var ui=document.createElement('style');
ui.textContent=''+
'@media(max-width:768px){'+
'.nav{visibility:hidden!important;pointer-events:none!important;transform:translateX(110%)!important;opacity:0!important}'+
'.nav.is-open{visibility:visible!important;pointer-events:auto!important;transform:translateX(0)!important;opacity:1!important}'+
'body.menu-open{overflow:hidden}'+
'}'+
'@media(max-width:480px){'+
'.services-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}'+
'.service-card{aspect-ratio:1/1!important;min-height:0!important;padding:8px!important;border-radius:12px!important;gap:3px!important;justify-content:center!important;overflow:hidden!important}'+
'.service-card__icon{font-size:21px!important;line-height:1!important}'+
'.service-card__title{font-size:10px!important;line-height:1.15!important;text-align:center!important}'+
'.service-card__desc{font-size:8px!important;line-height:1.2!important;text-align:center!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important}'+
'}';
document.head.appendChild(ui);

var legacy=document.createElement('script');
legacy.src='https://cdn.jsdelivr.net/gh/MaxbIch/superbot_site@8dfa3f43426da0d7cc003388476b4b3ce63646e2/index.js';
legacy.onload=function(){
  var burger=document.querySelector('.burger');
  var nav=document.querySelector('.nav');
  if(!burger||!nav)return;
  function closeMenu(){burger.classList.remove('is-open');nav.classList.remove('is-open');burger.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}
  function toggleMenu(){var open=!nav.classList.contains('is-open');burger.classList.toggle('is-open',open);nav.classList.toggle('is-open',open);burger.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)}
  closeMenu();
  burger.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleMenu()});
  nav.querySelectorAll('a').forEach(function(link){link.addEventListener('click',closeMenu)});
  document.addEventListener('click',function(e){if(nav.classList.contains('is-open')&&!nav.contains(e.target)&&!burger.contains(e.target))closeMenu()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
};
legacy.onerror=function(){console.error('SuperBot app script failed to load')};
document.head.appendChild(legacy);
})();