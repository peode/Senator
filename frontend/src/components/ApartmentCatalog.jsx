import { useState } from "react";
import { Link } from "react-router-dom";
import ApartmentFilters from "@/components/ApartmentFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, roomsLabel } from "@/data/sections";
import { useApartments, useApartmentsStore } from "@/stores/apartmentsStore";
import { hasActiveFilters, useApartmentFiltersStore } from "@/stores/apartmentFiltersStore";

const PAGE_SIZE = 12;

// API віддає кожну квартиру окремо, а покупець обирає планування: групуємо за ним
const groupByLayout = (units) => {
  const layouts = new Map();

  for (const unit of units) {
    const layout = layouts.get(unit.apartmentId);
    if (layout) layout.floors.push(unit.floor);
    else layouts.set(unit.apartmentId, { ...unit, floors: [unit.floor] });
  }

  return [...layouts.values()];
};

const floorsLabel = (floors) => {
  const lowest = Math.min(...floors);
  const highest = Math.max(...floors);
  return lowest === highest ? `${lowest} поверх` : `Поверхи ${lowest}–${highest}`;
};

const LayoutCard = ({ layout }) => (
  <Link
    to={`/apartments/${layout.sectionId}?floor=${Math.min(...layout.floors)}&apt=${layout.apartmentId}`}
    className="flex h-full flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-card transition-colors hover:border-brand-dark"
  >
    <span className="text-[13px] font-medium text-slate-600">Секція №{layout.sectionId}</span>
    <span className="text-lg font-bold">
      {roomsLabel(layout)}, {layout.area} м²
    </span>
    <span className="text-lg font-bold text-brand-dark">{formatPrice(layout.totalPrice)} $</span>
    <span className="mt-1 text-[13px] text-slate-600">
      {floorsLabel(layout.floors)}, вільних квартир: {layout.floors.length}
    </span>
  </Link>
);

const ApartmentCatalog = () => {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const { apartments, loaded, error } = useApartments();
  const fetchApartments = useApartmentsStore((state) => state.fetchApartments);
  const filters = useApartmentFiltersStore();
  const layouts = groupByLayout(apartments);

  return (
    <section id="catalog" className="bg-surface px-[5%] py-8 text-ink md:px-[3.5%] md:py-12">
      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <h2 className="text-2xl font-extrabold">Вільні квартири</h2>
        <ApartmentFilters />
        {loaded && (
          <p role="status" className="text-sm text-slate-600">
            Планувань: {layouts.length}, квартир: {apartments.length}
          </p>
        )}
      </div>

      {error && !loaded ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-slate-600">Не вдалося завантажити квартири.</p>
          <Button variant="gold" size="xl" onClick={() => fetchApartments({ force: true })}>
            Спробувати ще раз
          </Button>
        </div>
      ) : !loaded ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((key) => (
            <Skeleton key={key} className="h-[132px] rounded-xl" />
          ))}
        </div>
      ) : layouts.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-slate-600">За цими параметрами вільних квартир немає.</p>
          {hasActiveFilters(filters) && (
            <Button variant="gold" size="xl" onClick={filters.resetFilters}>
              Скинути фільтри
            </Button>
          )}
        </div>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {layouts.slice(0, visible).map((layout) => (
              <li key={layout.apartmentId}>
                <LayoutCard layout={layout} />
              </li>
            ))}
          </ul>

          {layouts.length > visible && (
            <Button
              variant="outline"
              size="xl"
              className="mt-5"
              onClick={() => setVisible(visible + PAGE_SIZE)}
            >
              Показати ще
            </Button>
          )}
        </>
      )}
    </section>
  );
};

export default ApartmentCatalog;
