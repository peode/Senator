import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, useParams, useSearchParams } from "react-router-dom";

import ApartmentFilters from "@/components/ApartmentFilters";
import FloorPicker from "@/components/FloorPicker";
import MapZone from "@/components/MapZone";
import PageBanner from "@/components/PageBanner";
import Seo from "@/components/Seo";
import ShareButton from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, leadComment, roomsLabel, sectionStatuses } from "@/data/sections";
import { useApartments } from "@/stores/apartmentsStore";
import { hasActiveFilters, useApartmentFiltersStore } from "@/stores/apartmentFiltersStore";
import { useLeadModalStore } from "@/stores/leadModalStore";
import { useSections } from "@/stores/sectionsStore";
import {
  mapClass,
  mapImageClass,
  mapPointer,
  mapPolygonCenter,
  mapSvgClass,
  mapTooltipClass,
  mapTooltipStyle,
  mapZoneClass,
} from "@/lib/mapClasses";
import { cn, scrollMotion } from "@/lib/utils";

// Закріплена шапка плюс відступ: блок вище за цю межу вже не видно
const HEADER_OFFSET = 104;

const legend = [
  { label: "Вільна", className: "border-2 border-status-selling-strong bg-white" },
  { label: "Продана", className: "bg-black/55" },
  { label: "Не підходить під фільтри", className: "border border-slate-300 bg-slate-100" },
];

