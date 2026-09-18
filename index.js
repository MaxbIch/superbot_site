(function(){
  'use strict';
  var originalScript = document.createElement('script');
  originalScript.src = './app.js';
  originalScript.onload = function () {
    var style = document.createElement('style');
    style.textContent = '.bot-calculator__dropdown{display:none!important}.bot-calculator__dropdown.is-open{display:block!important}';
    document.head.appendChild(style);
  };
  originalScript.onerror = function () { console.error('SuperBot app script failed to load'); };
  document.head.appendChild(originalScript);

  function removeHashFromUrl() {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }
  window.addEventListener('hashchange', removeHashFromUrl);
  removeHashFromUrl();
})();