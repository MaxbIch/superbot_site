(function () {
    'use strict';

    var BOT_URL = 'https://t.me/nha_trang_superbot';
    var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1KWOuNVMAy3ol_zp7Kiv_dJq7rm_EHVYNm_Ns5hZZyzc/gviz/tq?tqx=out:csv';
    var CURRENCIES = {
        RUB: { flag: '🇷🇺', name: 'RUB' },
        USD: { flag: '🇺🇸', name: 'USD' },
        EUR: { flag: '🇪🇺', name: 'EUR' },
        USDT: { flag: '💵', name: 'USDT' },
        VND: { flag: '🇻🇳', name: 'VND' }
    };
    var rates = {};

    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href');
        if (href === 'https://t.me/' || href === 'https://t.me') {
            e.preventDefault();
            window.open(BOT_URL, '_blank', 'noopener,noreferrer');
        }
    });

    function number(value) { return Math.round(value).toLocaleString('ru-RU'); }
    function money(value, currency) { return number(value) + ' ' + (currency === 'VND' ? '₫' : currency); }

    function parseCsv(text) {
        var rows = [];
        var row = [], cell = '', quoted = false;
        for (var i = 0; i < text.length; i++) {
            var ch = text[i], next = text[i + 1];
            if (ch === '"' && quoted && next === '"') { cell += '"'; i++; continue; }
            if (ch === '"') { quoted = !quoted; continue; }
            if (ch === ',' && !quoted) { row.push(cell.trim()); cell = ''; continue; }
            if ((ch === '\n' || ch === '\r') && !quoted) {
                if (ch === '\r' && next === '\n') i++;
                row.push(cell.trim()); cell = '';
                if (row.some(function (v) { return v !== ''; })) rows.push(row);
                row = [];
                continue;
            }
            cell += ch;
        }
        if (cell || row.length) { row.push(cell.trim()); if (row.some(function (v) { return v !== ''; })) rows.push(row); }
        return rows;
    }

    function toNumber(value) {
        var cleaned = String(value || '').replace(/\s/g, '').replace(/₫|VND|RUB|USD|EUR|USDT/gi, '').replace(',', '.').replace(/[^0-9.\-]/g, '');
        var n = parseFloat(cleaned);
        return isFinite(n) && n > 0 ? n : null;
    }

    function parseRates(csv) {
        var rows = parseCsv(csv), result = {};
        rows.forEach(function (row) {
            var joined = row.join(' ').toUpperCase();
            Object.keys(CURRENCIES).forEach(function (code) {
                if (code === 'VND' || !new RegExp('(^|[^A-Z])' + code + '([^A-Z]|$)').test(joined)) return;
                var nums = row.map(toNumber).filter(function (n) { return n !== null; });
                if (!nums.length) return;
                result[code] = { standard: nums[0] };
                if (nums.length > 1) result[code].large = nums[1];
            });
        });
        return result;
    }

    function rateFor(code, amount) {
        var item = rates[code];
        if (!item) return null;
        return amount > 20000 && item.large ? item.large : item.standard;
    }

    function setLoading(form) {
        var result = document.getElementById('calc-result');
        if (result) result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Загрузка…</div>';
        var list = document.getElementById('calc-rates');
        if (list) list.innerHTML = '';
    }

    function loadRates(form) {
        setLoading(form);
        return fetch(SHEET_URL, { cache: 'no-store' })
            .then(function (response) {
                if (!response.ok) throw new Error('Google Sheets HTTP ' + response.status);
                return response.text();
            })
            .then(function (csv) {
                var parsed = parseRates(csv);
                if (!parsed.RUB && !parsed.USD && !parsed.EUR && !parsed.USDT) throw new Error('Rates not found');
                rates = parsed;
                form.dispatchEvent(new Event('ratesloaded'));
            })
            .catch(function () {
                rates = {};
                var result = document.getElementById('calc-result');
                if (result) result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Нет данных</div>';
                var list = document.getElementById('calc-rates');
                if (list) list.innerHTML = '';
            });
    }

    function buildCalculator() {
        var form = document.getElementById('exchange-form');
        if (!form) return;

        form.innerHTML = '<div class="bot-calculator__row"><div class="bot-calculator__currency-wrap"><button type="button" class="bot-calculator__currency" id="calc-currency-btn">🇷🇺 <strong>RUB</strong><span>⌄</span></button><div class="bot-calculator__dropdown" id="calc-currency-dropdown">' +
            Object.keys(CURRENCIES).map(function (code) { return '<button type="button" class="bot-currency" data-currency="' + code + '">' + CURRENCIES[code].flag + ' <strong>' + code + '</strong></button>'; }).join('') +
            '</div></div><div class="bot-calculator__amount-wrap"><label for="calc-amount">Сумма</label><input id="calc-amount" type="number" inputmode="decimal" min="0" step="any" value="10000" placeholder="Введите сумму"></div></div><div class="bot-calculator__result" id="calc-result"></div><div class="bot-calculator__rates" id="calc-rates"></div>';

        var currencyBtn = document.getElementById('calc-currency-btn');
        var dropdown = document.getElementById('calc-currency-dropdown');
        var amount = document.getElementById('calc-amount');
        var result = document.getElementById('calc-result');
        var list = document.getElementById('calc-rates');
        var selected = 'RUB';

        function calculate() {
            var value = parseFloat(amount.value) || 0;
            result.innerHTML = '';
            list.innerHTML = '';
            if (selected === 'VND') {
                result.innerHTML = '<div class="bot-calculator__result-label">Сумма</div><div class="bot-calculator__result-value">' + money(value, 'VND') + '</div>';
                Object.keys(CURRENCIES).filter(function (c) { return c !== 'VND'; }).forEach(function (code) {
                    var r = rateFor(code, value);
                    if (r) list.innerHTML += '<div class="bot-rate-line"><span>' + CURRENCIES[code].flag + ' ' + code + '</span><strong>' + number(value / r) + '</strong></div>';
                });
                if (!list.innerHTML) result.innerHTML = '<div class="bot-calculator__result-label">Курсы</div><div class="bot-calculator__result-value">Нет данных</div>';
                return;
            }
            var rate = rateFor(selected, value);
            if (!rate) {
                result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Нет данных</div>';
                return;
            }
            result.innerHTML = '<div class="bot-calculator__result-label">Результат в VND</div><div class="bot-calculator__result-value">' + money(value * rate, 'VND') + '</div>';
            list.innerHTML = '<div class="bot-rate-line"><span>' + CURRENCIES[selected].flag + ' 1 ' + selected + '</span><strong>' + money(rate, 'VND') + '</strong></div>';
        }

        form.addEventListener('ratesloaded', calculate);
        currencyBtn.addEventListener('click', function () { dropdown.classList.toggle('is-open'); });
        dropdown.querySelectorAll('[data-currency]').forEach(function (button) {
            button.addEventListener('click', function () {
                selected = button.dataset.currency;
                currencyBtn.innerHTML = CURRENCIES[selected].flag + ' <strong>' + selected + '</strong><span>⌄</span>';
                dropdown.classList.remove('is-open');
                calculate();
            });
        });
        amount.addEventListener('input', calculate);
        document.addEventListener('click', function (event) { if (!event.target.closest('.bot-calculator__currency-wrap')) dropdown.classList.remove('is-open'); });
        form.addEventListener('submit', function (event) { event.preventDefault(); calculate(); });
        loadRates(form);
        setInterval(function () { loadRates(form); }, 60000);
    }

    var style = document.createElement('style');
    style.textContent = '.bot-calculator__row{display:grid;grid-template-columns:minmax(150px,.7fr) minmax(180px,1fr);gap:14px;align-items:end}.bot-calculator__currency-wrap{position:relative}.bot-calculator__currency{width:100%;height:52px;border:1px solid #dfe5e1;border-radius:14px;background:#fff;padding:0 16px;display:flex;align-items:center;gap:9px;font:inherit;font-size:16px;cursor:pointer;color:#1f2a25}.bot-calculator__currency span{margin-left:auto;color:#7b8781}.bot-calculator__dropdown{position:absolute;z-index:20;top:58px;left:0;right:0;background:#fff;border:1px solid #dfe5e1;border-radius:14px;padding:6px;box-shadow:0 14px 35px rgba(25,40,32,.14);display:none}.bot-calculator__dropdown.is-open{display:block}.bot-currency{width:100%;border:0;background:transparent;border-radius:10px;padding:10px 12px;display:block;font:inherit;cursor:pointer;text-align:left}.bot-currency:hover{background:#f1f7f3}.bot-calculator__amount-wrap{display:flex;flex-direction:column;gap:6px}.bot-calculator__amount-wrap label{font-size:13px;color:#6d7772}.bot-calculator__amount-wrap input{height:52px;border:1px solid #dfe5e1;border-radius:14px;padding:0 16px;font:inherit;font-size:18px;outline:none}.bot-calculator__amount-wrap input:focus,.bot-calculator__currency:focus{border-color:#4caf7a;box-shadow:0 0 0 3px rgba(76,175,122,.12)}.bot-calculator__result{margin-top:16px;padding:18px 20px;border-radius:16px;background:#f1f7f3}.bot-calculator__result-label{font-size:13px;color:#6d7772;margin-bottom:4px}.bot-calculator__result-value{font-size:28px;font-weight:800;color:#2f8e5e}.bot-calculator__rates{margin-top:10px}.bot-rate-line{display:flex;justify-content:space-between;align-items:center;padding:11px 2px;border-bottom:1px solid #edf0ee;font-size:15px}.bot-rate-line strong{font-weight:700}@media(max-width:600px){.bot-calculator__row{grid-template-columns:1fr;gap:10px}.bot-calculator__result-value{font-size:23px}}';
    document.head.appendChild(style);
    buildCalculator();

    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav');
    var navLinks = document.querySelectorAll('.nav__link');
    function closeMenu() { if (!burger || !nav) return; burger.classList.remove('is-open'); nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    function openMenu() { if (!burger || !nav) return; burger.classList.add('is-open'); nav.classList.add('is-open'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
    if (burger && nav) { burger.addEventListener('click', function () { nav.classList.contains('is-open') ? closeMenu() : openMenu(); }); navLinks.forEach(function (link) { link.addEventListener('click', closeMenu); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); }); }

    var sections = document.querySelectorAll('section[id], #top');
    if ('IntersectionObserver' in window && navLinks.length) {
        var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { var id = entry.target.id || 'top'; navLinks.forEach(function (link) { link.classList.toggle('is-active', link.getAttribute('href') === '#' + id); }); } }); }, { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 });
        sections.forEach(function (section) { observer.observe(section); });
    }
})();

