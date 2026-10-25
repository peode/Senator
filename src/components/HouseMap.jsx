import { useRef, useState } from "react";
import "./HouseMap.css";

import banner from "@/assets/images/courtyard.png";
import topView from "@/assets/images/complex-top-view.jpg";

const IMAGE_WIDTH = 1262;
const IMAGE_HEIGHT = 1246;

const STATUSES = {
  selling: { label: "В продажі", className: "status-selling" },
  building: { label: "В проєкті", className: "status-building" },
  sold: { label: "Все продано", className: "status-sold" },
  sixteen: { label: "Скоро в продажі", className: "status-sixteen" },
};

// x, y, width, height — у координатах зображення
const houses = [
  { id: 1, x: 303, y: 143, w: 110, h: 130, status: "sold", price: null },
  { id: 2, x: 411, y: 143, w: 108, h: 130, status: "sold", price: null },
  { id: 3, x: 517, y: 143, w: 110, h: 130, status: "sold", price: null },
  { id: 4, x: 516, y: 356, w: 126, h: 126, status: "selling", price: 1350 },
  { id: 5, x: 640, y: 356, w: 124, h: 126, status: "selling", price: 1350 },
  { id: 6, x: 703, y: 451, w: 92, h: 146, status: "sold", price: null },
  { id: 7, x: 703, y: 598, w: 92, h: 152, status: "sold", price: null },
  { id: 8, x: 661, y: 748, w: 133, h: 114, status: "selling", price: 1250 },
  { id: 9, x: 535, y: 748, w: 128, h: 114, status: "selling", price: 1250 },
  { id: 10, x: 193, y: 319, w: 94, h: 148, status: "selling", price: 1150 },
  { id: 11, x: 196, y: 467, w: 90, h: 150, status: "selling", price: 1050 },
  { id: 12, x: 196, y: 614, w: 92, h: 148, status: "building", price: null },
  { id: 13, x: 196, y: 759, w: 92, h: 148, status: "building", price: null },
  { id: 14, x: 198, y: 903, w: 96, h: 184, status: "building", price: null },
  { id: 15, x: 293, y: 958, w: 187, h: 130, status: "building", price: null },
  { id: 16, x: 173, y: 220, w: 120, h: 120, status: "sixteen", price: null },
];

const formatPrice = (value) => value.toLocaleString("uk-UA");

const HouseMap = () => {
  const mapRef = useRef(null);
  const [activeHouse, setActiveHouse] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const updateCursor = (event) => {
    const rect = mapRef.current.getBoundingClientRect();
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const activeStatus = activeHouse ? STATUSES[activeHouse.status] : null;

  return (
    <section className="house-map-section">
      <div
        className="house-map-banner"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <h1>Карта будинків</h1>
      </div>

      <div className="house-map-footer">
        <p>Оберіть будинок, щоб побачити його план та іншу інформацію</p>

        <ul className="house-map-legend">
          {Object.values(STATUSES).map((status) => (
            <li key={status.label}>
              <span className={`legend-dot ${status.className}`} />
              {status.label}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="house-map"
        ref={mapRef}
        onPointerMove={updateCursor}
        onPointerLeave={() => setActiveHouse(null)}
      >
        <img
          src={topView}
          alt="Вигляд ЖК Senator зверху"
          className="house-map-image"
          draggable="false"
        />

        <svg
          className="house-map-svg"
          viewBox={`0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`}
          aria-label="Карта будинків"
        >
          {houses.map((house) => (
            <rect
              key={house.id}
              className={`house-zone ${
                activeHouse?.id === house.id ? "house-zone-active" : ""
              }`}
              x={house.x}
              y={house.y}
              width={house.w}
              height={house.h}
              onPointerEnter={(event) => {
                updateCursor(event);
                setActiveHouse(house);
              }}
              onPointerLeave={() => setActiveHouse(null)}
              onPointerDown={(event) => {
                updateCursor(event);
                setActiveHouse(house);
              }}
            />
          ))}
        </svg>

        {activeHouse && (
          <div
            className="house-tooltip"
            style={{ left: cursor.x, top: cursor.y }}
          >
            <strong>Секція №{activeHouse.id}</strong>
            <span className={`house-status ${activeStatus.className}`}>
              {activeStatus.label}
            </span>
            {activeHouse.price && (
              <p>від {formatPrice(activeHouse.price)} $/м²</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HouseMap;
