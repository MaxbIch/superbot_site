(function(){
  'use strict';
  var originalScript = document.createElement('script');
  originalScript.src = './app.js';
  originalScript.onload = function () {
    var style = document.createElement('style');
    style.textContent = '.exchange-toggle{width:100%;max-width:1160px;margin:0 auto 14px;min-height:48px;padding:0 18px;border:1px solid #e4ebe6;border-radius:14px;background:#fff;color:#2f8e5e;font:inherit;font-weight:800;cursor:pointer;box-shadow:0 8px 24px rgba(30,55,42,.06);text-align:left;display:flex;align-items:center;justify-content:space-between;gap:12px}.exchange-toggle span:last-child{font-size:18px}.exchange-calculator.is-collapsed{display:none!important}.exchange-toggle.is-open{background:#f3faf6}.exchange-toggle-wrap{width:100%}@media(max-width:800px){.exchange-toggle{max-width:none;border-radius:14px}}';
    document.head.appendChild(style);

    function setup() {
      var calculator = document.querySelector('.exchange-calculator');
      if (!calculator || calculator.dataset.toggleReady === '1') return !!calculator;
      calculator.dataset.toggleReady = '1';
      calculator.classList.add('is-collapsed');

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'exchange-toggle';
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = '<span>Калькулятор обмена</span><span>⌄</span>';

      var wrap = document.createElement('div');
      wrap.className = 'exchange-toggle-wrap';
      calculator.parentNode.insertBefore(wrap, calculator);
      wrap.appendChild(button);

      button.addEventListener('click', function () {
        var open = calculator.classList.toggle('is-collapsed') === false;
        button.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));
        button.querySelector('span:last-child').textContent = open ? '⌃' : '⌄';
      });
      return true;
    }

    if (!setup()) {
      var observer = new MutationObserver(function () {
        if (setup()) observer.disconnect();
      });
      observer.observe(document.body, {childList:true, subtree:true});
    }
  };
  originalScript.onerror = function () { console.error('SuperBot app script failed to load'); };
  document.head.appendChild(originalScript);
})();