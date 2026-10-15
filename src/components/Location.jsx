import { useState } from "react";
import {
  Ambulance,
  Drama,
  School,
  ShoppingBag,
  ShoppingBasket,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";

const ADDRESS = "Чернівці, вулиця Руська, 236Б";

// query — що шукати на карті поруч із ЖК, mode: "w" — пішки, "d" — авто
const places = [
  { id: "school", icon: School, title: "Школи №42", distance: "≈ 10 хв пішки", mode: "w", query: "Загальноосвітня школа №42" },
  { id: "shop", icon: ShoppingBag, title: "ТРЦ «Екватор»", distance: "≈ 10 хв пішки", mode: "w", query: "Велмарт" },
  { id: "hospital", icon: Ambulance, title: "Чернівецька лікарня швидкої медичної допомоги", distance: "≈ 5 хв авто", mode: "d", query: "Чернівецька лікарня швидкої медичної допомоги" },
  { id: "park", icon: ShoppingBasket, title: "АТБ-Маркет", distance: "поруч", mode: "w", query: "АТБ-Маркет" },
  { id: "center", icon: Drama, title: "Центр міста", distance: "≈ 15 хв авто", mode: "d", query: "Чернівецький академічний обласний український музично-драматичний театр ім. Ольги Кобилянської" },
];

// З вибраним місцем показуємо маршрут від ЖК — так на карті видно обидві точки
const getMapSrc = (place) => {
  if (!place) {
    return `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
  }

  const params = new URLSearchParams({
    saddr: ADDRESS,
    daddr: `${place.query} near ${ADDRESS}`,
    dirflg: place.mode,
    output: "embed",
  });

  return `https://www.google.com/maps?${params}`;
};

const Location = () => {
  const [activePlace, setActivePlace] = useState(null);

  return (
    <Section id="location">
      <SectionHeading title="РОЗТАШУВАННЯ">
        <SectionSubtitle>м. Чернівці, вул. Руська, 236Б</SectionSubtitle>
      </SectionHeading>

      <div className="grid gap-[30px] lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.4fr)]">
        <ul className="flex flex-col gap-3">
          {places.map((place) => {
            const { id, icon: Icon, title, distance } = place;
            const isActive = activePlace?.id === id;

            return (
              <li key={id} className="contents">
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActivePlace(isActive ? null : place)}
                  className="cursor-pointer text-left"
                >
                  <Card
                    className={cn(
                      "grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-0 rounded-xl px-5 py-[18px] ring-0 transition-colors",
                      isActive ? "bg-brand/15 ring-2 ring-brand" : "bg-surface hover:bg-brand/10"
                    )}
                  >
                    <Icon size={26} strokeWidth={1.5} className="row-span-2 text-brand" />
                    <span className="text-base font-bold">{title}</span>
                    <span className="text-sm text-slate-500">{distance}</span>
                  </Card>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="min-h-[320px] overflow-hidden rounded-2xl bg-slate-200 md:min-h-[420px]">
          <iframe
            title={
              activePlace
                ? `${activePlace.title} на карті`
                : "Розташування ЖК Senator на карті"
            }
            src={getMapSrc(activePlace)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block size-full min-h-[320px] border-0 md:min-h-[420px]"
          />
        </div>
      </div>
    </Section>
  );
};

export default Location;
