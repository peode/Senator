import { lazy, Suspense, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MapZone from "@/components/MapZone";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, sectionStatuses } from "@/data/sections";
import {
  mapClass,
  mapImageClass,
  mapPointer,
  mapSvgClass,
  mapTooltipClass,
  mapTooltipStyle,
  mapZoneClass,
} from "@/lib/mapClasses";
import { cn } from "@/lib/utils";
import { useSections } from "@/stores/sectionsStore";
import { useComplexMap } from "@/stores/siteImagesStore";
import { useSiteText } from "@/stores/siteTextsStore";

// Бібліотека 3D важка, тому завантажується лише на цій сторінці
const ComplexModel = lazy(() => import("@/components/ComplexModel"));

// Без WebGL лишається плоска карта. Проста перевірка не тягне за собою саму бібліотеку 3D
const webgl = (() => {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl"));
  } catch {
    return false;
  }
})();

const modelSkeleton = <Skeleton className="h-[68svh] min-h-[440px] w-full rounded-none md:h-[calc(100svh-120px)]" />;

const HEADER_HEIGHT = 104;

// На телефоні план обрізаний праворуч (ширина 152% лишає 830 зі 1262 пікселів карти).
// Залишок будівлі без номера над секціями закриваємо травою з поля поруч, як у 3D-моделі
const STANDARD_MAP_WIDTH = 1262;
const COVER = { x: 628, y: 100, width: 202, height: 195 };
const GRASS = { x: 880, y: 505, width: 240, height: 130 };

const PhoneCover = ({ map }) => {
  const scale = map.width / STANDARD_MAP_WIDTH;

  return (
    <g className="md:hidden">
      <defs>
        <pattern
          id="map-grass"
          patternUnits="userSpaceOnUse"
          x={COVER.x * scale}
          y={COVER.y * scale}
          width={GRASS.width * scale}
          height={GRASS.height * scale}
        >
          <image href={map.src} x={-GRASS.x * scale} y={-GRASS.y * scale} width={map.width} height={map.height} />
        </pattern>
      </defs>
      <rect
        x={COVER.x * scale}
        y={COVER.y * scale}
        width={COVER.width * scale}
        height={COVER.height * scale}
        fill="url(#map-grass)"
      />
    </g>
  );
};

const views = [
  { key: "3d", label: "3D" },
  { key: "2d", label: "2D" },
];

const statusOrder = Object.keys(sectionStatuses);

const freeUnits = ({ apartments }) =>
  apartments.flatMap(({ units }) => units).filter(({ available }) => available).length;

const SectionCard = ({ section }) => {
  const status = sectionStatuses[section.status];
  const free = section.status === "SELLING" ? freeUnits(section) : 0;
  const content = (
    <>
      <span className="block text-base font-bold">Секція №{section.id}</span>
      <span className="mt-1 flex items-center gap-2 text-[13px] font-medium text-slate-700">
        <span className={cn("inline-block size-[9px] shrink-0 rounded-full", status.dotClass)} />
        {status.label}
      </span>
      {section.status === "SELLING" && (
        <span className="mt-2 block text-[13px] text-slate-700">
          від {formatPrice(section.price)} $/м²
          <br />
          вільних квартир: {free}
        </span>
      )}
    </>
  );
  const cardClass = "block h-full rounded-xl border border-slate-200 p-3.5";

  return section.plan ? (
    <Link
      to={`/apartments/${section.id}`}
      className={cn(cardClass, "bg-white shadow-card transition-colors hover:border-brand-dark")}
    >
      {content}
    </Link>
  ) : (
    <div className={cn(cardClass, "bg-surface")}>{content}</div>
  );
};

const HouseMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [view, setView] = useState("3d");
  const [activeHouse, setActiveHouse] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const { sections, error } = useSections();
  const complexMap = useComplexMap();
  const t = useSiteText();
  const houses = sections.filter(({ mapPoints }) => mapPoints);
  // Без WebGL або даних секцій модель не побудувати, тому лишається плоска карта
  const can3d = webgl && !error;
  const show3d = can3d && view === "3d";
  const sortedSections = sections.toSorted(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) || a.id - b.id,
  );

  const updateCursor = (event) => setCursor(mapPointer(event, mapRef.current));

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

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 md:justify-end">
          {can3d && (
            <div role="group" aria-label="Вигляд карти" className="inline-flex rounded-full bg-white/10 p-1">
              {views.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={view === key}
                  onClick={() => setView(key)}
                  className={cn(
                    "min-h-9 min-w-12 cursor-pointer rounded-full px-3.5 text-[13px] font-bold transition-colors",
                    view === key ? "bg-white text-ink" : "text-white/70 hover:text-white",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

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
      </div>

      {error && (
        <p className="px-[3.5%] pb-5 text-sm text-red-600">
          Не вдалося завантажити дані секцій, тому підказки й плани тимчасово недоступні.
        </p>
      )}

      {show3d ? (
        sections.length > 0 && complexMap ? (
          <Suspense fallback={modelSkeleton}>
            <ComplexModel sections={sections} map={complexMap} />
          </Suspense>
        ) : (
          modelSkeleton
        )
      ) : (
        <div
          className={cn(mapClass, "mx-auto")}
          // план вміщується в екран під шапкою, тому на ноутбуці видно його весь
          style={complexMap && { maxWidth: `calc((100svh - ${HEADER_HEIGHT}px) * ${complexMap.width / complexMap.height})` }}
          ref={mapRef}
          onPointerMove={updateCursor}
          onPointerLeave={() => setActiveHouse(null)}
        >
          {complexMap ? (
            <div className="relative max-md:w-[152%]">
              <img
                src={complexMap.src}
                alt="Вигляд ЖК Senator зверху"
                width={complexMap.width}
                height={complexMap.height}
                fetchPriority="high"
                className={mapImageClass}
                draggable="false"
              />

              <svg
                className={mapSvgClass}
                viewBox={`0 0 ${complexMap.width} ${complexMap.height}`}
                role="group"
                aria-label="Карта будинків"
              >
                <PhoneCover map={complexMap} />
                {houses.map((house) => {
                  const status = sectionStatuses[house.status];

                  return (
                    <MapZone
                      key={house.id}
                      label={`Секція №${house.id}, ${status.label}`}
                      points={house.mapPoints}
                      className={mapZoneClass({
                        active: activeHouse?.id === house.id,
                        tint: status.zoneClass,
                        clickable: Boolean(house.plan),
                      })}
                      onSelect={house.plan ? () => navigate(`/apartments/${house.id}`) : undefined}
                      onPreview={(event) => {
                        updateCursor(event);
                        setActiveHouse(house);
                      }}
                      onPreviewEnd={() => setActiveHouse(null)}
                    />
                  );
                })}
              </svg>
            </div>
          ) : (
            <Skeleton className="aspect-square w-full rounded-none" />
          )}

          {activeStatus && (
            <div className={cn(mapTooltipClass, "md:max-w-none")} style={mapTooltipStyle(cursor)}>
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
      )}

      {!show3d && sections.length > 0 && (
        <div className="px-[5%] py-8 text-ink md:px-[3.5%] md:py-12">
          <h2 className="mb-5 text-2xl font-extrabold">Усі секції</h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
            {sortedSections.map((section) => (
              <li key={section.id}>
                <SectionCard section={section} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default HouseMap;