(function () {
    'use strict';
    var mapEl = document.getElementById('places-map');
    if (!mapEl || typeof L === 'undefined') return;
    var PLACES = {
        food: [{name:'Lanterns Vietnamese Restaurant',desc:'Популярный ресторан вьетнамской кухни в центре города',lat:12.2413,lng:109.1948},{name:'Mix Restaurant',desc:'Гастропаб с морепродуктами и панорамным видом на залив',lat:12.2395,lng:109.1942},{name:'Louisiane Brewhouse',desc:'Пивоварня и ресторан прямо на набережной',lat:12.2248,lng:109.2475},{name:"Pizza 4P's Nha Trang",desc:'Знаменитая пиццерия с сыроварней и авторским меню',lat:12.2401,lng:109.1935},{name:'Jungle House Coffee',desc:'Уютное кафе с десертами и завтраками',lat:12.2525,lng:109.1918}],
        sport: [{name:'Nha Trang Golf Club',desc:'18-луночное поле для гольфа с видом на горы',lat:12.2142,lng:109.1778},{name:'VinWonders Water Sports',desc:'Водные виды спорта',lat:12.2189,lng:109.2512},{name:'Aloha Diving Center',desc:'Дайвинг и снорклинг',lat:12.227,lng:109.245},{name:'Olympia Gym Nha Trang',desc:'Современный тренажёрный зал',lat:12.2455,lng:109.191},{name:'Sailing Club Nha Trang',desc:'Виндсёрфинг, каяки и водные развлечения',lat:12.2267,lng:109.2467}],
        beach: [{name:'Пляж Чан Фу (Tran Phu)',desc:'Главный городской пляж',lat:12.2365,lng:109.196},{name:'Хон Чонг (Hon Chong)',desc:'Живописные скалы и спокойная бухта',lat:12.2648,lng:109.2755},{name:'Док Лет (Doc Let)',desc:'Белоснежный песок и бирюзовая вода',lat:12.3485,lng:109.219},{name:'Бай Дай (Bai Dai)',desc:'Длинный дикий пляж',lat:12.556,lng:109.212},{name:'Пляж Нянг Тиен',desc:'Тихий пляж у залива',lat:12.189,lng:109.225}],
        mountains: [{name:'Водопады Ба Хо (Ba Ho)',desc:'Три каскада в джунглях',lat:12.431,lng:109.1185},{name:'Yang Bay Eco Park',desc:'Горная долина с водопадами',lat:12.089,lng:108.982},{name:'Заповедник Хон Ба',desc:'Горный лес',lat:12.052,lng:108.802},{name:'Остров Хон Там',desc:'Холмистый остров',lat:12.205,lng:109.248},{name:'Смотровая Long Son',desc:'Холм с пагодой и видом на город',lat:12.249,lng:109.178}],
        attractions: [{name:'Башни По Нагар (Po Nagar)',desc:'Древние чамские башни',lat:12.2653,lng:109.1954},{name:'Пагода Лонг Шон',desc:'Белый Будда и панорама Нячанга',lat:12.249,lng:109.178},{name:'Океанографический музей',desc:'Морская биология и аквариумы',lat:12.1895,lng:109.2255},{name:'Vinpearl Land',desc:'Парк развлечений на острове',lat:12.2189,lng:109.2512},{name:'Аквариум Tri Nguyen',desc:'Остров-аквариум',lat:12.188,lng:109.224}]
    };
    var filters=document.querySelectorAll('.map-filter'), list=document.getElementById('places-list'), map=L.map('places-map',{scrollWheelZoom:false}).setView([12.2388,109.1967],12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    var groups={}, markers={};
    function icon(c){return L.divIcon({className:'',html:'<div class="map-marker map-marker--'+c+'"></div>',iconSize:[32,32],iconAnchor:[16,32],popupAnchor:[0,-32]});}
    Object.keys(PLACES).forEach(function(c){groups[c]=L.layerGroup();markers[c]=[];PLACES[c].forEach(function(p,i){var m=L.marker([p.lat,p.lng],{icon:icon(c)}).bindPopup('<div class="map-popup__title">'+p.name+'</div><p class="map-popup__desc">'+p.desc+'</p>');m.placeIndex=i;m.placeCategory=c;groups[c].addLayer(m);markers[c].push(m);});});
    function highlight(i){list.querySelectorAll('.places-list__item').forEach(function(x,n){x.classList.toggle('is-active',n===i);});}
    function show(c){Object.keys(groups).forEach(function(k){k===c?map.addLayer(groups[k]):map.removeLayer(groups[k]);});var b=groups[c].getBounds();if(b.isValid())map.fitBounds(b.pad(.15));filters.forEach(function(x){var a=x.dataset.category===c;x.classList.toggle('is-active',a);x.setAttribute('aria-selected',a?'true':'false');});list.innerHTML='';PLACES[c].forEach(function(p,i){var x=document.createElement('button');x.type='button';x.className='places-list__item';x.innerHTML='<div class="places-list__name">'+p.name+'</div><div class="places-list__desc">'+p.desc+'</div>';x.addEventListener('click',function(){map.setView([p.lat,p.lng],15,{animate:true});markers[c][i].openPopup();highlight(i);});list.appendChild(x);});}
    filters.forEach(function(x){x.addEventListener('click',function(){show(x.dataset.category);});});
    map.on('popupopen',function(e){var m=e.popup._source;if(m)highlight(m.placeIndex);});
    show('food');
    window.addEventListener('resize',function(){map.invalidateSize();});
})();
