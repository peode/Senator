// Тексти й картинки сторінок, які можна змінити в адмінці (вкладка «Сторінки»).
// value — стандартний текст: у базі зберігаються лише змінені
const text = (key, label, value) => ({ key, label, value });
const long = (key, label, value) => ({ key, label, value, long: true });

export const sitePages = [
  {
    id: "home",
    label: "Головна",
    url: "/",
    blocks: [
      {
        title: "Перший екран",
        images: ["hero"],
        fields: [
          text("hero.eyebrow", "Напис над заголовком", "НОВИЙ РІВЕНЬ КОМФОРТУ"),
          text("hero.title", "Заголовок", "ЖК «Senator»"),
          text("hero.accent", "Золотий рядок заголовка", "Будинок високого рангу"),
          long("hero.text", "Опис", "Сучасна архітектура, продумані планування та комфорт для всієї родини."),
          text("hero.button", "Кнопка", "Обрати квартиру"),
          text("hero.video", "Підпис відео", "ПЕРЕГЛЯНУТИ ВІДЕО"),
        ],
      },
      {
        title: "Про комплекс",
        images: ["overview"],
        fields: [
          text("overview.title", "Заголовок", "ПРО КОМПЛЕКС"),
          text("overview.subtitle", "Підзаголовок", "ЖК «Senator» — будинок високого рангу"),
          long(
            "overview.lead",
            "Головний абзац",
            "«Senator» — сучасний житловий комплекс на вулиці Руській, 236Б у Чернівцях, створений для тих, хто цінує комфорт, безпеку та продумані рішення.",
          ),
          long(
            "overview.text1",
            "Абзац 2",
            "Монолітно-каркасна технологія, індивідуальне опалення в кожній квартирі, закрита територія без автомобілів та власне укриття — усе для спокійного життя. На перших поверхах розміщені комерційні приміщення, тож щоденні потреби закриваються без виїзду з комплексу.",
          ),
          long(
            "overview.text2",
            "Абзац 3",
            "Планування включають зручні квартири з панорамними вікнами, лоджіями та гардеробними, а також дворівневі квартири для найвибагливіших мешканців.",
          ),
          text("overview.button", "Кнопка на картинці", "Обрати квартиру на плані"),
          text("overview.stat1.value", "Цифра 1", "10"),
          text("overview.stat1.label", "Підпис цифри 1", "поверхів у будинках"),
          text("overview.stat2.value", "Цифра 2", "2"),
          text("overview.stat2.label", "Підпис цифри 2", "рівні підземного паркінгу"),
          text("overview.stat3.value", "Цифра 3", "2,8 м"),
          text("overview.stat3.label", "Підпис цифри 3", "висота стель"),
          text("overview.stat4.value", "Цифра 4", "2029"),
          text("overview.stat4.label", "Підпис цифри 4", "завершення будівництва"),
        ],
      },
      {
        title: "Тут передбачено",
        images: ["playground", "cafe", "supermarket", "walkingZone", "postOffice", "beautySalon"],
        fields: [
          text("amenities.title", "Заголовок", "ТУТ ПЕРЕДБАЧЕНО"),
          text("amenities.subtitle", "Підзаголовок", "Все, що потрібне для комфортного життя!"),
          text("amenities.hint", "Підказка над плитками", "Оберіть, що хочете роздивитись"),
          text("amenity.playground.title", "Дитячий майданчик: назва", "Дитячий майданчик"),
          text("amenity.playground.text", "Дитячий майданчик: опис", "Простір для ігор та дитячих пригод."),
          text("amenity.cafe.title", "Кав'ярня: назва", "Кав'ярня"),
          text("amenity.cafe.text", "Кав'ярня: опис", "Улюблена кава зовсім поруч із домом."),
          text("amenity.supermarket.title", "Супермаркет: назва", "Супермаркет"),
          text("amenity.supermarket.text", "Супермаркет: опис", "Усе необхідне для щоденних покупок."),
          text("amenity.walking.title", "Прогулянкова зона: назва", "Прогулянкова зона"),
          text("amenity.walking.text", "Прогулянкова зона: опис", "Зелений простір для відпочинку на свіжому повітрі."),
          text("amenity.post.title", "Поштове відділення: назва", "Поштове відділення"),
          text("amenity.post.text", "Поштове відділення: опис", "Зручно отримувати та відправляти посилки."),
          text("amenity.beauty.title", "Салон краси: назва", "Салон краси"),
          text("amenity.beauty.text", "Салон краси: опис", "Турбота про себе неподалік від дому."),
        ],
      },
      {
        title: "Переваги",
        note: "Сам список переваг змінюється у вкладці «Переваги».",
        fields: [
          text("benefits.title", "Заголовок", "ПЕРЕВАГИ"),
          text("benefits.link", "Посилання", "Усі переваги"),
        ],
      },
      {
        title: "Розташування",
        fields: [
          text("location.title", "Заголовок", "РОЗТАШУВАННЯ"),
          text("location.subtitle", "Підзаголовок", "м. Чернівці, вул. Руська, 236Б"),
          text("location.hint", "Підказка над списком", "Оберіть місце, щоб побачити маршрут на карті"),
          text("location.button", "Кнопка в рядку", "На карті"),
          text("location.school.title", "Місце 1: назва", "Школа №42"),
          text("location.school.distance", "Місце 1: відстань", "≈ 10 хв пішки"),
          text("location.mall.title", "Місце 2: назва", "ТРЦ «Екватор»"),
          text("location.mall.distance", "Місце 2: відстань", "≈ 16 хв пішки"),
          text("location.hospital.title", "Місце 3: назва", "Лікарня швидкої допомоги"),
          text("location.hospital.distance", "Місце 3: відстань", "≈ 5 хв авто"),
          text("location.atb.title", "Місце 4: назва", "АТБ-Маркет"),
          text("location.atb.distance", "Місце 4: відстань", "≈ 5 хв авто"),
          text("location.center.title", "Місце 5: назва", "Центр міста"),
          text("location.center.distance", "Місце 5: відстань", "≈ 15 хв авто"),
        ],
      },
      {
        title: "Новини на головній",
        note: "Самі новини змінюються у вкладці «Новини».",
        fields: [
          text("news.homeTitle", "Заголовок", "НОВИНИ"),
          text("news.allLink", "Посилання", "Усі новини"),
        ],
      },
    ],
  },
  {
    id: "advantages",
    label: "Переваги",
    url: "/advantages",
    blocks: [
      {
        title: "Банер",
        note: "Сам список переваг змінюється у вкладці «Переваги».",
        fields: [
          text("advantages.banner", "Заголовок", "Переваги"),
          text("advantages.subtitle", "Підзаголовок", "Чому мешканці обирають «Senator»"),
        ],
      },
      {
        title: "Заклик унизу сторінки",
        fields: [
          text("advantages.ctaTitle", "Заголовок", "Оберіть свою квартиру в «Senator»"),
          long("advantages.ctaText", "Опис", "Подивіться планування або залиште заявку — менеджер усе розповість."),
          text("advantages.ctaButton", "Золота кнопка", "Обрати квартиру"),
          text("advantages.ctaLead", "Друга кнопка", "Залишити заявку"),
        ],
      },
    ],
  },
  {
    id: "apartments",
    label: "Планування",
    url: "/apartments",
    blocks: [
      {
        title: "Смуга над картою",
        note: "Картинка карти ЖК і контури будинків змінюються у вкладці «Секції».",
        fields: [
          text("apartments.title", "Заголовок", "Оберіть будинок на карті"),
          long("apartments.hint", "Підказка", "Натисніть на будинок, щоб побачити його план і вільні квартири"),
        ],
      },
    ],
  },
  {
    id: "news",
    label: "Новини",
    url: "/news",
    blocks: [
      {
        title: "Банер",
        note: "Самі новини змінюються у вкладці «Новини».",
        fields: [
          text("news.banner", "Заголовок", "Новини"),
          text("news.subtitle", "Підзаголовок", "Як будується ЖК «Senator»"),
          text("news.relatedTitle", "Заголовок під статтею", "ЧИТАЙТЕ ТАКОЖ"),
        ],
      },
    ],
  },
  {
    id: "developer",
    label: "Про забудовника",
    url: "/aboutdeveloper",
    blocks: [
      {
        title: "Банер",
        fields: [
          text("developer.banner", "Заголовок", "Про забудовника"),
          text("developer.subtitle", "Підзаголовок", "Буковинський квартал — Чернівці"),
        ],
      },
      {
        title: "Про компанію",
        images: ["developer"],
        fields: [
          text("developer.title", "Заголовок", "БУКОВИНСЬКИЙ КВАРТАЛ"),
          long(
            "developer.lead",
            "Головний абзац",
            "«Буковинський квартал» — чернівецька будівельна компанія, яка зводить житловий комплекс «Senator».",
          ),
          long(
            "developer.text",
            "Абзац 2",
            "Компанію зареєстровано в Чернівцях у 2016 році, її основна діяльність — будівництво житлових і нежитлових будівель. ЖК «Senator» на вулиці Руській, 236Б — її головний проєкт: квартал із 16 будинків, закритою територією та підземним паркінгом.",
          ),
          text("developer.fact1.label", "Факт 1: підпис", "Компанія"),
          text("developer.fact1.value", "Факт 1: значення", "ТОВ «Буковинський квартал»"),
          text("developer.fact2.label", "Факт 2: підпис", "Зареєстрована"),
          text("developer.fact2.value", "Факт 2: значення", "у 2016 році"),
          text("developer.fact3.label", "Факт 3: підпис", "Діяльність"),
          text("developer.fact3.value", "Факт 3: значення", "Будівництво житлових і нежитлових будівель"),
          text("developer.fact4.label", "Факт 4: підпис", "ЄДРПОУ"),
          text("developer.fact4.value", "Факт 4: значення", "40676338"),
        ],
      },
      {
        title: "Що ми будуємо",
        fields: [
          text("developer.projectTitle", "Заголовок", "ЩО МИ БУДУЄМО"),
          text("developer.project1.title", "Картка 1: заголовок", "16 будинків"),
          long(
            "developer.project1.text",
            "Картка 1: опис",
            "ЖК «Senator» на вулиці Руській, 236Б будується чергами та об'єднує будинки в один квартал.",
          ),
          text("developer.project2.title", "Картка 2: заголовок", "Монолітний каркас"),
          long(
            "developer.project2.text",
            "Картка 2: опис",
            "Будинки зводяться за монолітно-каркасною технологією, стіни — з керамоблоку.",
          ),
          text("developer.project3.title", "Картка 3: заголовок", "Закрита територія"),
          long(
            "developer.project3.text",
            "Картка 3: опис",
            "Територія комплексу закрита для стороннього транспорту та відвідувачів.",
          ),
          text("developer.project4.title", "Картка 4: заголовок", "Підземний паркінг"),
          long("developer.project4.text", "Картка 4: опис", "У комплексі передбачено дворівневий підземний паркінг."),
        ],
      },
      {
        title: "Соцмережі",
        note: "Посилання на соцмережі змінюються у вкладці «Налаштування».",
        fields: [
          text("developer.socialTitle", "Заголовок", "МИ В СОЦМЕРЕЖАХ"),
          text("developer.socialSubtitle", "Підзаголовок", "Слідкуйте за ходом будівництва"),
          text("developer.social.facebook", "Підпис Facebook", "Новини та анонси"),
          text("developer.social.instagram", "Підпис Instagram", "Фото та відео з будівництва"),
          text("developer.social.youtube", "Підпис YouTube", "Відео про комплекс"),
        ],
      },
    ],
  },
  {
    id: "contacts",
    label: "Контакти",
    url: "/contacts",
    blocks: [
      {
        title: "Сторінка контактів",
        note: "Телефон, адреса й години роботи змінюються у вкладці «Налаштування».",
        fields: [
          text("contacts.banner", "Заголовок банера", "Контакти"),
          text("contacts.title", "Заголовок блоку", "ВІДДІЛ ПРОДАЖУ"),
          text("contacts.route", "Кнопка", "Прокласти маршрут"),
        ],
      },
    ],
  },
  {
    id: "common",
    label: "Усі сторінки",
    blocks: [
      {
        title: "Логотип і банер",
        note: "Логотип стоїть у шапці й у футері, а банер угорі всіх сторінок, крім головної.",
        images: ["logo", "banner"],
        fields: [],
      },
      {
        title: "Футер",
        fields: [
          text("footer.sales", "Заголовок контактів", "Відділ Продажу"),
          text("footer.socials", "Заголовок соцмереж", "Ми в соцмережах"),
          text("footer.button", "Кнопка", "Залишити заявку на дзвінок"),
          text("footer.copyright", "Рядок унизу (рік додається сам)", "ЖК «Senator». Усі права захищено."),
        ],
      },
    ],
  },
];

export const siteTextDefaults = Object.fromEntries(
  sitePages.flatMap(({ blocks }) =>
    blocks.flatMap(({ fields }) => fields.map(({ key, value }) => [key, value])),
  ),
);
