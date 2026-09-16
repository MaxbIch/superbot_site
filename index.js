(function(){'use strict';
/* Mobile and card layout overrides. */
var ui=document.createElement('style');
ui.textContent=''+
'.burger{display:none!important}'+
'@media(min-width:769px){.nav{display:flex!important}}'+
'@media(max-width:768px){.nav{display:none!important}}'+
'.tour-mini-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:22px!important}'+
'.tour-mini-card{display:flex!important;flex-direction:column!important;overflow:hidden!important;border:1px solid #e5ebe7!important;border-radius:16px!important;background:#fff!important;box-shadow:0 8px 24px rgba(28,45,36,.07)!important;transform:none!important}'+
'.tour-mini-card__image{height:150px!important;flex:none!important;overflow:hidden!important}'+
'.tour-mini-card__image img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}'+
'.tour-mini-card__body{display:flex!important;flex-direction:column!important;padding:14px 16px 16px!important;min-width:0!important;overflow:hidden!important}'+
'.tour-mini-card__body strong{font-size:17px!important;line-height:1.2!important;font-weight:800!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}'+
'.tour-mini-card__body span{margin-top:4px!important;font-size:11px!important;line-height:1.3!important;color:#4caf7a!important;font-weight:700!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}'+
'.tour-mini-card__body small{margin-top:8px!important;min-height:0!important;height:48px!important;font-size:11px!important;line-height:1.45!important;color:#6d7772!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;overflow:hidden!important}'+
'.tour-mini-card__body em{margin-top:10px!important;font-size:13px!important;line-height:1.2!important;font-style:normal!important;font-weight:800!important;color:#2f8e5e!important}'+
'@media(max-width:1050px){.tour-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}'+
'@media(max-width:768px){.tour-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}.tour-mini-card__image{height:115px!important}.tour-mini-card__body{padding:11px 12px 13px!important}.tour-mini-card__body strong{font-size:14px!important}.tour-mini-card__body span{font-size:10px!important}.tour-mini-card__body small{font-size:10px!important;height:42px!important;-webkit-line-clamp:3!important}.tour-mini-card__body em{font-size:12px!important;margin-top:8px!important}}'+
'@media(max-width:480px){.services-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;overflow:hidden!important}.service-card{aspect-ratio:1/1!important;min-height:0!important;padding:10px!important;border-radius:14px!important;gap:4px!important;justify-content:center!important;overflow:hidden!important}.service-card__icon{font-size:22px!important;line-height:1!important}.service-card__title{font-size:11px!important;line-height:1.2!important;text-align:center!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:100%!important}.service-card__desc{font-size:9px!important;line-height:1.25!important;text-align:center!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important}}';
document.head.appendChild(ui);
var legacy=document.createElement('script');
legacy.src='https://cdn.jsdelivr.net/gh/MaxbIch/superbot_site@8dfa3f43426da0d7cc003388476b4b3ce63646e2/index.js';
legacy.onerror=function(){console.error('SuperBot app script failed to load')};
document.head.appendChild(legacy);
})();