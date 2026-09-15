(function () {
    'use strict';

    var BOT_URL = 'https://t.me/nha_trang_superbot';

    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href');
        if (href === 'https://t.me/' || href === 'https://t.me') {
            e.preventDefault();
            window.open(BOT_URL, '_blank', 'noopener,noreferrer');
        }
    });
})();

(function () {
    'use strict';

    var RATES = {
        RUB: 285,
        USD: 25400,
        EUR: 27500,
        USDT: 25400
    };

    var CURRENCIES = {
        RUB: { flag: '🇷🇺', name: 'RUB' },
        USD: { flag: '🇺🇸', name: 'USD' },
        EUR: { flag: '🇪🇺', name: 'EUR' },
        USDT: { flag: '💵', name: 'USDT' },
        VND: { flag: '🇻🇳', name: 'VND' }
    };

    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav');
    var navLinks = document.querySelectorAll('.nav__link');
    var form = document.getElementById('exchange-form');

    function formatNumber(value) {
        return Math.round(value).toLocaleString('ru-RU');
    }

    function formatMoney(value, currency) {
        return formatNumber(value) + ' ' + (currency === 'VND' ? '₫' : currency);
    }

    function currencyButton(code) {
        var item = CURRENCIES[code];
        return '<button type="button" class="bot-currency" data-currency="' + code + '">' +
            '<span>' + item.flag + '</span><strong>' + item.name + '</strong></button>';
    }

    function buildCalculator() {
        if (!form) return;

        form.innerHTML =
            '<div class="bot-calculator__row">' +
                '<div class="bot-calculator__currency-wrap">' +
                    '<button type="button" class="bot-calculator__currency" id="calc-currency-btn">🇷🇺 <strong>RUB</strong><span>⌄</span></button>' +
                    '<div class="bot-calculator__dropdown" id="calc-currency-dropdown">' +
                        currencyButton('RUB') + currencyButton('USD') + currencyButton('EUR') + currencyButton('USDT') + currencyButton('VND') +
                    '</div>' +
                '</div>' +
                '<div class="bot-calculator__amount-wrap">' +
                    '<label for="calc-amount">Сумма</label>' +
                    '<input id="calc-amount" type="number" inputmode="decimal" min="0" step="any" value="10000" placeholder="Введите сумму">' +
                '</div>' +
            '</div>' +
            '<div class="bot-calculator__result" id="calc-result"></div>' +
            '<div class="bot-calculator__rates" id="calc-rates"></div>' +
            '<p class="bot-calculator__note">Актуальный курс уточняйте в Telegram-боте.</p>';

        var currencyBtn = document.getElementById('calc-currency-btn');
        var dropdown = document.getElementById('calc-currency-dropdown');
        var amount = document.getElementById('calc-amount');
        var result = document.getElementById('calc-result');
        var rates = document.getElementById('calc-rates');
        var selected = 'RUB';

        function calculate() {
            var value = parseFloat(amount.value) || 0;
            result.innerHTML = '';
            rates.innerHTML = '';

            if (selected === 'VND') {
                result.innerHTML = '<div class="bot-calculator__result-label">Результат</div><div class="bot-calculator__result-value">' + formatMoney(value, 'VND') + '</div>';
                Object.keys(RATES).forEach(function (code) {
                    rates.innerHTML += '<div class="bot-rate-line"><span>' + CURRENCIES[code].flag + ' ' + code + '</span><strong>' + formatNumber(value / RATES[code]) + '</strong></div>';
                });
                return;
            }

            var convertedVnd = value * RATES[selected];
            result.innerHTML = '<div class="bot-calculator__result-label">Результат в VND</div><div class="bot-calculator__result-value">' + formatMoney(convertedVnd, 'VND') + '</div>';
            rates.innerHTML = '<div class="bot-rate-line"><span>' + CURRENCIES[selected].flag + ' 1 ' + selected + '</span><strong>' + formatMoney(RATES[selected], 'VND') + '</strong></div>';

            if (value > 20000) {
                rates.innerHTML += '<div class="bot-calculator__threshold">Для суммы свыше 20 000 ' + selected + ' действует индивидуальный курс.</div>';
            }
        }

        currencyBtn.addEventListener('click', function () {
            dropdown.classList.toggle('is-open');
        });

        dropdown.querySelectorAll('[data-currency]').forEach(function (button) {
            button.addEventListener('click', function () {
                selected = button.dataset.currency;
                var item = CURRENCIES[selected];
                currencyBtn.innerHTML = item.flag + ' <strong>' + item.name + '</strong><span>⌄</span>';
                dropdown.classList.remove('is-open');
                calculate();
            });
        });

        amount.addEventListener('input', calculate);
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.bot-calculator__currency-wrap')) dropdown.classList.remove('is-open');
        });

        calculate();
    }

    buildCalculator();

    var calculatorStyle = document.createElement('style');
    calculatorStyle.textContent = '.bot-calculator__row{display:grid;grid-template-columns:minmax(150px,.7fr) minmax(180px,1fr);gap:14px;align-items:end}.bot-calculator__currency-wrap{position:relative}.bot-calculator__currency{width:100%;height:52px;border:1px solid #dfe5e1;border-radius:14px;background:#fff;padding:0 16px;display:flex;align-items:center;gap:9px;font:inherit;font-size:16px;cursor:pointer;color:#1f2a25}.bot-calculator__currency span{margin-left:auto;color:#7b8781}.bot-calculator__dropdown{position:absolute;z-index:20;top:58px;left:0;right:0;background:#fff;border:1px solid #dfe5e1;border-radius:14px;padding:6px;box-shadow:0 14px 35px rgba(25,40,32,.14);display:none}.bot-calculator__dropdown.is-open{display:block}.bot-currency{width:100%;border:0;background:transparent;border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:9px;font:inherit;cursor:pointer;text-align:left}.bot-currency:hover{background:#f1f7f3}.bot-calculator__amount-wrap{display:flex;flex-direction:column;gap:6px}.bot-calculator__amount-wrap label{font-size:13px;color:#6d7772}.bot-calculator__amount-wrap input{height:52px;border:1px solid #dfe5e1;border-radius:14px;padding:0 16px;font:inherit;font-size:18px;outline:none}.bot-calculator__amount-wrap input:focus,.bot-calculator__currency:focus{border-color:#4caf7a;box-shadow:0 0 0 3px rgba(76,175,122,.12)}.bot-calculator__result{margin-top:16px;padding:18px 20px;border-radius:16px;background:#f1f7f3}.bot-calculator__result-label{font-size:13px;color:#6d7772;margin-bottom:4px}.bot-calculator__result-value{font-size:28px;font-weight:800;color:#2f8e5e}.bot-calculator__rates{margin-top:10px}.bot-rate-line{display:flex;justify-content:space-between;align-items:center;padding:11px 2px;border-bottom:1px solid #edf0ee;font-size:15px}.bot-rate-line strong{font-weight:700}.bot-calculator__threshold{margin-top:10px;font-size:12px;line-height:1.45;color:#8a6a2a;background:#fff8e8;padding:10px 12px;border-radius:10px}.bot-calculator__note{margin:12px 0 0;font-size:12px;color:#7a847f}@media(max-width:600px){.bot-calculator__row{grid-template-columns:1fr;gap:10px}.bot-calculator__result-value{font-size:23px}}';
    document.head.appendChild(calculatorStyle);

    function closeMenu() {
        if (!burger || !nav) return;
        burger.classList.remove('is-open');
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function openMenu() {
        if (!burger || !nav) return;
        burger.classList.add('is-open');
        nav.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    if (burger && nav) {
        burger.addEventListener('click', function () {
            if (nav.classList.contains('is-open')) closeMenu();
            else openMenu();
        });
        navLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    }

    var sections = document.querySelectorAll('section[id], #top');
    var observerOptions = { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 };

    if ('IntersectionObserver' in window && navLinks.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.id || 'top';
                    navLinks.forEach(function (link) {
                        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, observerOptions);
        var header = document.getElementById('top');
        if (header) observer.observe(header);
        sections.forEach(function (section) { if (section.id !== 'top') observer.observe(section); });
    }
})();

(function () {
    'use strict';
    var mapEl = document.getElementById('places-map');
    if (!mapEl || typeof L === 'undefined') return;

    var PLACES = {
        food: [
            { name: 'Lanterns Vietnamese Restaurant', desc: 'Популярный ресторан вьетнамской кухни в центре города', lat: 12.2413, lng: 109.1948 },
            { name: 'Mix Restaurant', desc: 'Гастропаб с морепродуктами и панорамным видом на залив', lat: 12.2395, lng: 109.1942 },
            { name: 'Louisiane Brewhouse', desc: 'Пивоварня и ресторан прямо на набережной', lat: 12.2248, lng: 109.2475 },
            { name: "Pizza 4P's Nha Trang", desc: 'Знаменитая пиццерия с сыроварней и авторским меню', lat: 12.2401, lng: 109.1935 },
            { name: 'Jungle House Coffee', desc: 'Уютное кафе с десертами и завтраками', lat: 12.2525, lng: 109.1918 }
        ],
        sport: [
            { name: 'Nha Trang Golf Club', desc: '18-луночное поле для гольфа с видом на горы', lat: 12.2142, lng: 109.1778 },
            { name: 'VinWonders Water Sports', desc: 'Водные виды спорта: банан, ватрушки, гидроциклы', lat: 12.2189, lng: 109.2512 },
            { name: 'Aloha Diving Center', desc: 'Дайвинг и снорклинг на коралловых рифах', lat: 12.2270, lng: 109.2450 },
            { name: 'Olympia Gym Nha Trang', desc: 'Современный тренажёрный зал в центре', lat: 12.2455, lng: 109.1910 },
            { name: 'Sailing Club Nha Trang', desc: 'Виндсёрфинг, каяки и водные развлечения', lat: 12.2267, lng: 109.2467 }
        ],
        beach: [
            { name: 'Пляж Чан Фу (Tran Phu)', desc: 'Главный городской пляж с набережной и кафе', lat: 12.2365, lng: 109.1960 },
            { name: 'Хон Чонг (Hon Chong)', desc: 'Живописные скалы и спокойная бухта', lat: 12.2648, lng: 109.2755 },
            { name: 'Док Лет (Doc Let)', desc: 'Белоснежный песок и бирюзовая вода в 60 км от города', lat: 12.3485, lng: 109.2190 },
            { name: 'Бай Дай (Bai Dai)', desc: 'Длинный дикий пляж с мягким песком', lat: 12.5560, lng: 109.2120 },
            { name: 'Пляж Нянг Тиен', desc: 'Тихий пляж у залива, идеален для отдыха с детьми', lat: 12.1890, lng: 109.2250 }
        ],
        mountains: [
            { name: 'Водопады Ба Хо (Ba Ho)', desc: 'Три каскада в джунглях, популярный треккинг', lat: 12.4310, lng: 109.1185 },
            { name: 'Yang Bay Eco Park', desc: 'Горная долина с водопадами и горячими источниками', lat: 12.0890, lng: 108.9820 },
            { name: 'Заповедник Хон Ба', desc: 'Горный лес, туман и редкие виды растений', lat: 12.0520, lng: 108.8020 },
            { name: 'Остров Хон Там', desc: 'Холмистый остров с панорамой залива Нячан', lat: 12.2050, lng: 109.2480 },
            { name: 'Смотровая Long Son', desc: 'Холм с пагодой и видом на весь город', lat: 12.2490, lng: 109.1780 }
        ],
        attractions: [
            { name: 'Башни По Нагар (Po Nagar)', desc: 'Древние чамские башни VII–XII веков', lat: 12.2653, lng: 109.1954 },
            { name: 'Пагода Лонг Шон', desc: 'Белый Будда 24 м и панорама Нячанга', lat: 12.2490, lng: 109.1780 },
            { name: 'Океанографический музей', desc: 'Морская биология и аквариумы', lat: 12.1895, lng: 109.2255 },
            { name: 'Vinpearl Land', desc: 'Парк развлечений на острове с канатной дорогой', lat: 12.2189, lng: 109.2512 },
            { name: 'Аквариум Tri Nguyen', desc: 'Остров-аквариум с экзотическими рыбами', lat: 12.1880, lng: 109.2240 }
        ]
    };

    var filters = document.querySelectorAll('.map-filter');
    var listEl = document.getElementById('places-list');
    var map = L.map('places-map', { scrollWheelZoom: false }).setView([12.2388, 109.1967], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

    var layerGroups = {};
    var markersByCategory = {};

    function createIcon(category) {
        return L.divIcon({ className: '', html: '<div class="map-marker map-marker--' + category + '"></div>', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
    }

    Object.keys(PLACES).forEach(function (category) {
        var group = L.layerGroup();
        markersByCategory[category] = [];
        PLACES[category].forEach(function (place, index) {
            var marker = L.marker([place.lat, place.lng], { icon: createIcon(category) });
            marker.bindPopup('<div class="map-popup__title">' + place.name + '</div><p class="map-popup__desc">' + place.desc + '</p>');
            marker.placeIndex = index;
            marker.placeCategory = category;
            group.addLayer(marker);
            markersByCategory[category].push(marker);
        });
        layerGroups[category] = group;
    });

    function highlightListItem(index) {
        listEl.querySelectorAll('.places-list__item').forEach(function (item, i) { item.classList.toggle('is-active', i === index); });
    }

    function renderList(category) {
        listEl.innerHTML = '';
        PLACES[category].forEach(function (place, index) {
            var item = document.createElement('button');
            item.type = 'button';
            item.className = 'places-list__item';
            item.innerHTML = '<div class="places-list__name">' + place.name + '</div><div class="places-list__desc">' + place.desc + '</div>';
            item.addEventListener('click', function () {
                map.setView([place.lat, place.lng], 15, { animate: true });
                markersByCategory[category][index].openPopup();
                highlightListItem(index);
            });
            listEl.appendChild(item);
        });
    }

    function showCategory(category) {
        Object.keys(layerGroups).forEach(function (key) {
            if (key === category) map.addLayer(layerGroups[key]);
            else map.removeLayer(layerGroups[key]);
        });
        var bounds = layerGroups[category].getBounds();
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.15));
        filters.forEach(function (btn) {
            var active = btn.dataset.category === category;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderList(category);
    }

    filters.forEach(function (btn) { btn.addEventListener('click', function () { showCategory(btn.dataset.category); }); });
    map.on('popupopen', function (e) {
        var marker = e.popup._source;
        if (marker && marker.placeCategory !== undefined) highlightListItem(marker.placeIndex);
    });
    showCategory('food');
    window.addEventListener('resize', function () { map.invalidateSize(); });
})();
