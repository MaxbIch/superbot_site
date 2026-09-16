(function () {
    'use strict';
    var BOT_URL = 'https://t.me/nha_trang_superbot';
    var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1KWOuNVMAy3ol_zp7Kiv_dJq7rm_EHVYNm_Ns5hZZyzc/gviz/tq?tqx=out:csv';
    var GOOGLE_MY_MAPS_EMBED = 'https://www.google.com/maps/d/embed?mid=17oh3u9sXAAYX6wyM7eVKwQlqjim7NQ4';
    var CURRENCIES = {RUB: {flag: '🇷🇺'}, USD: {flag: '🇺🇸'}, EUR: {flag: '🇪🇺'}, USDT: {flag: '💵'}, VND: {flag: '🇻🇳'}};
    var rates = {};

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');

            burger.classList.toggle('is-open', isOpen);
            burger.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                burger.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            });
        });
    }

    function number(v) {
        return Math.round(v).toLocaleString('ru-RU')
    }

    function money(v, c) {
        return number(v) + ' ' + (c === 'VND' ? '₫' : c)
    }

    function toNumber(v) {
        var n = parseFloat(String(v || '').replace(/\s/g, '').replace(/₫|VND|RUB|USD|EUR|USDT/gi, '').replace(',', '.').replace(/[^0-9.\-]/g, ''));
        return isFinite(n) && n > 0 ? n : null
    }

    function parseCsv(text) {
        var rows = [], row = [], cell = '', quoted = false;
        for (var i = 0; i < text.length; i++) {
            var ch = text[i], next = text[i + 1];
            if (ch === '"' && quoted && next === '"') {
                cell += '"';
                i++;
                continue
            }
            if (ch === '"') {
                quoted = !quoted;
                continue
            }
            if (ch === ',' && !quoted) {
                row.push(cell.trim());
                cell = '';
                continue
            }
            if ((ch === '\n' || ch === '\r') && !quoted) {
                if (ch === '\r' && next === '\n') i++;
                row.push(cell.trim());
                cell = '';
                if (row.some(function (v) {
                    return v !== ''
                })) rows.push(row);
                row = [];
                continue
            }
            cell += ch
        }
        if (cell || row.length) {
            row.push(cell.trim());
            if (row.some(function (v) {
                return v !== ''
            })) rows.push(row)
        }
        return rows
    }

    function parseRates(csv) {
        var result = {};
        parseCsv(csv).forEach(function (row) {
            var joined = row.join(' ').toUpperCase();
            Object.keys(CURRENCIES).forEach(function (code) {
                if (code === 'VND' || !new RegExp('(^|[^A-Z])' + code + '([^A-Z]|$)').test(joined)) return;
                var nums = row.map(toNumber).filter(function (n) {
                    return n !== null
                });
                if (nums.length) {
                    result[code] = {standard: nums[0]};
                    if (nums.length > 1) result[code].large = nums[1]
                }
            })
        });
        return result
    }

    function rateFor(code, amount) {
        var item = rates[code];
        return item ? (amount > 20000 && item.large ? item.large : item.standard) : null
    }

    function addStyles() {
        var s = document.createElement('style');
        s.textContent = '' +
            '.exchange-calculator{display:block;width:100%;max-width:1160px;margin:0 auto;padding:28px;border:1px solid #e4ebe6;border-radius:24px;background:#fff;box-shadow:0 16px 44px rgba(30,55,42,.08)}' +
            '.calc-head{margin-bottom:22px}.calc-head__title{font-size:clamp(20px,3vw,28px);font-weight:800;line-height:1.2;color:#24342b}.calc-head__text{margin-top:7px;font-size:13px;color:#748079;line-height:1.5}.bot-calculator__row{display:grid;grid-template-columns:minmax(170px,.72fr) minmax(220px,1fr);gap:14px;align-items:end}.bot-calculator__currency-wrap{position:relative}.bot-calculator__currency{width:100%;height:56px;border:1px solid #dfe6e1;border-radius:15px;background:#fff;padding:0 16px;display:flex;align-items:center;gap:9px;font:inherit;font-size:16px;cursor:pointer;color:#1f2a25}.bot-calculator__currency span{margin-left:auto;color:#7b8781}.bot-calculator__dropdown{position:absolute;z-index:2000;top:64px;left:0;right:0;background:#fff;border:1px solid #dfe6e1;border-radius:15px;padding:6px;box-shadow:0 16px 40px rgba(25,40,32,.16);}.bot-calculator__dropdown.is-open{display:block}.bot-currency{width:100%;border:0;background:transparent;border-radius:10px;padding:11px 12px;font:inherit;cursor:pointer;text-align:left}.bot-currency:hover{background:#f1f7f3}.bot-calculator__amount-wrap{display:flex;flex-direction:column;gap:7px}.bot-calculator__amount-wrap label{font-size:12px;font-weight:700;color:#6d7772;text-transform:uppercase;letter-spacing:.05em}.bot-calculator__amount-wrap input{width:100%;height:56px;border:1px solid #dfe6e1;border-radius:15px;padding:0 16px;font:inherit;font-size:19px;font-weight:600;outline:none;background:#fff}.bot-calculator__amount-wrap input:focus{border-color:#4caf7a;box-shadow:0 0 0 4px rgba(76,175,122,.1)}.bot-calculator__result{margin-top:18px;padding:22px;border-radius:18px;background:linear-gradient(135deg,#edf8f1,#f8fbf9);border:1px solid rgba(76,175,122,.16)}.bot-calculator__result-label{font-size:11px;font-weight:800;color:#6d7772;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}.bot-calculator__result-value{font-size:clamp(25px,4vw,34px);line-height:1.15;font-weight:800;color:#2f8e5e}.bot-calculator__rates{margin-top:10px;padding:0 4px}.bot-rate-line{display:flex;justify-content:space-between;gap:15px;padding:12px 2px;border-bottom:1px solid #edf0ee;font-size:14px}.bot-calculator__order{margin-top:18px;min-height:56px;padding:0 20px;border-radius:15px;background:#4caf7a;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;font-size:15px;font-weight:800;box-shadow:0 10px 24px rgba(76,175,122,.22);transition:.2s}.bot-calculator__order:hover{background:#3d9a68;transform:translateY(-1px)}' +
            '.tour-mini-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}.tour-mini-card{display:block;overflow:hidden;border-radius:20px;background:#fff;box-shadow:0 10px 30px rgba(28,45,36,.09);transition:.25s}.tour-mini-card:hover{transform:translateY(-5px)}.tour-mini-card__image{display:block;height:190px;overflow:hidden}.tour-mini-card__image img{width:100%;height:100%;object-fit:cover;display:block}.tour-mini-card__body{display:flex;flex-direction:column;padding:18px 20px 20px}.tour-mini-card__body strong{font-size:24px;font-weight:800}.tour-mini-card__body span{margin-top:4px;font-size:13px;color:#4caf7a;font-weight:700}.tour-mini-card__body small{margin-top:10px;font-size:13px;line-height:1.55;color:#6d7772}.tour-mini-card__body em{margin-top:15px;font-size:14px;font-style:normal;font-weight:800;color:#2f8e5e}' +
            '#bikes .cards-grid,#housing .cards-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}' +
            '.places-map-shell{width:100%;display:grid;grid-template-columns:minmax(290px,.85fr) minmax(0,1.45fr);gap:18px;padding:10px;background:#fff;border:1px solid #e7ece9;border-radius:26px;box-shadow:0 18px 50px rgba(24,47,35,.09)}.places-map-main{min-width:0;border-radius:20px;overflow:hidden;position:relative;order:2;background:#eef2ef}.google-map-frame{display:block;width:100%;height:560px;border:0}.places-panel{display:flex;flex-direction:column;min-width:0;padding:10px 8px;order:1}.places-panel__head{display:flex;align-items:flex-end;justify-content:space-between;padding:4px 8px 14px}.places-panel__eyebrow{font-size:11px;font-weight:800;color:#4caf7a;text-transform:uppercase;letter-spacing:.08em}.places-panel__title{margin-top:2px;font-size:20px;font-weight:800}.places-panel__count{min-width:32px;height:32px;padding:0 9px;border-radius:10px;background:#eef8f2;color:#2f8e5e;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800}.places-list-modern{display:flex;flex-direction:column;gap:10px;overflow:auto;padding:2px 5px;max-height:490px}.place-card{appearance:none;width:100%;border:1px solid #edf0ee;background:#fbfcfb;border-radius:16px;padding:14px;text-align:left;cursor:pointer;display:grid;grid-template-columns:42px minmax(0,1fr) 18px;gap:11px;align-items:center;transition:.2s}.place-card:hover,.place-card.is-active{border-color:rgba(76,175,122,.45);background:#f3faf6;box-shadow:0 8px 20px rgba(35,62,48,.07)}.place-card__icon{width:42px;height:42px;border-radius:12px;background:#eaf6ef;display:flex;align-items:center;justify-content:center;font-size:20px}.place-card__name{font-size:13px;font-weight:800;color:#24342b;line-height:1.3}.place-card__desc{display:block;margin-top:3px;font-size:11px;line-height:1.4;color:#7a847f}.place-card__arrow{color:#4caf7a;font-size:18px;font-weight:800}.map-legend{position:absolute;z-index:2;left:18px;top:18px;padding:9px 13px;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border-radius:12px;font-size:12px;font-weight:700;color:#3d4943;box-shadow:0 8px 20px rgba(0,0,0,.08)}.google-map-open{position:absolute;z-index:3;right:12px;bottom:12px;padding:9px 12px;border-radius:10px;background:#fff;color:#2f8e5e;font-size:11px;font-weight:800;box-shadow:0 8px 20px rgba(0,0,0,.12)}' +
            '@media(max-width:1050px){.places-map-shell{grid-template-columns:minmax(250px,.85fr) minmax(0,1.2fr)}.google-map-frame{height:500px}.tour-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#bikes .cards-grid,#housing .cards-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
            '@media(max-width:800px){.bot-calculator__row{grid-template-columns:1fr}.exchange-calculator{max-width:none;padding:20px;border-radius:20px}.places-map-shell{grid-template-columns:1fr;padding:8px;border-radius:22px}.places-map-main{order:1}.places-panel{order:2}.google-map-frame{height:360px}.places-list-modern{max-height:none;overflow:visible}.map-legend{left:12px;top:12px}.tour-mini-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#bikes .cards-grid,#housing .cards-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
            '@media(max-width:520px){.google-map-frame{height:310px}.tour-mini-card__image{height:180px}}';
        document.head.appendChild(s)
    }

    function buildCalculator() {
        var form = document.getElementById('exchange-form');
        if (!form) return;
        form.innerHTML = '<div class="calc-head"><div class="calc-head__title">Рассчитайте сумму обмена</div><div class="calc-head__text">Выберите валюту, введите сумму — калькулятор покажет сумму в донгах по актуальному курсу.</div></div><div class="bot-calculator__row"><div class="bot-calculator__currency-wrap"><button type="button" class="bot-calculator__currency" id="calc-currency-btn">🇷🇺 <strong>RUB</strong><span>⌄</span></button><div class="bot-calculator__dropdown" id="calc-currency-dropdown">' + Object.keys(CURRENCIES).map(function (c) {
            return '<button type="button" class="bot-currency" data-currency="' + c + '">' + CURRENCIES[c].flag + ' <strong>' + c + '</strong></button>'
        }).join('') + '</div></div><div class="bot-calculator__amount-wrap"><label for="calc-amount">Сумма</label><input id="calc-amount" type="number" inputmode="decimal" min="0" step="any" value="10000" placeholder="Введите сумму"></div></div><div class="bot-calculator__result" id="calc-result"></div><div class="bot-calculator__rates" id="calc-rates"></div><a class="bot-calculator__order" href="' + BOT_URL + '" target="_blank" rel="noopener noreferrer"><span>Заказать обмен</span><b>→</b></a>';
        var btn = document.getElementById('calc-currency-btn'),
            drop = document.getElementById('calc-currency-dropdown'), amount = document.getElementById('calc-amount'),
            result = document.getElementById('calc-result'), list = document.getElementById('calc-rates'),
            selected = 'RUB';

        function calculate() {
            var value = parseFloat(amount.value) || 0;
            result.innerHTML = '';
            list.innerHTML = '';
            if (!value) {
                result.innerHTML = '<div class="bot-calculator__result-label">Результат</div><div class="bot-calculator__result-value">Введите сумму</div>';
                return
            }
            if (selected === 'VND') {
                result.innerHTML = '<div class="bot-calculator__result-label">Сумма</div><div class="bot-calculator__result-value">' + money(value, 'VND') + '</div>';
                Object.keys(CURRENCIES).filter(function (c) {
                    return c !== 'VND'
                }).forEach(function (code) {
                    var r = rateFor(code, value);
                    if (r) list.innerHTML += '<div class="bot-rate-line"><span>' + CURRENCIES[code].flag + ' 1 ' + code + '</span><strong>' + money(r, 'VND') + '</strong></div>'
                });
                return
            }
            var rate = rateFor(selected, value);
            if (!rate) {
                result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Нет данных</div>';
                return
            }
            result.innerHTML = '<div class="bot-calculator__result-label">Вы получите</div><div class="bot-calculator__result-value">' + money(value * rate, 'VND') + '</div>';
            list.innerHTML = '<div class="bot-rate-line"><span>' + CURRENCIES[selected].flag + ' 1 ' + selected + '</span><strong>' + money(rate, 'VND') + '</strong></div>'
        }

        function loadRates() {
            result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Загрузка…</div>';
            fetch(SHEET_URL, {cache: 'no-store'}).then(function (r) {
                if (!r.ok) throw new Error();
                return r.text()
            }).then(function (csv) {
                var parsed = parseRates(csv);
                if (!parsed.RUB && !parsed.USD && !parsed.EUR && !parsed.USDT) throw new Error();
                rates = parsed;
                calculate()
            }).catch(function () {
                rates = {};
                result.innerHTML = '<div class="bot-calculator__result-label">Курс</div><div class="bot-calculator__result-value">Нет данных</div>';
                list.innerHTML = ''
            })
        }

        btn.addEventListener('click', function () {
            drop.classList.toggle('is-open')
        });
        drop.querySelectorAll('[data-currency]').forEach(function (b) {
            b.addEventListener('click', function () {
                selected = b.dataset.currency;
                btn.innerHTML = CURRENCIES[selected].flag + ' <strong>' + selected + '</strong><span>⌄</span>';
                drop.classList.remove('is-open');
                calculate()
            })
        });
        amount.addEventListener('input', calculate);
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.bot-calculator__currency-wrap')) drop.classList.remove('is-open')
        });
        loadRates();
        setInterval(loadRates, 60000)
    }

    function buildTours() {
        var section = document.getElementById('tours');
        if (!section) return;
        var tours = [{
            id: 'dalat',
            title: 'Далат',
            location: 'Город вечной весны',
            image: 'https://www.quinta.ru/upload/iblock/471/8isg01uxefhaphmr6y7sr81l5w2vfs9a/new-dalat-lead.jpeg',
            text: 'Водопады, кофейные плантации, Crazy House, цветочные фермы и главные места Далата за один день.'
        }, {
            id: 'baho',
            title: 'Ба Хо',
            location: 'Три уровня водопада',
            image: 'https://cms.enjourney.ru/upload/country/article/512x512/535_1.png',
            text: 'Природа, джунгли, природные бассейны, купание и активный день на водопадах Ба Хо.'
        }, {
            id: 'vinpearl',
            title: 'Винперл',
            location: 'VinWonders · остров Хон Тре',
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/534773724.jpg?k=e93c3b68f85baa36f38cc7b191974045e87b7217fc96c8552b2753228d9107ab&o=',
            text: 'Остров Хон Тре, аттракционы, аквапарк и целый день развлечений.'
        }, {
            id: 'islands',
            title: '4 острова',
            location: 'Острова Нячанга и море',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
            text: 'Морская прогулка по островам, купание, снорклинг и отдых на побережье.'
        }];
        section.innerHTML = '<div class="section__title__tour"><h2 class="section__title__tourh2">Туры</h2>\n' +
            '                <a href="https://t.me/" class="section__more section__title__toura" target="_blank" rel="noopener noreferrer">Подробнее <span aria-hidden="true">→</span></a></div><div class="tour-mini-grid">' + tours.map(function (t) {
            return '<a class="tour-mini-card" href="tour.html?tour=' + encodeURIComponent(t.id) + '"><span class="tour-mini-card__image"><img src="' + t.image + '" alt="' + t.title + '" loading="lazy"></span><span class="tour-mini-card__body"><strong>' + t.title + '</strong><span>' + t.location + '</span><small>' + t.text + '</small><em>Подробнее →</em></span></a>'
        }).join('') + '</div>'
    }

    function buildExtraCards() {
        var bikes = document.querySelector('#bikes .cards-grid'),
            housing = document.querySelector('#housing .cards-grid');
        if (bikes && !bikes.querySelector('[data-extra-bike]')) bikes.insertAdjacentHTML('beforeend', '<article class="product-card" data-extra-bike><div class="product-card__image"><img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop" alt="Honda Air Blade 125" loading="lazy"></div><div class="product-card__body"><h3 class="product-card__title">Honda Air Blade 125</h3><p class="product-card__desc">Комфортный городской скутер с хорошей динамикой и удобной посадкой для ежедневных поездок.</p><p class="product-card__price">от 220.000 ₫</p></div></article>');
        if (housing && !housing.querySelector('[data-extra-housing]')) housing.insertAdjacentHTML('beforeend', '<article class="product-card" data-extra-housing><div class="product-card__image"><img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop" alt="Студия у моря" loading="lazy"></div><div class="product-card__body"><h3 class="product-card__title">Студия у моря</h3><p class="product-card__desc">Уютная современная студия рядом с пляжем, подходит для длительного проживания.</p><p class="product-card__price">от 7.500.000 ₫</p></div></article>')
    }

    var PLACE_DATA = {
        food: [{
            name: 'Lanterns Vietnamese Restaurant',
            desc: 'Вьетнамская кухня и классические блюда',
            lat: 12.2413,
            lng: 109.1948
        }, {
            name: 'Lac Canh Restaurant',
            desc: 'Гриль и местная кухня',
            lat: 12.2517,
            lng: 109.1952
        }, {name: 'Bun Cha Ca Hon', desc: 'Рыбная лапша и блюда Нячанга', lat: 12.2508, lng: 109.1917}],
        sport: [{
            name: 'Nha Trang Golf Club',
            desc: 'Гольф с видом на побережье',
            lat: 12.2142,
            lng: 109.1778
        }, {
            name: 'Olympia Gym Nha Trang',
            desc: 'Силовые тренировки и фитнес',
            lat: 12.2455,
            lng: 109.191
        }, {name: 'Sailing Club Nha Trang', desc: 'Пляжный спорт и водные активности', lat: 12.2314, lng: 109.1964}],
        beach: [{name: 'Пляж Чан Фу', desc: 'Главный городской пляж', lat: 12.2365, lng: 109.196}, {
            name: 'Хон Чонг',
            desc: 'Скалы, бухта и море',
            lat: 12.2648,
            lng: 109.2025
        }, {name: 'Bai Dai Beach', desc: 'Длинный пляж южнее Нячанга', lat: 12.068, lng: 109.205}],
        mountains: [{
            name: 'Ба Хо',
            desc: 'Три водопада и природные бассейны',
            lat: 12.367,
            lng: 109.191
        }, {name: 'Hon Ba', desc: 'Горы и прохладный климат', lat: 12.105, lng: 108.99}, {
            name: 'Yang Bay',
            desc: 'Горная долина и водопады',
            lat: 12.27,
            lng: 108.95
        }],
        attractions: [{
            name: 'Po Nagar Cham Towers',
            desc: 'Исторический храмовый комплекс Чамов',
            lat: 12.2659,
            lng: 109.195
        }, {
            name: 'VinWonders Nha Trang',
            desc: 'Парк развлечений на острове Хон Тре',
            lat: 12.216,
            lng: 109.241
        }, {name: 'Long Son Pagoda', desc: 'Пагода и большая статуя Будды', lat: 12.255, lng: 109.183}]
    };
    var CATEGORIES = {
        food: {label: 'Еда', icon: '🍜'},
        sport: {label: 'Спорт', icon: '⚽'},
        beach: {label: 'Пляжи', icon: '🏖️'},
        mountains: {label: 'Горы', icon: '⛰️'},
        attractions: {label: 'Достопримечательности', icon: '🏛️'}
    };

    function googleSearchUrl(place) {
        return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place.name + ' Nha Trang')
    }

    function googleMyMapsUrl(place) {
        return GOOGLE_MY_MAPS_EMBED + '&ll=' + encodeURIComponent(place.lat + ',' + place.lng) + '&z=16'
    }

    function buildMap() {
        var root = document.getElementById('places-map'), list = document.getElementById('places-list');
        if (!root || !list) return;
        root.innerHTML = '<div class="places-map-shell"><div class="places-panel"><div class="places-panel__head"><div><div class="places-panel__eyebrow">Nha Trang</div><div class="places-panel__title">Лучшие места</div></div><div class="places-panel__count" id="places-count">0</div></div><div class="places-list-modern" id="places-list-modern"></div></div><div class="places-map-main"><div class="map-legend">Google My Maps</div><iframe class="google-map-frame" id="google-map-frame" title="Карта мест Нячанга" src="' + GOOGLE_MY_MAPS_EMBED + '" loading="lazy" allowfullscreen></iframe><a class="google-map-open" id="google-map-open" href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Открыть в Google Maps ↗</a></div></div>';
        var modern = document.getElementById('places-list-modern'), count = document.getElementById('places-count'),
            open = document.getElementById('google-map-open'), frame = document.getElementById('google-map-frame');

        function focusPlace(place) {
            if (!place) return;
            frame.src = googleMyMapsUrl(place);
            open.href = googleSearchUrl(place);
            var mapMain = frame.closest('.places-map-main');
            if (mapMain) mapMain.scrollIntoView({behavior: 'smooth', block: 'center'})
        }

        function render(category) {
            var places = PLACE_DATA[category] || [];
            count.textContent = places.length;
            modern.innerHTML = places.map(function (p, i) {
                return '<button type="button" class="place-card' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '"><span class="place-card__icon">' + CATEGORIES[category].icon + '</span><span><span class="place-card__name">' + p.name + '</span><span class="place-card__desc">' + p.desc + '</span></span><span class="place-card__arrow">›</span></button>'
            }).join('');
            modern.querySelectorAll('.place-card').forEach(function (card) {
                card.addEventListener('click', function () {
                    modern.querySelectorAll('.place-card').forEach(function (x) {
                        x.classList.remove('is-active')
                    });
                    card.classList.add('is-active');
                    focusPlace(places[Number(card.dataset.index)])
                })
            });
            if (places[0]) {
                open.href = googleSearchUrl(places[0]);
                frame.src = googleMyMapsUrl(places[0])
            }
        }

        var filters = document.querySelectorAll('.map-filter');
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filters.forEach(function (b) {
                    b.classList.remove('is-active');
                    b.setAttribute('aria-selected', 'false')
                });
                btn.classList.add('is-active');
                btn.setAttribute('aria-selected', 'true');
                render(btn.dataset.category)
            })
        });
        var active = document.querySelector('.map-filter.is-active') || filters[0];
        if (active) render(active.dataset.category)
    }

    function init() {
        addStyles();
        buildCalculator();
        buildTours();
        buildExtraCards();
        buildMap()
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();