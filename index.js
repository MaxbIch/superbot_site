(function () {
    'use strict';

    var BOT_URL = 'https://t.me/nha_trang_superbot';
    var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1KWOuNVMAy3ol_zp7Kiv_dJq7rm_EHVYNm_Ns5hZZyzc/gviz/tq?tqx=out:csv';
    var CURRENCIES = {
        RUB: { flag: '🇷🇺' }, USD: { flag: '🇺🇸' }, EUR: { flag: '🇪🇺' }, USDT: { flag: '💵' }, VND: { flag: '🇻🇳' }
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
        var rows = [], row = [], cell = '', quoted = false;
        for (var i = 0; i < text.length; i++) {
            var ch = text[i], next = text[i + 1];
            if (ch === '"' && quoted && next === '"') { cell += '"'; i++; continue; }
            if (ch === '"') { quoted = !quoted; continue; }
            if (ch === ',' && !quoted) { row.push(cell.trim()); cell = ''; continue; }
            if ((ch === '\n' || ch === '\r') && !quoted) {
                if (ch === '\r' && next === '\n') i++;
                row.push(cell.trim()); cell = '';
                if (row.some(function (v) { return v !== ''; })) rows.push(row);
                row = []; continue;
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

    function buildCalculator() {
        var form = document.getElementById('exchange-form');
        if (!form) return;
        form.innerHTML = '<div class="bot-calculator__row"><div class="bot-calculator__currency-wrap"><button type="button" class="bot-calculator__currency" id="calc-currency-btn">🇷🇺 <strong>RUB</strong><span>⌄</span></button><div class="bot-calculator__dropdown" id="calc-currency-dropdown">' +
            Object.keys(CURRENCIES).map(function (code) { return '<button type="button" class="bot-currency" data-currency="' + code + '">' + CURRENCIES[code].flag + ' <strong>' + code + '</strong></button>'; }).join('') +
            '</div></div><div class="bot-calculator__amount-wrap"><label for="calc-amount">Сумма</label><input id="calc-amount" type="number" inputmode="decimal" min="0" step="any" value="10000" placeholder="Введите сумму"></div></div><div class="bot-calculator__result" id="calc-result"></div><div class="bot-calculator__rates" id="calc-rates"></div>';
        var currencyBtn = document.getElementById('calc-currency-btn'), dropdown = document.getElementById('calc-currency-dropdown'), amount = document.getElementById('calc-amount'), result = document.getElementById('calc-result'), list = document.getElementById('calc-rates'), selected = 'RUB';
        function calculate() {
            var value = parseFloat(amount.value) || 0;
            result.innerHTML = ''; list.innerHTML = '';
            if (selected === 'VND') {
                result.innerHTML = '<div class="bot-calculator__result-label">Сумма</div><div class="bot-calculator__result-value">' + money(value, 'VND') + '</div>';
                Object.keys(CURRENCIES).filter(function (c) { return c !== 'VND'; }).forEach(function (code) { var r = rateFor(code, value); if (r) list.innerHTML += '<div class="bot-rate-line"><span>' + CURRENCIES[code].flag + ' ' + code + '</span><strong>' + number(value / r) + '</strong></div>'; });
                if (!list.innerHTML) result.innerHTML = '<div class="bot-calculator__result-label">Курсы</div><div class="bot-calculator__result-value">Нет данных</div>';
                return;
            }
            var rate = rateFor(selected, value);
            if (!rate) { result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Нет данных</div>'; return; }
            result.innerHTML = '<div class="bot-calculator__result-label">Результат в VND</div><div class="bot-calculator__result-value">' + money(value * rate, 'VND') + '</div>';
            list.innerHTML = '<div class="bot-rate-line"><span>' + CURRENCIES[selected].flag + ' 1 ' + selected + '</span><strong>' + money(rate, 'VND') + '</strong></div>';
        }
        function loadRates() {
            result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Загрузка…</div>';
            fetch(SHEET_URL, { cache: 'no-store' }).then(function (response) { if (!response.ok) throw new Error(); return response.text(); }).then(function (csv) { var parsed = parseRates(csv); if (!parsed.RUB && !parsed.USD && !parsed.EUR && !parsed.USDT) throw new Error(); rates = parsed; calculate(); }).catch(function () { rates = {}; result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Нет данных</div>'; list.innerHTML = ''; });
        }
        currencyBtn.addEventListener('click', function () { dropdown.classList.toggle('is-open'); });
        dropdown.querySelectorAll('[data-currency]').forEach(function (button) { button.addEventListener('click', function () { selected = button.dataset.currency; currencyBtn.innerHTML = CURRENCIES[selected].flag + ' <strong>' + selected + '</strong><span>⌄</span>'; dropdown.classList.remove('is-open'); calculate(); }); });
        amount.addEventListener('input', calculate);
        document.addEventListener('click', function (event) { if (!event.target.closest('.bot-calculator__currency-wrap')) dropdown.classList.remove('is-open'); });
        form.addEventListener('submit', function (event) { event.preventDefault(); calculate(); });
        loadRates(); setInterval(loadRates, 60000);
    }

    function buildTours() {
        var section = document.getElementById('tours');
        if (!section) return;
        var tours = [
            { id:'dalat', title:'Далат', location:'Город вечной весны', image:'https://www.quinta.ru/upload/iblock/471/8isg01uxefhaphmr6y7sr81l5w2vfs9a/new-dalat-lead.jpeg', text:'Водопады, кофейные плантации, Crazy House, цветочные фермы и главные места Далата за один день.' },
            { id:'baho', title:'Ба Хо', location:'Три уровня водопада', image:'https://cms.enjourney.ru/upload/country/article/512x512/535_1.png', text:'Природа, джунгли, природные бассейны, купание и активный день на водопадах Ба Хо.' },
            { id:'vinpearl', title:'Винперл', location:'VinWonders · остров Хон Тре', image:'https://d2mgzmtdeipcjp.cloudfront.net/files/magazine/2025/03/11/17416793147938.png', text:'Канатная дорога над заливом, аквапарк, аттракционы и целый день развлечений в VinWonders.' }
        ];
        section.innerHTML = '<div class="container"><div class="section__header"><h2 class="section__title">Туры</h2><a href="' + BOT_URL + '" class="section__more" target="_blank" rel="noopener noreferrer">Все туры <span>→</span></a></div><div class="tour-mini-grid"></div></div>';
        var grid = section.querySelector('.tour-mini-grid');
        tours.forEach(function (tour) {
            var link = document.createElement('a');
            link.className = 'tour-mini-card'; link.href = 'tour.html?tour=' + tour.id;
            link.innerHTML = '<span class="tour-mini-card__image"><img src="' + tour.image + '" alt="' + tour.title + '" loading="lazy"></span><span class="tour-mini-card__body"><strong>' + tour.title + '</strong><span>' + tour.location + '</span><small>' + tour.text + '</small><em>Смотреть тур →</em></span>';
            grid.appendChild(link);
        });
    }

    function addStyles() {
        var style = document.createElement('style');
        style.textContent = '.bot-calculator__row{display:grid;grid-template-columns:minmax(150px,.7fr) minmax(180px,1fr);gap:14px;align-items:end}.bot-calculator__currency-wrap{position:relative}.bot-calculator__currency{width:100%;height:52px;border:1px solid #dfe5e1;border-radius:14px;background:#fff;padding:0 16px;display:flex;align-items:center;gap:9px;font:inherit;font-size:16px;cursor:pointer;color:#1f2a25}.bot-calculator__currency span{margin-left:auto;color:#7b8781}.bot-calculator__dropdown{position:absolute;z-index:20;top:58px;left:0;right:0;background:#fff;border:1px solid #dfe5e1;border-radius:14px;padding:6px;box-shadow:0 14px 35px rgba(25,40,32,.14);display:none}.bot-calculator__dropdown.is-open{display:block}.bot-currency{width:100%;border:0;background:transparent;border-radius:10px;padding:10px 12px;display:block;font:inherit;cursor:pointer;text-align:left}.bot-currency:hover{background:#f1f7f3}.bot-calculator__amount-wrap{display:flex;flex-direction:column;gap:6px}.bot-calculator__amount-wrap label{font-size:13px;color:#6d7772}.bot-calculator__amount-wrap input{height:52px;border:1px solid #dfe5e1;border-radius:14px;padding:0 16px;font:inherit;font-size:18px;outline:none}.bot-calculator__result{margin-top:16px;padding:18px 20px;border-radius:16px;background:#f1f7f3}.bot-calculator__result-label{font-size:13px;color:#6d7772;margin-bottom:4px}.bot-calculator__result-value{font-size:28px;font-weight:800;color:#2f8e5e}.bot-calculator__rates{margin-top:10px}.bot-rate-line{display:flex;justify-content:space-between;padding:11px 2px;border-bottom:1px solid #edf0ee}.tour-mini-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.tour-mini-card{display:block;overflow:hidden;border-radius:20px;background:#fff;box-shadow:0 10px 30px rgba(28,45,36,.09);text-decoration:none;color:inherit;transition:transform .25s ease,box-shadow .25s ease}.tour-mini-card:hover{transform:translateY(-5px);box-shadow:0 18px 40px rgba(28,45,36,.14)}.tour-mini-card__image{display:block;height:190px;overflow:hidden}.tour-mini-card__image img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease}.tour-mini-card:hover img{transform:scale(1.04)}.tour-mini-card__body{display:flex;flex-direction:column;padding:18px 20px 20px}.tour-mini-card__body strong{font-size:24px;font-weight:800}.tour-mini-card__body span{margin-top:4px;font-size:13px;color:#4caf7a;font-weight:700}.tour-mini-card__body small{margin-top:10px;min-height:58px;font-size:13px;line-height:1.55;color:#6d7772}.tour-mini-card__body em{margin-top:15px;font-size:14px;font-style:normal;font-weight:800;color:#2f8e5e}@media(max-width:800px){.tour-mini-grid{grid-template-columns:1fr}.tour-mini-card{display:grid;grid-template-columns:150px 1fr}.tour-mini-card__image{height:100%;min-height:150px}.tour-mini-card__body{padding:15px}.tour-mini-card__body small{min-height:0}.bot-calculator__row{grid-template-columns:1fr}}';
        document.head.appendChild(style);
    }

    addStyles(); buildCalculator(); buildTours();

    var burger = document.querySelector('.burger'), nav = document.querySelector('.nav'), navLinks = document.querySelectorAll('.nav__link');
    function closeMenu() { if (!burger || !nav) return; burger.classList.remove('is-open'); nav.classList.remove('is-open'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
    if (burger && nav) { burger.addEventListener('click', function () { nav.classList.contains('is-open') ? closeMenu() : (burger.classList.add('is-open'), nav.classList.add('is-open'), burger.setAttribute('aria-expanded','true'), document.body.style.overflow='hidden'); }); navLinks.forEach(function (link) { link.addEventListener('click', closeMenu); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); }); }
})();

(function () {
    'use strict';
    var mapEl = document.getElementById('places-map');
    if (!mapEl || typeof L === 'undefined') return;
    var PLACES = {
        food:[{name:'Lanterns Vietnamese Restaurant',desc:'Вьетнамская кухня в центре',lat:12.2413,lng:109.1948},{name:'Mix Restaurant',desc:'Морепродукты и авторское меню',lat:12.2395,lng:109.1942},{name:'Louisiane Brewhouse',desc:'Пивоварня на набережной',lat:12.2248,lng:109.2475}],
        sport:[{name:'Nha Trang Golf Club',desc:'Гольф-клуб с видом на горы',lat:12.2142,lng:109.1778},{name:'Olympia Gym Nha Trang',desc:'Тренажёрный зал',lat:12.2455,lng:109.191}],
        beach:[{name:'Пляж Чан Фу',desc:'Главный городской пляж',lat:12.2365,lng:109.196},{name:'Хон Чонг',desc:'Скалы и бухта',lat:12.2648,lng:109.2755},{name:'Док Лет',desc:'Белый песок и бирюзовая вода',lat:12.3485,lng:109.219}],
        mountains:[{name:'Ба Хо',desc:'Водопады и природные бассейны',lat:12.367,lng:109.191},{name:'Hon Ba',desc:'Горный природный район',lat:12.105,lng:108.99}],
        attractions:[{name:'Po Nagar Cham Towers',desc:'Исторический храмовый комплекс',lat:12.2659,lng:109.195},{name:'VinWonders Nha Trang',desc:'Парк развлечений на Хон Тре',lat:12.216,lng:109.241}]
    };
    var map = L.map(mapEl).setView([12.2451,109.1943],12); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(map);
    var markers=[], listEl=document.getElementById('places-list');
    function render(category){ markers.forEach(function(m){map.removeLayer(m);}); markers=[]; if(listEl) listEl.innerHTML=''; (PLACES[category]||[]).forEach(function(place){var marker=L.marker([place.lat,place.lng]).addTo(map).bindPopup('<strong>'+place.name+'</strong><br>'+place.desc);markers.push(marker);if(listEl){var item=document.createElement('button');item.type='button';item.className='place-item';item.innerHTML='<strong>'+place.name+'</strong><span>'+place.desc+'</span>';item.addEventListener('click',function(){map.setView([place.lat,place.lng],14);marker.openPopup();});listEl.appendChild(item);}}); }
    document.querySelectorAll('.map-filter').forEach(function(btn){btn.addEventListener('click',function(){document.querySelectorAll('.map-filter').forEach(function(b){b.classList.remove('is-active');b.setAttribute('aria-selected','false');});btn.classList.add('is-active');btn.setAttribute('aria-selected','true');render(btn.dataset.category);});});
    render('food');
})();
