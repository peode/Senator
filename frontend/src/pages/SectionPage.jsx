import { useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import ApartmentFilters from "@/components/ApartmentFilters";
import FloorPicker from "@/components/FloorPicker";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, leadComment, plans, roomsLabel, sectionStatuses } from "@/data/sections";
import { useApartments } from "@/stores/apartmentsStore";
import { useLeadModalStore } from "@/stores/leadModalStore";
import { useSections } from "@/stores/sectionsStore";
import {
  mapClass,
  mapImageClass,
  mapSvgClass,
  mapTooltipClass,
  mapZoneClass,
} from "@/lib/mapClasses";
import { cn } from "@/lib/utils";

const Section = () => {
  const { sectionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const mapRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const { sections, loading, error } = useSections();
  const { apartments: matching, loaded } = useApartments();
  const openLeadModal = useLeadModalStore((state) => state.open);

  const section = sections.find(({ id }) => String(id) === sectionId);
  const plan = plans[sectionId];

  if (loading) {
    return (
      <>
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

  const unitOf = (apartment) => apartment.units.find((unit) => unit.floor === floor);
  const isMatch = (apartment) => {
    const unit = unitOf(apartment);
    return status === "SELLING" && Boolean(unit) && matchesCatalog(unit);
  };
  const isSold = (apartment) => unitOf(apartment)?.available === false;
  const chosen = selected && isMatch(selected) ? selected : null;
  const active = hovered ?? chosen;
  const hasMatches = apartments.some(isMatch);

  const updateCursor = (event) => {
    const rect = mapRef.current.getBoundingClientRect();
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <>
      <PageBanner
        title={`Секція №${sectionId}`}
        subtitle="Такий план на всіх поверхах секції"
      />

      <section className="bg-white px-[3.5%] py-8 text-ink">
        <Link className="mb-5 inline-block text-sm font-semibold text-brand-dark" to="/apartments">
          ← До вибору секції
        </Link>

        <div className="mx-auto max-w-[1100px]">
          <ApartmentFilters className="mb-6" />

          <div className="mb-6 rounded-md bg-surface p-5">
            {chosen ? (
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
              <p>На {floor} поверсі немає вільних квартир за обраними фільтрами.</p>
            ) : (
              <p>Наведіть або оберіть квартиру на плані, щоб побачити площу та вартість.</p>
            )}
            <p className="mt-3 text-sm text-ink/70">
              Такий план на всіх поверхах секції, затемнені квартири продані або не підходять під фільтри. Для більш детальної інформації зверніться до
              менеджера.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            {status === "SELLING" && (
              <FloorPicker
                floors={floorNumbers}
                current={floor}
                freeCount={freeCount}
                onSelect={(value) => setSearchParams({ floor: value }, { replace: true })}
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
                className={mapImageClass}
                draggable="false"
              />

              <svg
                className={mapSvgClass}
                viewBox={`0 0 ${plan.width} ${plan.height}`}
                aria-label="Квартири"
              >
                {apartments.map((apartment) => (
                  <polygon
                    key={apartment.id}
                    className={mapZoneClass({
                      active: active?.id === apartment.id,
                      dimmed: !isMatch(apartment),
                      disabled: !isMatch(apartment) && !isSold(apartment),
                      sold: isSold(apartment),
                    })}
                    points={apartment.points.map((point) => point.join(",")).join(" ")}
                    onPointerEnter={(event) => {
                      updateCursor(event);
                      setHovered(apartment);
                    }}
                    onPointerLeave={() => setHovered(null)}
                    onClick={() => isMatch(apartment) && setSelected(apartment)}
                  />
                ))}
              </svg>

              {hovered && (
                <div className={mapTooltipClass} style={{ left: cursor.x, top: cursor.y }}>
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

        </div>
      </section>
    </>
  );
};

export default Section;
