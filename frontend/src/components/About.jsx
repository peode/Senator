import { useState } from "react";
import {
  Baby,
  ChevronLeft,
  ChevronRight,
  Coffee,
  MousePointerClick,
  ShoppingBasket,
  Trees,
  Mail,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";
import { useSiteImage } from "@/stores/siteImagesStore";
import { useSiteText } from "@/stores/siteTextsStore";

const amenities = [
  { id: "playground", icon: Baby, image: "playground" },
  { id: "cafe", icon: Coffee, image: "cafe" },
  { id: "supermarket", icon: ShoppingBasket, image: "supermarket" },
  { id: "walking", icon: Trees, image: "walkingZone" },
  { id: "post", icon: Mail, image: "postOffice" },
  { id: "beauty", icon: Scissors, image: "beautySalon" },
];

const ARROW_BUTTON =
  "flex size-11 cursor-pointer items-center justify-center rounded-full bg-white text-ink shadow-card transition-colors outline-none hover:bg-gold focus-visible:ring-3 focus-visible:ring-gold/60";

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const siteImage = useSiteImage();
  const t = useSiteText();
  const activeAmenity = amenities[activeIndex];
  const activeTitle = t(`amenity.${activeAmenity.id}.title`);

  const step = (delta) =>
    setActiveIndex((index) => (index + delta + amenities.length) % amenities.length);

  return (
    <Section id="about" className="bg-ink text-white">
      <SectionHeading title={t("amenities.title")}>
        <SectionSubtitle className="text-white/70">
          {t("amenities.subtitle")}
        </SectionSubtitle>
      </SectionHeading>

      <div className="relative h-[300px] overflow-hidden rounded-2xl bg-white/5 sm:h-[380px] lg:h-[520px]">
        <img
          src={siteImage(activeAmenity.image)}
          alt={activeTitle}
          className="absolute inset-0 size-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-b from-transparent via-black/60 via-40% to-black/85 px-4 pt-16 pb-4 sm:px-7 sm:pb-6">
          <div className="min-w-0">
            <h3 className="text-[19px] leading-tight font-bold sm:text-2xl">
              {activeTitle}
            </h3>
            <p className="mt-1.5 text-sm leading-normal text-white/85 sm:text-base">
              {t(`amenity.${activeAmenity.id}.text`)}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              className={ARROW_BUTTON}
              onClick={() => step(-1)}
              aria-label="Попереднє фото"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className={ARROW_BUTTON}
              onClick={() => step(1)}
              aria-label="Наступне фото"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 mb-3 flex items-center gap-2 text-sm font-medium text-white/70 md:mt-8">
        <MousePointerClick size={18} className="shrink-0 text-gold" />
        {t("amenities.hint")}
      </p>

      <ul className="grid grid-cols-3 gap-2.5 md:gap-4 lg:grid-cols-6">
        {amenities.map((amenity, index) => {
          const Icon = amenity.icon;
          const isActive = index === activeIndex;

          return (
            <li key={amenity.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                className={cn(
                  "group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl text-left text-ink transition-all outline-none focus-visible:ring-3 focus-visible:ring-gold/60 active:translate-y-px",
                  isActive ? "bg-gold ring-3 ring-gold" : "bg-white hover:-translate-y-1 hover:bg-gold-soft"
                )}
              >
                <span className="block aspect-[3/2] overflow-hidden">
                  <img
                    src={siteImage(amenity.image)}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-1 items-center gap-2 px-2 py-2 text-xs leading-tight font-bold sm:px-3 sm:py-2.5 sm:text-sm">
                  <Icon size={18} strokeWidth={1.75} className="hidden shrink-0 sm:block" />
                  {t(`amenity.${amenity.id}.title`)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default About;
