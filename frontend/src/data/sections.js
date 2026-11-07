import plan4 from "@/assets/images/plans/Section4.jpg";
import plan5 from "@/assets/images/plans/Section5.jpg";
import plan8 from "@/assets/images/plans/Section8.jpg";
import plan9 from "@/assets/images/plans/Section9.jpg";
import plan10 from "@/assets/images/plans/Section10.jpg";
import plan11 from "@/assets/images/plans/Section11.jpg";

// Статус, ціна й квартири секцій живуть у базі даних (GET /api/sections).
// Тут лише зображення планів: координати квартир задані в їхніх розмірах (width × height).
export const plans = {
  4: { src: plan4, width: 828, height: 507 },
  5: { src: plan5, width: 667, height: 552 },
  8: { src: plan8, width: 834, height: 429 },
  9: { src: plan9, width: 836, height: 542 },
  10: { src: plan10, width: 1201, height: 645 },
  11: { src: plan11, width: 779, height: 562 },
};

export const sectionStatuses = {
  SELLING: { label: "В продажі", className: "status-selling" },
  PLANNED: { label: "В проєкті", className: "status-building" },
  SOLD: { label: "Все продано", className: "status-sold" },
  COMING_SOON: { label: "Скоро в продажі", className: "status-sixteen" },
};

export const formatPrice = (value) => Math.round(value).toLocaleString("uk-UA");

export const roomsLabel = (apartment) => `${apartment.rooms}-кімнатна`;

export const leadComment = (sectionId, apartment) =>
  `Секція №${sectionId}, ${roomsLabel(apartment)} квартира, ${apartment.area} м²`;
