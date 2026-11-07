import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApartmentFilters from "@/components/ApartmentFilters";
import { plans, sectionStatuses } from "@/data/sections";
import {
  mapClass,
  mapImageClass,
  mapSvgClass,
  mapTooltipClass,
  mapZoneClass,
} from "@/lib/mapClasses";
import { cn } from "@/lib/utils";
import { hasActiveFilters, useApartmentFiltersStore } from "@/stores/apartmentFiltersStore";
import { useApartments } from "@/stores/apartmentsStore";
import { useSections } from "@/stores/sectionsStore";

import topView from "@/assets/images/complex-top-view.jpg";

const IMAGE_WIDTH = 1262;
const IMAGE_HEIGHT = 1246;

// x, y, width, height — у координатах зображення; статус і ціна секції приходять з API
const houses = [
  { id: 1, x: 303, y: 143, w: 110, h: 130 },
  { id: 2, x: 411, y: 143, w: 108, h: 130 },
  { id: 3, x: 517, y: 143, w: 110, h: 130 },
  { id: 4, x: 516, y: 356, w: 126, h: 126 },
  { id: 5, x: 640, y: 356, w: 124, h: 126 },
  { id: 6, x: 703, y: 451, w: 92, h: 146 },
  { id: 7, x: 703, y: 598, w: 92, h: 152 },
  { id: 8, x: 661, y: 748, w: 133, h: 114 },
  { id: 9, x: 535, y: 748, w: 128, h: 114 },
  { id: 10, x: 193, y: 319, w: 94, h: 148 },
  { id: 11, x: 196, y: 467, w: 90, h: 150 },
  { id: 12, x: 196, y: 614, w: 92, h: 148 },
  { id: 13, x: 196, y: 759, w: 92, h: 148 },
  { id: 14, x: 198, y: 903, w: 96, h: 184 },
  { id: 15, x: 293, y: 958, w: 187, h: 130 },
  { id: 16, x: 173, y: 220, w: 120, h: 120 },
];

const formatPrice = (value) => value.toLocaleString("uk-UA");

const HouseMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [activeHouse, setActiveHouse] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const filtering = useApartmentFiltersStore(hasActiveFilters);
  const { sections, error } = useSections();
  const { apartments, loaded } = useApartments();

  const matchCount = (house) =>
    apartments.filter((apartment) => apartment.sectionId === house.id).length;

  const updateCursor = (event) => {
    const rect = mapRef.current.getBoundingClientRect();
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const activeSection = sections.find((section) => section.id === activeHouse?.id);
  const activeStatus = activeSection && sectionStatuses[activeSection.status];

  return (
    <section className="bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-[3.5%] py-[22px] text-ink">
        <ApartmentFilters />

        <p className="text-[15px] font-medium">Оберіть будинок, щоб побачити його план та іншу інформацію</p>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {Object.values(sectionStatuses).map((status) => (
            <li key={status.label} className="flex items-center gap-2">
              <span className={cn("inline-block size-[9px] rounded-full", status.dotClass)} />
              {status.label}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="px-[3.5%] pb-5 text-sm text-red-600">
          Не вдалося завантажити дані секцій, тому підказки й плани тимчасово недоступні.
        </p>
      )}

      <div
        className={mapClass}
        ref={mapRef}
        onPointerMove={updateCursor}
        onPointerLeave={() => setActiveHouse(null)}
      >
        <img
          src={topView}
          alt="Вигляд ЖК Senator зверху"
          className={mapImageClass}
          draggable="false"
        />

        <svg
          className={mapSvgClass}
          viewBox={`0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`}
          aria-label="Карта будинків"
        >
          {houses.map((house) => (
            <rect
              key={house.id}
              className={mapZoneClass({
                active: activeHouse?.id === house.id,
                dimmed: filtering && loaded && matchCount(house) === 0,
              })}
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
              onClick={() => {
                if (plans[house.id]) navigate(`/apartments/${house.id}`);
              }}
            />
          ))}
        </svg>

        {activeStatus && (
          <div
            className={mapTooltipClass}
            style={{ left: cursor.x, top: cursor.y }}
          >
            <strong>Секція №{activeHouse.id}</strong>
            <span
              className={cn(
                "inline-flex items-center gap-[7px] text-xs font-semibold before:inline-block before:size-[9px] before:rounded-full before:bg-current",
                activeStatus.textClass,
              )}
            >
              {activeStatus.label}
            </span>
            {activeSection.status === "SELLING" && (
              <p>від {formatPrice(activeSection.price)} $/м²</p>
            )}
            {filtering && activeSection.status === "SELLING" && (
              <p>Підходить квартир: {matchCount(activeHouse)}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HouseMap;
