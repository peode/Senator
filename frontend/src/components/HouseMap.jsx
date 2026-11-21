import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { sectionStatuses } from "@/data/sections";
import {
  mapClass,
  mapImageClass,
  mapSvgClass,
  mapTooltipClass,
  mapZoneClass,
} from "@/lib/mapClasses";
import { cn } from "@/lib/utils";
import { useSections } from "@/stores/sectionsStore";
import { useComplexMap } from "@/stores/siteImagesStore";
import { useSiteText } from "@/stores/siteTextsStore";

const formatPrice = (value) => value.toLocaleString("uk-UA");

const HouseMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [activeHouse, setActiveHouse] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const { sections, error } = useSections();
  const complexMap = useComplexMap();
  const t = useSiteText();
  const houses = sections.filter(({ mapPoints }) => mapPoints);

  const updateCursor = (event) => {
    const rect = mapRef.current.getBoundingClientRect();
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const activeStatus = activeHouse && sectionStatuses[activeHouse.status];

  return (
    <section className="bg-white">
      <div className="flex flex-col gap-4 bg-ink px-[5%] pt-2 pb-5 text-white md:flex-row md:items-center md:justify-between md:gap-8 md:px-[3.5%] md:pb-7">
        <div>
          <h1 className="text-[clamp(24px,2.6vw,36px)] leading-tight font-extrabold">{t("apartments.title")}</h1>
          <p className="mt-1 text-sm text-white/70 md:text-[15px]">
            {t("apartments.hint")}
          </p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {Object.entries(sectionStatuses).map(([key, status]) => (
            <li
              key={key}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[13px] font-medium whitespace-nowrap"
            >
              <span className={cn("inline-block size-[9px] rounded-full", status.dotClass)} />
              {status.label}
              {houses.length > 0 && (
                <span className="font-bold text-white/60">
                  {houses.filter((house) => house.status === key).length}
                </span>
              )}
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
        {complexMap ? (
          <>
            <img
              src={complexMap.src}
              alt="Вигляд ЖК Senator зверху"
              width={complexMap.width}
              height={complexMap.height}
              className={mapImageClass}
              draggable="false"
            />

            <svg
              className={mapSvgClass}
              viewBox={`0 0 ${complexMap.width} ${complexMap.height}`}
              aria-label="Карта будинків"
            >
              {houses.map((house) => (
                <polygon
                  key={house.id}
                  className={mapZoneClass({ active: activeHouse?.id === house.id })}
                  points={house.mapPoints.map((point) => point.join(",")).join(" ")}
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
                    if (house.plan) navigate(`/apartments/${house.id}`);
                  }}
                />
              ))}
            </svg>
          </>
        ) : (
          <Skeleton className="aspect-square w-full rounded-none" />
        )}

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
            {activeHouse.status === "SELLING" && (
              <p>від {formatPrice(activeHouse.price)} $/м²</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HouseMap;
