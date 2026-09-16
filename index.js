(function(){'use strict';
/* Mobile category grid: two equal columns. */
var ui=document.createElement('style');
ui.textContent=''+
'.burger,.nav{display:none!important}'+
'@media(max-width:480px){'+
'.services-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:8px!important;overflow:hidden!important}'+
'.service-card{aspect-ratio:1/1!important;min-height:0!important;padding:10px!important;border-radius:14px!important;gap:4px!important;justify-content:center!important;overflow:hidden!important}'+
'.service-card__icon{font-size:22px!important;line-height:1!important}'+
'.service-card__title{font-size:11px!important;line-height:1.2!important;text-align:center!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:100%!important}'+
'.service-card__desc{font-size:9px!important;line-height:1.25!important;text-align:center!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important}'+
'}';
document.head.appendChild(ui);

var legacy=document.createElement('script');
legacy.src='https://cdn.jsdelivr.net/gh/MaxbIch/superbot_site@8dfa3f43426da0d7cc003388476b4b3ce63646e2/index.js';
legacy.onerror=function(){console.error('SuperBot app script failed to load')};
document.head.appendChild(legacy);
})();