(function(){'use strict';
/* Desktop navigation; hide it only on mobile. Match mobile cards to the reference design. */
var ui=document.createElement('style');
ui.textContent=''+
'.burger{display:none!important}'+
'@media(max-width:768px){.nav{display:none!important}}'+
'@media(max-width:480px){'+
'.services-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;overflow:hidden!important}'+
'.service-card{aspect-ratio:1/1!important;min-height:0!important;padding:10px!important;border-radius:14px!important;gap:4px!important;justify-content:center!important;overflow:hidden!important}'+
'.service-card__icon{font-size:22px!important;line-height:1!important}'+
'.service-card__title{font-size:11px!important;line-height:1.2!important;text-align:center!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:100%!important}'+
'.service-card__desc{font-size:9px!important;line-height:1.25!important;text-align:center!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important}'+
'/* Housing + cars/bikes + tours */'+
'#housing .cards-grid,#bikes .cards-grid,.tour-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;overflow:hidden!important}'+
'#housing .card,#bikes .card,.tour-mini-card{min-width:0!important;overflow:hidden!important;border-radius:16px!important}'+
'#housing .card__image,#bikes .card__image{height:108px!important;overflow:hidden!important}'+
'#housing .card__image img,#bikes .card__image img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}'+
'#housing .card__body,#bikes .card__body{padding:9px 10px 11px!important;overflow:hidden!important}'+
'#housing .card__title,#bikes .card__title{font-size:15px!important;line-height:1.15!important;font-weight:800!important;margin:0!important;overflow:hidden!important}'+
'#housing .card__description,#bikes .card__description{font-size:10px!important;line-height:1.35!important;height:40px!important;max-height:40px!important;overflow:hidden!important;margin-top:6px!important}'+
'#housing .card__price,#bikes .card__price{font-size:13px!important;line-height:1.2!important;font-weight:800!important;margin-top:8px!important}'+
'.tour-mini-card{display:block!important;background:#fff!important;box-shadow:0 6px 18px rgba(28,45,36,.08)!important}'+
'.tour-mini-card__image{height:108px!important;overflow:hidden!important}'+
'.tour-mini-card__image img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}'+
'.tour-mini-card__body{display:flex!important;flex-direction:column!important;padding:9px 10px 11px!important;overflow:hidden!important}'+
'.tour-mini-card__body strong{font-size:15px!important;line-height:1.15!important;font-weight:800!important;overflow:hidden!important}'+
'.tour-mini-card__body span{margin-top:4px!important;font-size:10px!important;line-height:1.2!important;color:#4caf7a!important;font-weight:700!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}'+
'.tour-mini-card__body small{margin-top:6px!important;height:40px!important;min-height:40px!important;max-height:40px!important;font-size:10px!important;line-height:1.35!important;color:#6d7772!important;overflow:hidden!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important}'+
'.tour-mini-card__body em{margin-top:8px!important;font-size:13px!important;line-height:1.2!important;font-style:normal!important;font-weight:800!important;color:#2f8e5e!important;overflow:hidden!important}'+
'}';
document.head.appendChild(ui);

var legacy=document.createElement('script');
legacy.src='https://cdn.jsdelivr.net/gh/MaxbIch/superbot_site@8dfa3f43426da0d7cc003388476b4b3ce63646e2/index.js';
legacy.onerror=function(){console.error('SuperBot app script failed to load')};
document.head.appendChild(legacy);
})();