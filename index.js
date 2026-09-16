(function(){'use strict';
var legacy=document.createElement('script');
legacy.src='https://cdn.jsdelivr.net/gh/MaxbIch/superbot_site@42c539943ea028b0a2716e71b133ee7b00f4bc80/index.js';
legacy.onload=function(){
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
document.head.appendChild(legacy);
})();