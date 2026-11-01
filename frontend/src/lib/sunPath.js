// Положення сонця над ЖК для обраної години й дня. Точності до кількох хвилин досить, щоб показати тіні
const LATITUDE = 48.29;
const LONGITUDE = 25.94;

const RAD = Math.PI / 180;

const dayOfYear = (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);

// Київський час: літній діє приблизно з квітня по жовтень
const clockOffset = (date) => (date.getMonth() >= 3 && date.getMonth() <= 9 ? 3 : 2);

// Сонячний полудень зміщений відносно годинника через довготу й нерівномірний рух Землі
const solarNoon = (date) => {
  const b = (2 * Math.PI * (dayOfYear(date) - 81)) / 364;
  const equationOfTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  return 12 + clockOffset(date) - LONGITUDE / 15 - equationOfTime / 60;
};

const declination = (date) => 23.44 * RAD * Math.sin((2 * Math.PI * (284 + dayOfYear(date))) / 365);

// Напрямок на сонце одиничним вектором: схід, північ, вгору
export const sunDirection = (hour, date) => {
  const angle = (hour - solarNoon(date)) * 15 * RAD;
  const delta = declination(date);
  const latitude = LATITUDE * RAD;

  return {
    east: -Math.cos(delta) * Math.sin(angle),
    north: Math.cos(latitude) * Math.sin(delta) - Math.sin(latitude) * Math.cos(delta) * Math.cos(angle),
    up: Math.sin(latitude) * Math.sin(delta) + Math.cos(latitude) * Math.cos(delta) * Math.cos(angle),
  };
};

export const daylight = (date) => {
  const halfDay = Math.acos(-Math.tan(LATITUDE * RAD) * Math.tan(declination(date))) / (15 * RAD);
  const noon = solarNoon(date);
  return { sunrise: noon - halfDay, sunset: noon + halfDay };
};

export const formatHour = (hour) => {
  const minutes = Math.round(hour * 60) % (24 * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
};
