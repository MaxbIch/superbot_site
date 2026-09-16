(function(){'use strict';
/* Responsive navigation and compact mobile card layout. */
var ui=document.createElement('style');
ui.textContent=''+
'@media(min-width:769px){.burger{display:none!important}.nav{display:flex!important}}'+
'@media(max-width:768px){.burger,.nav{display:none!important}}'+
'.footer__about{display:none!important}'+
'@media(max-width:768px){'+
'.services-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;overflow:hidden!important}'+
'.service-card{aspect-ratio:1/1!important;min-height:0!important;padding:9px!important;border-radius:14px!important;gap:4px!important;justify-content:center!important;overflow:hidden!important;text-align:center!important}'+
'.service-card__icon{font-size:22px!important;line-height:1!important}'+
'.service-card__title{font-size:10px!important;line-height:1.15!important;text-align:center!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;max-width:100%!important}'+
'.service-card__desc{font-size:8px!important;line-height:1.2!important;text-align:center!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important;max-height:19px!important}'+
'.cards-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important;overflow:hidden!important}'+
'.product-card{border-radius:16px!important;overflow:hidden!important;min-width:0!important}'+
'.product-card__image{aspect-ratio:16/10!important}'+
'.product-card__body{padding:11px!important}'+
'.product-card__title{font-size:13px!important;line-height:1.25!important;margin-bottom:5px!important}'+
'.product-card__desc{font-size:11px!important;line-height:1.4!important;margin-bottom:9px!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;overflow:hidden!important;min-height:46px!important}'+
'.product-card__price{font-size:14px!important;line-height:1.25!important}'+
'}'+
'@media(max-width:380px){'+
'.services-grid{gap:6px!important}'+
'.service-card{padding:7px!important;border-radius:12px!important}'+
'.service-card__icon{font-size:20px!important}'+
'.service-card__title{font-size:9px!important}'+
'.service-card__desc{font-size:7px!important}'+
'.cards-grid{gap:10px!important}'+
'.product-card__body{padding:10px!important}'+
'.product-card__title{font-size:12px!important}'+
'.product-card__desc{font-size:10px!important;-webkit-line-clamp:2!important;min-height:28px!important}'+
'.product-card__price{font-size:13px!important}'+
'}';
document.head.appendChild(ui);

var legacy=document.createElement('script');
legacy.src='https://cdn.jsdelivr.net/gh/MaxbIch/superbot_site@8dfa3f43426da0d7cc003388476b4b3ce63646e2/index.js';
legacy.onload=function(){
  document.querySelectorAll('.product-card img').forEach(function(img){
    img.addEventListener('error',function(){
      if(this.dataset.fallback)return;
      this.dataset.fallback='1';
      this.src='https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=400&fit=crop';
    });
  });
};
legacy.onerror=function(){console.error('SuperBot app script failed to load')};
document.head.appendChild(legacy);
})();