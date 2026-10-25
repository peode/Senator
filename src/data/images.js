import courtyard from "@/assets/images/courtyard.png";
import walkingZone from "@/assets/images/walking-zone.png";
import playground from "@/assets/images/playground.png";
import topView from "@/assets/images/complex-top-view.jpg";
import cafe from "@/assets/images/cafe.png";
import supermarket from "@/assets/images/supermarket.png";
import postOffice from "@/assets/images/post-office.png";
import beautySalon from "@/assets/images/beauty-salon.png";

// Зображення з бібліотеки сайту: у сховищі зберігається ключ, а не хешований URL
export const imageLibrary = {
  courtyard: { label: "Двір", src: courtyard },
  walkingZone: { label: "Прогулянкова зона", src: walkingZone },
  playground: { label: "Дитячий майданчик", src: playground },
  topView: { label: "Вигляд зверху", src: topView },
  cafe: { label: "Кав'ярня", src: cafe },
  supermarket: { label: "Супермаркет", src: supermarket },
  postOffice: { label: "Пошта", src: postOffice },
  beautySalon: { label: "Салон краси", src: beautySalon },
};

// Ключ із бібліотеки або власне зображення (data:/http URL)
export const resolveImage = (value) => imageLibrary[value]?.src ?? value;
