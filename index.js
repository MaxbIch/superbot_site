(function () {
    'use strict';

    var RATES = {
        RUB: 285,
        USD: 25400,
        EUR: 27500,
        CNY: 3500
    };

    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav');
    var navLinks = document.querySelectorAll('.nav__link');
    var form = document.getElementById('exchange-form');
    var currencySelect = document.getElementById('currency-from');
    var amountInput = document.getElementById('amount');
    var resultOutput = document.getElementById('result');

    function formatVND(value) {
        return Math.round(value).toLocaleString('ru-RU') + ' ₫';
    }

    function calculateExchange() {
        var currency = currencySelect.value;
        var amount = parseFloat(amountInput.value) || 0;
        var rate = RATES[currency] || 0;
        var result = amount * rate;
        resultOutput.textContent = formatVND(result);
    }

    function closeMenu() {
        burger.classList.remove('is-open');
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function openMenu() {
        burger.classList.add('is-open');
        nav.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    if (burger && nav) {
        burger.addEventListener('click', function () {
            if (nav.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateExchange();
        });

        currencySelect.addEventListener('change', calculateExchange);
        amountInput.addEventListener('input', calculateExchange);

        calculateExchange();
    }

    var sections = document.querySelectorAll('section[id], #top');
    var observerOptions = {
        root: null,
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
    };

    if ('IntersectionObserver' in window && navLinks.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.id || 'top';
                    navLinks.forEach(function (link) {
                        var href = link.getAttribute('href');
                        link.classList.toggle('is-active', href === '#' + id);
                    });
                }
            });
        }, observerOptions);

        var header = document.getElementById('top');
        if (header) {
            observer.observe(header);
        }

        document.querySelectorAll('section[id]').forEach(function (section) {
            observer.observe(section);
        });
    }
})();

(function () {
    'use strict';

    var mapEl = document.getElementById('places-map');
    if (!mapEl || typeof L === 'undefined') {
        return;
    }

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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var layerGroups = {};
    var markersByCategory = {};
    var activeCategory = 'food';

    function createIcon(category) {
        return L.divIcon({
            className: '',
            html: '<div class="map-marker map-marker--' + category + '"></div>',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    }

    Object.keys(PLACES).forEach(function (category) {
        var group = L.layerGroup();
        markersByCategory[category] = [];

        PLACES[category].forEach(function (place, index) {
            var marker = L.marker([place.lat, place.lng], { icon: createIcon(category) });
            marker.bindPopup(
                '<div class="map-popup__title">' + place.name + '</div>' +
                '<p class="map-popup__desc">' + place.desc + '</p>'
            );
            marker.placeIndex = index;
            marker.placeCategory = category;
            group.addLayer(marker);
            markersByCategory[category].push(marker);
        });

        layerGroups[category] = group;
    });

    function renderList(category) {
        var places = PLACES[category];
        listEl.innerHTML = '';

        places.forEach(function (place, index) {
            var item = document.createElement('button');
            item.type = 'button';
            item.className = 'places-list__item';
            item.innerHTML =
                '<div class="places-list__name">' + place.name + '</div>' +
                '<div class="places-list__desc">' + place.desc + '</div>';

            item.addEventListener('click', function () {
                var marker = markersByCategory[category][index];
                map.setView([place.lat, place.lng], 15, { animate: true });
                marker.openPopup();
                highlightListItem(index);
            });

            listEl.appendChild(item);
        });
    }

    function highlightListItem(index) {
        var items = listEl.querySelectorAll('.places-list__item');
        items.forEach(function (item, i) {
            item.classList.toggle('is-active', i === index);
        });
    }

    function showCategory(category) {
        activeCategory = category;

        Object.keys(layerGroups).forEach(function (key) {
            if (key === category) {
                map.addLayer(layerGroups[key]);
            } else {
                map.removeLayer(layerGroups[key]);
            }
        });

        var bounds = layerGroups[category].getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds.pad(0.15));
        }

        filters.forEach(function (btn) {
            var isActive = btn.dataset.category === category;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        renderList(category);
    }

    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            showCategory(btn.dataset.category);
        });
    });

    map.on('popupopen', function (e) {
        var marker = e.popup._source;
        if (marker && marker.placeCategory !== undefined) {
            highlightListItem(marker.placeIndex);
        }
    });

    showCategory('food');

    window.addEventListener('resize', function () {
        map.invalidateSize();
    });
})();
