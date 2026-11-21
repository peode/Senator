export const sectionStatuses = {
  SELLING: { label: "В продажі", textClass: "text-status-selling", dotClass: "bg-status-selling-strong" },
  PLANNED: { label: "В проєкті", textClass: "text-status-planned", dotClass: "bg-status-planned" },
  SOLD: { label: "Все продано", textClass: "text-status-sold", dotClass: "bg-status-sold-strong" },
  COMING_SOON: { label: "Скоро в продажі", textClass: "text-status-soon", dotClass: "bg-status-soon" },
};

export const formatPrice = (value) => Math.round(value).toLocaleString("uk-UA");

export const roomsLabel = (apartment) => `${apartment.rooms}-кімнатна`;

export const leadComment = (sectionId, floor, apartment) =>
  `Секція №${sectionId}, поверх ${floor}, ${roomsLabel(apartment)} квартира, ${apartment.area} м²`;
