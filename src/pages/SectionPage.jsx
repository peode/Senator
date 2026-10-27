import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageBanner from "@/components/PageBanner";
import { formatPrice, getSection } from "@/data/sections";
import "@/components/HouseMap.css";

const rooms = (apartment) => `${apartment.rooms}-кімнатна`;

const Section = () => {
  const { sectionId } = useParams();
  const mapRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const section = getSection(sectionId);

  if (!section) {
    return (
      <>
        <PageBanner title={`Секція №${sectionId}`} />
        <div className="px-[5%] py-16 text-center text-ink">
          <p className="mb-6">Планування цієї секції поки що недоступне.</p>
          <Link className="font-semibold text-brand-dark underline" to="/apartments">
            ← До вибору секції
          </Link>
        </div>
      </>
    );
  }

  const { plan, apartments, price } = section;
  const active = hovered ?? selected;

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
          <div className="mb-6 rounded-md bg-surface p-5">
            {selected ? (
              <>
                <h2 className="text-lg font-bold">{rooms(selected)} квартира</h2>
                <p className="mt-1">Площа: {selected.area} м²</p>
                <p>
                  Вартість: <strong>{formatPrice(selected.area * price)} $</strong> (
                  {formatPrice(price)} $/м²)
                </p>
              </>
            ) : (
              <p>Наведіть або оберіть квартиру на плані, щоб побачити площу та вартість.</p>
            )}
            <p className="mt-3 text-sm text-ink/70">
              Такий план на всіх поверхах секції. Для більш детальної інформації зверніться до
              менеджера.
            </p>
          </div>
          <div
            className="house-map"
            ref={mapRef}
            onPointerMove={updateCursor}
            onPointerLeave={() => setHovered(null)}
          >
            <img
              src={plan.src}
              alt={`Планування секції №${sectionId}`}
              className="house-map-image"
              draggable="false"
            />

            <svg
              className="house-map-svg"
              viewBox={`0 0 ${plan.width} ${plan.height}`}
              aria-label="Квартири"
            >
              {apartments.map((apartment) => (
                <polygon
                  key={apartment.id}
                  className={`house-zone ${active?.id === apartment.id ? "house-zone-active" : ""}`}
                  points={apartment.points.map((point) => point.join(",")).join(" ")}
                  onPointerEnter={(event) => {
                    updateCursor(event);
                    setHovered(apartment);
                  }}
                  onPointerLeave={() => setHovered(null)}
                  onClick={() => setSelected(apartment)}
                />
              ))}
            </svg>

            {hovered && (
              <div className="house-tooltip" style={{ left: cursor.x, top: cursor.y }}>
                <strong>{rooms(hovered)} квартира</strong>
                <p>Площа: {hovered.area} м²</p>
                <p>Вартість: {formatPrice(hovered.area * price)} $</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default Section;
