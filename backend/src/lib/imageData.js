// Ключ карти ЖК у таблиці SiteImage
export const COMPLEX_MAP_KEY = "complexMap";

export const toImageData = ({ image, ...size }) => ({
  ...size,
  image: Buffer.from(image.slice(image.indexOf(",") + 1), "base64"),
});
