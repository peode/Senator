import beautySalon from "@/assets/images/beauty-salon.webp";
import cafe from "@/assets/images/cafe.webp";
import topView from "@/assets/images/complex-top-view.jpg";
import courtyard from "@/assets/images/courtyard.webp";
import playground from "@/assets/images/playground.webp";
import postOffice from "@/assets/images/post-office.webp";
import supermarket from "@/assets/images/supermarket.webp";
import walkingZone from "@/assets/images/walking-zone.webp";
import logo from "@/assets/icons/SenatorLogo.jpg";

// Темний логотип на білому фоні -> білий на прозорому
export const logoClass = "mix-blend-screen brightness-140 grayscale invert";

// Місця на сайті, де картинку можна замінити в адмінці; src — стандартна картинка
export const siteImageSlots = {
  hero: { label: "Перший екран головної", src: courtyard, maxWidth: 2000 },
  banner: { label: "Банер угорі сторінок", src: courtyard, maxWidth: 2000 },
  overview: { label: "Блок «Про комплекс»", src: topView },
  playground: { label: "Тут передбачено: дитячий майданчик", src: playground },
  cafe: { label: "Тут передбачено: кав'ярня", src: cafe },
  supermarket: { label: "Тут передбачено: супермаркет", src: supermarket },
  walkingZone: { label: "Тут передбачено: прогулянкова зона", src: walkingZone },
  postOffice: { label: "Тут передбачено: поштове відділення", src: postOffice },
  beautySalon: { label: "Тут передбачено: салон краси", src: beautySalon },
  developer: { label: "Сторінка «Про забудовника»", src: courtyard },
  logo: {
    label: "Логотип",
    hint: "Завантажуйте темний логотип на білому тлі: на сайті він стає білим.",
    src: logo,
    maxWidth: 800,
  },
};

export const defaultComplexMap = { src: topView, width: 1262, height: 1246 };
