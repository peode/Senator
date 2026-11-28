import { useRef, useState } from "react";
import {
  Ambulance,
  Check,
  Drama,
  MapPin,
  MousePointerClick,
  School,
  ShoppingBag,
  ShoppingBasket,
  X,
} from "lucide-react";
import { cn, scrollMotion } from "@/lib/utils";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";
import { useSettings } from "@/stores/settingsStore";
import { useSiteText } from "@/stores/siteTextsStore";

// query — що шукати на карті поруч із ЖК, mode: "w" — пішки, "d" — авто,
// destination — точні координати, якщо пошук за назвою знаходить не ту точку
const places = [
  { id: "school", icon: School, mode: "w", query: "Загальноосвітня школа №42" },
  { id: "mall", icon: ShoppingBag, mode: "w", query: "Велмарт" },
  { id: "hospital", icon: Ambulance, mode: "d", query: "Чернівецька лікарня швидкої медичної допомоги" },
  { id: "atb", icon: ShoppingBasket, mode: "d", query: "АТБ-Маркет", destination: "48.2683082,26.0017738" },
  { id: "center", icon: Drama, mode: "d", query: "Чернівецький академічний обласний український музично-драматичний театр ім. Ольги Кобилянської" },
];

// З вибраним місцем показуємо маршрут від ЖК — так на карті видно обидві точки
const getMapSrc = (address, place) => {
  if (!place) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }

  const params = new URLSearchParams({
    saddr: address,
    daddr: place.destination ?? `${place.query} near ${address}`,
    dirflg: place.mode,
    output: "embed",
  });

  return `https://www.google.com/maps?${params}`;
};

const Location = () => {
  const [activePlace, setActivePlace] = useState(null);
  const mapRef = useRef(null);
  const { address } = useSettings();
  const t = useSiteText();
  const activeTitle = activePlace && t(`location.${activePlace.id}.title`);

  const selectPlace = (place) => {
    setActivePlace(place);

    // На телефоні карта під списком, тож показуємо її, щоб було видно результат натискання
    const map = mapRef.current;
    if (map.getBoundingClientRect().bottom > window.innerHeight) {
      map.scrollIntoView({ behavior: scrollMotion(), block: "center" });
    }
  };

  return (
    <Section id="location">
      <SectionHeading title={t("location.title")}>
        <SectionSubtitle>{t("location.subtitle")}</SectionSubtitle>
      </SectionHeading>

      <div className="grid gap-[30px] lg:grid-cols-[minmax(380px,0.8fr)_minmax(0,1.4fr)]">
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
            <MousePointerClick size={18} className="shrink-0 text-brand-dark" />
            {t("location.hint")}
          </p>

          <ul className="flex flex-col gap-3">
            {places.map((place) => {
              const { id, icon: Icon } = place;
              const isActive = activePlace?.id === id;

              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => selectPlace(isActive ? null : place)}
                    className={cn(
                      "group grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border p-3 text-left shadow-card transition-all active:translate-y-px md:gap-4 md:p-3.5",
                      isActive
                        ? "border-ink bg-ink text-white"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand hover:shadow-card-hover"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full",
                        isActive ? "bg-white/10 text-gold" : "bg-brand/15 text-brand-dark"
                      )}
                    >
                      <Icon size={22} strokeWidth={1.75} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[15px] leading-snug font-bold md:text-base">
                        {t(`location.${id}.title`)}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-sm",
                          isActive ? "text-white/70" : "text-slate-500"
                        )}
                      >
                        {t(`location.${id}.distance`)}
                      </span>
                    </span>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-bold transition-colors",
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-gold text-ink group-hover:bg-gold-hover"
                      )}
                    >
                      {isActive ? <Check size={16} /> : <MapPin size={16} />}
                      {t("location.button")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          ref={mapRef}
          className="flex min-h-[380px] flex-col overflow-hidden rounded-2xl bg-slate-200 shadow-card md:min-h-[480px]"
        >
          <div className="flex min-h-14 items-center gap-3 bg-ink px-4 py-2.5 text-sm text-white md:px-5">
            <MapPin size={18} className="shrink-0 text-gold" />
            <p className="min-w-0 flex-1 font-semibold">
              {activePlace
                ? `Маршрут: ${activeTitle}, ${t(`location.${activePlace.id}.distance`)}`
                : `ЖК «Senator», ${address}`}
            </p>
            {activePlace && (
              <button
                type="button"
                onClick={() => setActivePlace(null)}
                className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-white/10 px-3 font-semibold transition-colors hover:bg-white/20"
              >
                <X size={15} /> Скинути
              </button>
            )}
          </div>

          <iframe
            title={
              activePlace
                ? `${activeTitle} на карті`
                : "Розташування ЖК Senator на карті"
            }
            src={getMapSrc(address, activePlace)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block min-h-[320px] w-full flex-1 border-0"
          />
        </div>
      </div>
    </Section>
  );
};

export default Location;
