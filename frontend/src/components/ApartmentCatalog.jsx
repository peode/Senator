import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatPrice, leadComment, roomsLabel } from "@/data/sections";
import { useApartments } from "@/stores/apartmentsStore";
import { useLeadModalStore } from "@/stores/leadModalStore";

const ApartmentCatalog = () => {
  const { apartments, loaded, error } = useApartments();
  const openLeadModal = useLeadModalStore((state) => state.open);

  return (
    <section className="bg-white px-[3.5%] py-10 text-ink">
      <h2 className="mb-6 text-2xl font-bold">
        Каталог квартир{loaded && ` (${apartments.length})`}
      </h2>

      {error ? (
        <p className="text-slate-600">Не вдалося завантажити квартири. Перевірте значення фільтрів.</p>
      ) : loaded && apartments.length === 0 ? (
        <p className="text-slate-600">Немає квартир за обраними фільтрами.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {apartments.map((apartment) => (
            <article key={apartment.id} className="flex flex-col gap-1 rounded-2xl bg-surface p-5">
              <p className="text-xs font-bold tracking-wide text-brand-dark">
                Секція №{apartment.sectionId}
              </p>
              <h3 className="text-lg font-bold">{roomsLabel(apartment)} квартира</h3>
              <p>Площа: {apartment.area} м²</p>
              <p>
                Вартість: <strong>{formatPrice(apartment.totalPrice)} $</strong> (
                {formatPrice(apartment.pricePerMeter)} $/м²)
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Button
                  variant="gold"
                  onClick={() => openLeadModal(leadComment(apartment.sectionId, apartment))}
                >
                  Залишити заявку
                </Button>
                <Link
                  className="text-sm font-semibold text-brand-dark"
                  to={`/apartments/${apartment.sectionId}`}
                >
                  На плані →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ApartmentCatalog;
