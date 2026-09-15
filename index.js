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

        function loadRates() {
            result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Загрузка…</div>';
            return fetch(SHEET_URL, { cache: 'no-store' })
                .then(function (response) { if (!response.ok) throw new Error('HTTP ' + response.status); return response.text(); })
                .then(function (csv) {
                    var parsed = parseRates(csv);
                    if (!parsed.RUB && !parsed.USD && !parsed.EUR && !parsed.USDT) throw new Error('Rates not found');
                    rates = parsed;
                    form.dispatchEvent(new Event('ratesloaded'));
                })
                .catch(function () {
                    rates = {};
                    result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Нет данных</div>';
                    list.innerHTML = '';
                });
        }
        loadRates();
        setInterval(loadRates, 60000);
    }

    function buildTours() {
        var section = document.getElementById('tours');
        if (!section) return;

        var tours = [
            {
                title: 'Далат',
                location: 'Город вечной весны',
                image: 'https://www.quinta.ru/upload/iblock/471/8isg01uxefhaphmr6y7sr81l5w2vfs9a/new-dalat-lead.jpeg',
                intro: 'Далат — город вечной весны. За один день увидите водопады, кофейную плантацию, Crazy House, цветочную деревню, пагоду Линь Фуок и рынок.',
                schedule: 'Выезд в 07:00 · возвращение около 20:00',
                price: '1 000 000 ₫ взрослый · 500 000 ₫ ребёнок',
                included: ['Транспорт', 'Русскоязычный гид', 'Обед', 'Вода', 'Страховка', 'Входные билеты'],
                places: ['Водопады', 'Кофейная плантация', 'Crazy House', 'Цветочная деревня', 'Пагода Линь Фуок', 'Рынок']
            },
            {
                title: 'Ба Хо',
                location: 'Три уровня водопада',
                image: 'https://cms.enjourney.ru/upload/country/article/512x512/535_1.png',
                intro: 'Ба Хо — активный день среди джунглей: три уровня водопада, купание в природных бассейнах, прыжки со скал и пикник.',
                schedule: 'Выезд в 08:00 · возвращение около 16:00',
                price: '500 000 ₫ с человека',
                included: ['Трансфер', 'Гид', 'Обед', 'Вода', 'Страховка'],
                places: ['Первый уровень водопада', 'Второй уровень', 'Третий уровень', 'Купание', 'Прыжки со скал', 'Пикник']
            },
            {
                title: 'Винперл',
                location: 'VinWonders Nha Trang · Хон Тре',
                image: 'https://info.odeontours.com/images/excursion/vinwonders-nha-trang-departure-3.jpg',
                intro: 'День развлечений на острове Хон Тре: поездка по канатной дороге через залив, аквапарк и аттракционы VinWonders.',
                schedule: 'Полный день · время выезда и возвращения уточняется при бронировании',
                price: 'Стоимость уточняется в боте',
                included: ['Канатная дорога', 'Доступ к территории VinWonders', 'Аквапарк', 'Аттракционы'],
                places: ['Канатная дорога', 'Аквапарк', 'Аттракционы', 'Остров Хон Тре']
            }
        ];

        section.innerHTML = '<div class="container"><div class="section__header"><h2 class="section__title">Туры</h2><a href="' + BOT_URL + '" class="section__more" target="_blank" rel="noopener noreferrer">Подробнее <span aria-hidden="true">→</span></a></div><div class="tour-slider" id="tour-slider"><div class="tour-slider__track" id="tour-track"></div><button class="tour-slider__arrow tour-slider__arrow--prev" type="button" aria-label="Предыдущий тур">‹</button><button class="tour-slider__arrow tour-slider__arrow--next" type="button" aria-label="Следующий тур">›</button><div class="tour-slider__dots" id="tour-dots"></div></div></div>';

        var track = document.getElementById('tour-track');
        var dots = document.getElementById('tour-dots');
        var current = 0;

        tours.forEach(function (tour, index) {
            var card = document.createElement('article');
            card.className = 'tour-card' + (index === 0 ? ' is-active' : '');
            card.innerHTML = '<button class="tour-card__click" type="button" aria-label="Открыть тур ' + tour.title + '"><span class="tour-card__image"><img src="' + tour.image + '" alt="' + tour.title + ' — Нячанг" loading="lazy"><span class="tour-card__image-label">' + tour.location + '</span></span><span class="tour-card__body"><span class="tour-card__title">' + tour.title + '</span><span class="tour-card__intro">' + tour.intro + '</span><span class="tour-card__meta">' + tour.schedule + '</span><span class="tour-card__price">' + tour.price + '</span></span></button><div class="tour-card__details"><div class="tour-card__details-grid"><div><h3>Программа</h3><ul>' + tour.places.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div><div><h3>Входит в тур</h3><ul>' + tour.included.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div></div><a class="tour-card__bot" href="' + BOT_URL + '" target="_blank" rel="noopener noreferrer">Узнать подробнее <span>→</span></a></div>';
            track.appendChild(card);

            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'tour-dot' + (index === 0 ? ' is-active' : '');
            dot.setAttribute('aria-label', 'Тур ' + (index + 1));
            dot.addEventListener('click', function () { showTour(index); });
            dots.appendChild(dot);

            card.querySelector('.tour-card__click').addEventListener('click', function () {
                card.classList.toggle('is-open');
            });
        });

        function showTour(index) {
            current = (index + tours.length) % tours.length;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dots.querySelectorAll('.tour-dot').forEach(function (dot, i) { dot.classList.toggle('is-active', i === current); });
        }

        section.querySelector('.tour-slider__arrow--prev').addEventListener('click', function () { showTour(current - 1); });
        section.querySelector('.tour-slider__arrow--next').addEventListener('click', function () { showTour(current + 1); });

        var startX = 0, deltaX = 0;
        track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; deltaX = 0; }, { passive: true });
        track.addEventListener('touchmove', function (e) { deltaX = e.touches[0].clientX - startX; }, { passive: true });
        track.addEventListener('touchend', function () { if (Math.abs(deltaX) > 45) showTour(current + (deltaX < 0 ? 1 : -1)); });
    }

    var style = document.createElement('style');
    style.textContent = `
.bot-calculator__row{display:grid;grid-template-columns:minmax(150px,.7fr) minmax(180px,1fr);gap:14px;align-items:end}.bot-calculator__currency-wrap{position:relative}.bot-calculator__currency{width:100%;height:52px;border:1px solid #dfe5e1;border-radius:14px;background:#fff;padding:0 16px;display:flex;align-items:center;gap:9px;font:inherit;font-size:16px;cursor:pointer;color:#1f2a25}.bot-calculator__currency span{margin-left:auto;color:#7b8781}.bot-calculator__dropdown{position:absolute;z-index:20;top:58px;left:0;right:0;background:#fff;border:1px solid #dfe5e1;border-radius:14px;padding:6px;box-shadow:0 14px 35px rgba(25,40,32,.14);display:none}.bot-calculator__dropdown.is-open{display:block}.bot-currency{width:100%;border:0;background:transparent;border-radius:10px;padding:10px 12px;display:block;font:inherit;cursor:pointer;text-align:left}.bot-currency:hover{background:#f1f7f3}.bot-calculator__amount-wrap{display:flex;flex-direction:column;gap:6px}.bot-calculator__amount-wrap label{font-size:13px;color:#6d7772}.bot-calculator__amount-wrap input{height:52px;border:1px solid #dfe5e1;border-radius:14px;padding:0 16px;font:inherit;font-size:18px;outline:none}.bot-calculator__amount-wrap input:focus,.bot-calculator__currency:focus{border-color:#4caf7a;box-shadow:0 0 0 3px rgba(76,175,122,.12)}.bot-calculator__result{margin-top:16px;padding:18px 20px;border-radius:16px;background:#f1f7f3}.bot-calculator__result-label{font-size:13px;color:#6d7772;margin-bottom:4px}.bot-calculator__result-value{font-size:28px;font-weight:800;color:#2f8e5e}.bot-calculator__rates{margin-top:10px}.bot-rate-line{display:flex;justify-content:space-between;align-items:center;padding:11px 2px;border-bottom:1px solid #edf0ee;font-size:15px}.bot-rate-line strong{font-weight:700}
#tours .section__header{margin-bottom:28px}.tour-slider{position:relative;overflow:hidden;padding:0 52px 52px}.tour-slider__track{display:flex;transition:transform .45s ease;touch-action:pan-y}.tour-card{flex:0 0 100%;min-width:0}.tour-card__click{width:100%;padding:0;border:0;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 12px 35px rgba(28,45,36,.10);text-align:left;cursor:pointer;display:block}.tour-card__image{display:block;position:relative;height:360px;overflow:hidden}.tour-card__image img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .5s ease}.tour-card__click:hover .tour-card__image img{transform:scale(1.035)}.tour-card__image-label{position:absolute;left:20px;bottom:18px;padding:8px 12px;border-radius:999px;background:rgba(20,28,24,.78);color:#fff;font-size:13px;font-weight:600}.tour-card__body{display:block;padding:24px 26px 26px}.tour-card__title{display:block;font-size:30px;font-weight:800;color:#1e2a24;margin-bottom:9px}.tour-card__intro{display:block;font-size:16px;line-height:1.65;color:#66736c}.tour-card__meta{display:block;margin-top:16px;font-size:14px;color:#6e7b74}.tour-card__price{display:block;margin-top:9px;font-size:18px;font-weight:800;color:#2f8e5e}.tour-card__details{display:none;margin-top:12px;padding:24px 26px;background:#f5f8f6;border-radius:20px}.tour-card.is-open .tour-card__details{display:block;animation:tourDetails .25s ease}.tour-card__details-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.tour-card__details h3{font-size:15px;margin:0 0 10px;color:#25332b}.tour-card__details ul{list-style:none;margin:0;padding:0}.tour-card__details li{position:relative;padding:6px 0 6px 20px;color:#657169;font-size:14px;line-height:1.45}.tour-card__details li:before{content:'✓';position:absolute;left:0;color:#4caf7a;font-weight:800}.tour-card__bot{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:20px;min-height:50px;padding:0 20px;border-radius:14px;background:#4caf7a;color:#fff;text-decoration:none;font-weight:700;transition:transform .2s ease,background .2s ease}.tour-card__bot:hover{background:#3f9d6c;transform:translateY(-1px)}.tour-slider__arrow{position:absolute;top:180px;width:44px;height:44px;border:0;border-radius:50%;background:#fff;box-shadow:0 8px 22px rgba(28,45,36,.15);font-size:31px;line-height:1;color:#2f8e5e;cursor:pointer;z-index:3}.tour-slider__arrow--prev{left:4px}.tour-slider__arrow--next{right:4px}.tour-slider__dots{position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:center;gap:8px}.tour-dot{width:9px;height:9px;padding:0;border:0;border-radius:50%;background:#d5ddd8;cursor:pointer}.tour-dot.is-active{background:#4caf7a;transform:scale(1.25)}
@keyframes tourDetails{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}@media(max-width:700px){.bot-calculator__row{grid-template-columns:1fr;gap:10px}.bot-calculator__result-value{font-size:23px}.tour-slider{padding:0 0 48px}.tour-card__image{height:240px}.tour-card__body{padding:20px}.tour-card__title{font-size:26px}.tour-card__details{padding:20px}.tour-card__details-grid{grid-template-columns:1fr;gap:16px}.tour-slider__arrow{top:98px;width:38px;height:38px;font-size:27px}.tour-slider__arrow--prev{left:10px}.tour-slider__arrow--next{right:10px}}
    `;
    document.head.appendChild(style);

    buildCalculator();
    buildTours();

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
        food: [{name:'Lanterns Vietnamese Restaurant',desc:'Популярный ресторан вьетнамской кухни в центре города',lat:12.2413,lng:109.1948},{name:'Mix Restaurant',desc:'Ресторан с морепродуктами и авторским меню',lat:12.2395,lng:109.1942},{name:'Louisiane Brewhouse',desc:'Пивоварня и ресторан на набережной',lat:12.2248,lng:109.2475}],
        sport: [{name:'Nha Trang Golf Club',desc:'Гольф-клуб с видом на горы',lat:12.2142,lng:109.1778},{name:'Olympia Gym Nha Trang',desc:'Современный тренажёрный зал',lat:12.2455,lng:109.191}],
        beach: [{name:'Пляж Чан Фу',desc:'Главный городской пляж Нячанга',lat:12.2365,lng:109.196},{name:'Хон Чонг',desc:'Скалы и спокойная бухта на севере города',lat:12.2648,lng:109.2755},{name:'Док Лет',desc:'Белый песок и бирюзовая вода',lat:12.3485,lng:109.219}],
        mountains: [{name:'Ба Хо',desc:'Три водопада и природные бассейны',lat:12.367,lng:109.191},{name:'Hon Ba',desc:'Горный природный район недалеко от Нячанга',lat:12.105,lng:108.99}],
        attractions: [{name:'Po Nagar Cham Towers',desc:'Исторический храмовый комплекс',lat:12.2659,lng:109.195},{name:'VinWonders Nha Trang',desc:'Парк развлечений на острове Хон Тре',lat:12.216,lng:109.241}]
    };
    var map = L.map(mapEl).setView([12.2451,109.1943],12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(map);
    var markers = [], listEl = document.getElementById('places-list');
    function render(category){
        markers.forEach(function(m){map.removeLayer(m);}); markers=[]; if(listEl) listEl.innerHTML='';
        (PLACES[category]||[]).forEach(function(place){
            var marker=L.marker([place.lat,place.lng]).addTo(map).bindPopup('<strong>'+place.name+'</strong><br>'+place.desc); markers.push(marker);
            if(listEl){var item=document.createElement('button');item.type='button';item.className='place-item';item.innerHTML='<strong>'+place.name+'</strong><span>'+place.desc+'</span>';item.addEventListener('click',function(){map.setView([place.lat,place.lng],14);marker.openPopup();});listEl.appendChild(item);}
        });
    }
    document.querySelectorAll('.map-filter').forEach(function(btn){btn.addEventListener('click',function(){document.querySelectorAll('.map-filter').forEach(function(b){b.classList.remove('is-active');b.setAttribute('aria-selected','false');});btn.classList.add('is-active');btn.setAttribute('aria-selected','true');render(btn.dataset.category);});});
    render('food');
})();
