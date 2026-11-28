// Порядок ключів — порядок у легенді й у списку секцій: спершу те, що можна купити
export const sectionStatuses = {
  SELLING: {
    label: "В продажі",
    textClass: "text-status-selling",
    dotClass: "bg-status-selling-strong",
    zoneClass: "fill-status-selling-strong/40 stroke-status-selling",
  },
  COMING_SOON: {
    label: "Скоро в продажі",
    textClass: "text-status-soon",
    dotClass: "bg-status-soon",
    zoneClass: "fill-status-soon/30 stroke-status-soon",
  },
  PLANNED: {
    label: "В проєкті",
    textClass: "text-status-planned",
    dotClass: "bg-status-planned",
    zoneClass: "fill-status-planned/30 stroke-status-planned",
  },
  SOLD: {
    label: "Все продано",
    textClass: "text-status-sold",
    dotClass: "bg-status-sold-strong",
    zoneClass: "fill-status-sold-strong/30 stroke-status-sold-strong",
  },
};

export const formatPrice = (value) => Math.round(value).toLocaleString("uk-UA");

export const roomsLabel = (apartment) => `${apartment.rooms}-кімнатна`;

export const leadComment = (sectionId, floor, apartment) =>
  `Секція №${sectionId}, поверх ${floor}, ${roomsLabel(apartment)} квартира, ${apartment.area} м²`;
