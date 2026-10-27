import plan4 from "@/assets/images/plans/Section4.jpg";
import plan5 from "@/assets/images/plans/Section5.jpg";
import plan8 from "@/assets/images/plans/Section8.jpg";
import plan9 from "@/assets/images/plans/Section9.jpg";
import plan10 from "@/assets/images/plans/Section10.jpg";
import plan11 from "@/assets/images/plans/Section11.jpg";

// Ціна за м² ($) — така сама, як на карті будинків
// Квартири: points — вершини багатокутника в координатах зображення плану (width × height).
// План однаковий на всіх поверхах секції.
export const sections = {
  4: {
    price: 1350,
    plan: { src: plan4, width: 828, height: 507 },
    apartments: [
      { id: "4-1", rooms: 2, area: 67.4, points: [[20, 30], [220, 30], [220, 290], [140, 290], [140, 490], [20, 490]] },
      { id: "4-2", rooms: 1, area: 40.3, points: [[220, 25], [440, 25], [440, 240], [220, 240]] },
      { id: "4-3", rooms: 1, area: 40.5, points: [[440, 25], [655, 25], [655, 240], [440, 240]] },
      { id: "4-4", rooms: 2, area: 70.4, points: [[655, 30], [810, 30], [810, 495], [555, 495], [555, 240], [655, 240]] },
      { id: "4-5", rooms: 1, area: 41.2, points: [[140, 300], [390, 300], [390, 490], [140, 490]] },
    ],
  },
  5: {
    price: 1350,
    plan: { src: plan5, width: 667, height: 552 },
    apartments: [
      { id: "5-1", rooms: 2, area: 67.6, points: [[40, 15], [135, 15], [135, 195], [215, 195], [215, 405], [40, 405]] },
      { id: "5-2", rooms: 1, area: 40.4, points: [[135, 20], [320, 20], [320, 195], [135, 195]] },
      { id: "5-3", rooms: 1, area: 40.4, points: [[320, 20], [500, 20], [500, 195], [320, 195]] },
      { id: "5-4", rooms: 2, area: 66.2, points: [[500, 20], [620, 20], [620, 345], [445, 345], [445, 195], [500, 195]] },
      { id: "5-5", rooms: 2, area: 68.2, points: [[355, 285], [445, 285], [445, 345], [620, 345], [620, 545], [355, 545]] },
    ],
  },
  8: {
    price: 1250,
    plan: { src: plan8, width: 834, height: 429 },
    apartments: [
      { id: "8-1", rooms: 3, area: 81.9, points: [[25, 15], [290, 15], [290, 315], [25, 315]] },
      { id: "8-2", rooms: 1, area: 45.5, points: [[515, 45], [805, 45], [805, 215], [515, 215]] },
      { id: "8-3", rooms: 1, area: 35.7, points: [[290, 220], [515, 220], [515, 420], [380, 420], [380, 315], [290, 315]] },
      { id: "8-4", rooms: 1, area: 49.0, points: [[515, 215], [805, 215], [805, 385], [515, 385]] },
    ],
  },
  9: {
    price: 1250,
    plan: { src: plan9, width: 836, height: 542 },
    apartments: [
      { id: "9-1", rooms: 2, area: 63.2, points: [[25, 40], [400, 40], [400, 245], [25, 245]] },
      { id: "9-2", rooms: 1, area: 45.7, points: [[25, 245], [235, 245], [235, 520], [25, 520]] },
      { id: "9-3", rooms: 2, area: 60.9, points: [[235, 310], [565, 310], [565, 520], [235, 520]] },
      { id: "9-4", rooms: 2, area: 64.5, points: [[565, 185], [805, 185], [805, 520], [565, 520]] },
    ],
  },
  10: {
    price: 1150,
    plan: { src: plan10, width: 1201, height: 645 },
    apartments: [
      { id: "10-1", rooms: 1, area: 44.6, points: [[20, 10], [310, 10], [310, 300], [20, 300]] },
      { id: "10-2", rooms: 1, area: 43.12, points: [[310, 10], [600, 10], [600, 295], [310, 295]] },
      { id: "10-3", rooms: 2, area: 64.61, points: [[600, 10], [1040, 10], [1040, 295], [600, 295]] },
      { id: "10-4", rooms: 2, area: 72.04, points: [[1040, 10], [1195, 10], [1195, 640], [900, 640], [900, 300], [1040, 300]] },
      { id: "10-5", rooms: 1, area: 49.29, points: [[20, 305], [225, 305], [225, 400], [365, 400], [365, 610], [20, 610]] },
      { id: "10-6", rooms: 1, area: 39.86, points: [[575, 390], [900, 390], [900, 640], [575, 640]] },
    ],
  },
  11: {
    price: 1050,
    plan: { src: plan11, width: 779, height: 562 },
    apartments: [
      { id: "11-1", rooms: 2, area: 71.02, points: [[20, 20], [135, 20], [135, 255], [245, 255], [245, 540], [20, 540]] },
      { id: "11-2", rooms: 2, area: 63.59, points: [[135, 10], [510, 10], [510, 250], [135, 250]] },
      { id: "11-3", rooms: 1, area: 46.0, points: [[510, 10], [760, 10], [760, 280], [510, 280]] },
      { id: "11-4", rooms: 1, area: 38.38, points: [[640, 285], [760, 285], [760, 540], [515, 540], [515, 305], [640, 305]] },
    ],
  },
};

export const getSection = (id) => sections[id] ?? null;

export const formatPrice = (value) => Math.round(value).toLocaleString("uk-UA");