const Section = () => {
  const { sectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const mapRef = useRef(null);
  const infoRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  // квартира й поверх в адресі: посиланням можна поділитися
  const [selectedId, setSelectedId] = useState(() => searchParams.get("apt"));
  const [cursor, setCursor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const { sections, loading, error } = useSections();
  const { apartments: matching, loaded } = useApartments();
  const openLeadModal = useLeadModalStore((state) => state.open);
  const filters = useApartmentFiltersStore();

  const section = sections.find(({ id }) => String(id) === sectionId);
  const plan = section?.plan;

  if (loading) {
    return (
      <>
        <Seo title={`Секція №${sectionId}`} />
        <PageBanner title={`Секція №${sectionId}`} />
        <div className="mx-auto max-w-[1100px] px-[3.5%] py-8">
          <Skeleton className="mb-6 h-24 w-full" />
          <Skeleton className="aspect-[3/2] w-full" />
        </div>
      </>
    );
  }

  if (error || !section || !plan) {
    return (
      <>
        <Seo title={`Секція №${sectionId}`} noindex={!error} />
        <PageBanner title={`Секція №${sectionId}`} />
        <div className="px-[5%] py-16 text-center text-ink">
          <p className="mb-6">
            {error
              ? "Не вдалося завантажити дані секції. Спробуйте пізніше."
              : "Планування цієї секції поки що недоступне."}
          </p>
          <Link className="font-semibold text-brand-dark underline" to="/apartments">
            ← До вибору секції
          </Link>
        </div>
      </>
    );
  }

  const { apartments, floors, price, status } = section;
  const unitsOnFloor = (value) =>
    apartments.flatMap(({ units }) => units.filter(({ floor }) => floor === value));
  // поки каталог не завантажився, рахуємо всі вільні квартири
  const matchesCatalog = (unit) =>
    unit.available && (!loaded || matching.some(({ id }) => id === unit.id));
  const freeCount = (value) => unitsOnFloor(value).filter(matchesCatalog).length;

  const floorNumbers = Array.from({ length: floors }, (_, index) => floors - index);
  const requestedFloor = Number(searchParams.get("floor"));
  // без поверху в адресі відкриваємо найнижчий, де є вільні квартири
  const floor = floorNumbers.includes(requestedFloor)
    ? requestedFloor
    : (floorNumbers.toReversed().find((value) => freeCount(value) > 0) ?? 1);

  const selected = apartments.find(({ id }) => String(id) === selectedId) ?? null;
  const unitOf = (apartment) => apartment.units.find((unit) => unit.floor === floor);
  const isMatch = (apartment) => {
    const unit = unitOf(apartment);
    return status === "SELLING" && Boolean(unit) && matchesCatalog(unit);
  };
  const isSold = (apartment) => unitOf(apartment)?.available === false;
  const chosen = selected && (isMatch(selected) || isSold(selected)) ? selected : null;
  // куди запропонувати перейти, якщо обрана квартира продана
  const freeFloors =
    status === "SELLING" && chosen
      ? chosen.units.filter(matchesCatalog).map((unit) => unit.floor)
      : [];
  const active = hovered ?? chosen;
  const hasMatches = apartments.some(isMatch);
  // порожній поверх не має бути глухим кутом: пропонуємо найближчий із вільними квартирами
  const nearestFloor = floorNumbers
    .filter((value) => value !== floor && freeCount(value) > 0)
    .toSorted((a, b) => Math.abs(a - floor) - Math.abs(b - floor))[0];

  const selectApartment = (apartment) => {
    // блок змінює висоту разом із квартирою, тому міряємо його вже з новим вмістом
    flushSync(() => setSelectedId(String(apartment.id)));
    setSearchParams({ floor, apt: apartment.id }, { replace: true });

    // інформація над планом: якщо її вже прокрутили, повертаємо до неї; вищий за екран блок — від його верху
    const { top, height } = infoRef.current.getBoundingClientRect();
    if (top < HEADER_OFFSET) {
      infoRef.current.scrollIntoView({
        behavior: scrollMotion(),
        block: height < window.innerHeight - HEADER_OFFSET ? "center" : "start",
      });
    }
  };

  const selectFloor = (value) =>
    setSearchParams(selectedId ? { floor: value, apt: selectedId } : { floor: value }, { replace: true });

  const updateCursor = (event) => setCursor(mapPointer(event, mapRef.current));

  const zoneLabel = (apartment) =>
    `${roomsLabel(apartment)} квартира, ${apartment.area} м², ${
      isSold(apartment) ? "продана" : `${formatPrice(apartment.area * price)} $`
    }`;

  return (
    <>
      <Seo
        title={`Секція №${sectionId}: планування`}
        description={`Планування секції №${sectionId} ЖК «Senator»: вільні квартири, площа й вартість за поверхами.`}
      />
      <PageBanner title={`Секція №${sectionId}`} />

      <section className="bg-white px-[3.5%] py-8 text-ink">
        <Link className="mb-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand-dark" to="/apartments">
          ← До вибору секції
        </Link>

        <div className="mx-auto max-w-[1100px]">
          <ApartmentFilters className="mb-6" />

          <div ref={infoRef} aria-live="polite" className="relative mb-6 rounded-md bg-surface p-5">
            {chosen && isSold(chosen) ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold">{roomsLabel(chosen)} квартира</h2>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                    Продано
                  </span>
                </div>
                <p className="mt-1">Поверх: {floor}</p>
                <p>Площа: {chosen.area} м²</p>
                {freeFloors.length > 0 ? (
                  <div className="mt-3">
                    <p>Ця квартира вже продана, але таке саме планування вільне на поверхах:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {freeFloors.map((value) => (
                        <Button key={value} variant="outline" className="h-11 px-4" onClick={() => selectFloor(value)}>
                          {value} поверх
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-3">Ця квартира вже продана. Вільних квартир із таким плануванням немає.</p>
                )}
              </>
            ) : chosen ? (
              <>
                <h2 className="text-lg font-bold">{roomsLabel(chosen)} квартира</h2>
                <p className="mt-1">Поверх: {floor}</p>
                <p>Площа: {chosen.area} м²</p>
                <p>
                  Вартість: <strong>{formatPrice(chosen.area * price)} $</strong> (
                  {formatPrice(price)} $/м²)
                </p>
                <Button
                  variant="gold"
                  size="xl"
                  className="mt-4"
                  onClick={() => openLeadModal(leadComment(sectionId, floor, chosen))}
                >
                  Залишити заявку на цю квартиру
                </Button>
              </>
            ) : status !== "SELLING" ? (
              <p>Статус секції: {sectionStatuses[status].label}.</p>
            ) : !hasMatches ? (
              <>
                <p>
                  На {floor} поверсі немає вільних квартир
                  {hasActiveFilters(filters) && " за обраними фільтрами"}.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {nearestFloor && (
                    <Button variant="gold" className="h-11 px-4" onClick={() => selectFloor(nearestFloor)}>
                      Перейти на {nearestFloor} поверх
                    </Button>
                  )}
                  {hasActiveFilters(filters) && (
                    <Button variant="outline" className="h-11 px-4" onClick={filters.resetFilters}>
                      Скинути фільтри
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p>Оберіть квартиру на плані, щоб побачити площу та вартість.</p>
            )}
            <p className={cn("mt-3 text-sm text-ink/80", chosen && "pr-14 max-md:mt-5")}>Такий план на всіх поверхах секції.</p>
            {chosen && (
              <ShareButton
                url={`${window.location.origin}/apartments/${sectionId}?floor=${floor}&apt=${chosen.id}`}
                title={`${roomsLabel(chosen)} квартира, ${chosen.area} м², ЖК «Senator»`}
                label="Поділитися квартирою"
                className="absolute right-3 bottom-3"
              />
            )}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            {status === "SELLING" && (
              <FloorPicker
                floors={floorNumbers}
                current={floor}
                freeCount={freeCount}
                onSelect={selectFloor}
              />
            )}

            <div
              className={cn(mapClass, "min-w-0 flex-1")}
              ref={mapRef}
              onPointerMove={updateCursor}
              onPointerLeave={() => setHovered(null)}
            >
              <img
                src={plan.src}
                alt={`Планування секції №${sectionId}`}
                fetchPriority="high"
                width={plan.width}
                height={plan.height}
                className={mapImageClass}
                draggable="false"
              />

              <svg
                className={mapSvgClass}
                viewBox={`0 0 ${plan.width} ${plan.height}`}
                role="group"
                aria-label="Квартири"
              >
                {apartments.map((apartment) => {
                  const sold = isSold(apartment);
                  const match = isMatch(apartment);

                  return (
                    <MapZone
                      key={apartment.id}
                      label={zoneLabel(apartment)}
                      points={apartment.points}
                      pressed={chosen?.id === apartment.id}
                      className={mapZoneClass({
                        active: active?.id === apartment.id,
                        tint: sold
                          ? "fill-black/55"
                          : match
                            ? "stroke-status-selling-strong"
                            : "fill-white/70",
                        disabled: !match && !sold,
                        sold,
                      })}
                      onSelect={match || sold ? () => selectApartment(apartment) : undefined}
                      onPreview={(event) => {
                        updateCursor(event);
                        setHovered(apartment);
                      }}
                      onPreviewEnd={() => setHovered(null)}
                    />
                  );
                })}
              </svg>

              {apartments.filter(isSold).map((apartment) => {
                const { x, y } = mapPolygonCenter(apartment.points);

                return (
                  <span
                    key={apartment.id}
                    aria-hidden="true"
                    className="pointer-events-none absolute z-1 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-status-sold-strong px-1.5 py-0.5 text-[10px] leading-none font-bold text-white shadow-card md:text-xs"
                    style={{ left: `${(x / plan.width) * 100}%`, top: `${(y / plan.height) * 100}%` }}
                  >
                    Продано
                  </span>
                );
              })}

              {hovered && (
                <div className={mapTooltipClass} style={mapTooltipStyle(cursor)}>
                  <strong>{roomsLabel(hovered)} квартира</strong>
                  <p>Поверх: {floor}</p>
                  <p>Площа: {hovered.area} м²</p>
                  {isSold(hovered) ? (
                    <p>Продано</p>
                  ) : (
                    <p>Вартість: {formatPrice(hovered.area * price)} $</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-700">
            {legend.map(({ label, className }) => (
              <li key={label} className="flex items-center gap-2">
                <span className={cn("inline-block size-4 rounded-sm", className)} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Section;
