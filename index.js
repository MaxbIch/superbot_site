(function(){'use strict';
var LEGACY='https://raw.githubusercontent.com/MaxbIch/superbot_site/ca9507b90cbc66ec4391b65f83372e41d3e3c212/index.js';
var s=document.createElement('script');
s.src=LEGACY;
s.onload=function(){
  document.addEventListener('click',function(e){
    var card=e.target.closest&&e.target.closest('.place-card');
    if(!card)return;
    var name=card.querySelector('.place-card__name');
    if(!name)return;
    var places={
      'Lanterns Vietnamese Restaurant':[12.2413,109.1948],
      'Lac Canh Restaurant':[12.2517,109.1952],
      'Bun Cha Ca Hon':[12.2508,109.1917],
      'Nha Trang Golf Club':[12.2142,109.1778],
      'Olympia Gym Nha Trang':[12.2455,109.191],
      'Sailing Club Nha Trang':[12.2314,109.1964],
      'Пляж Чан Фу':[12.2365,109.196],
      'Хон Чонг':[12.2648,109.2025],
      'Bai Dai Beach':[12.068,109.205],
      'Ба Хо':[12.367,109.191],
      'Hon Ba':[12.105,108.99],
      'Yang Bay':[12.27,108.95],
      'Po Nagar Cham Towers':[12.2659,109.195],
      'VinWonders Nha Trang':[12.216,109.241],
      'Long Son Pagoda':[12.255,109.183]
    };
    var p=places[name.textContent.trim()];
    var frame=document.getElementById('google-map-frame');
    if(!p||!frame)return;
    frame.src='https://www.google.com/maps/d/embed?mid=17oh3u9sXAAYX6wyM7eVKwQlqjim7NQ4&ll='+p[0]+','+p[1]+'&z=16';
  },true);
};
document.head.appendChild(s);
})();
