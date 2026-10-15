import { useState } from "react";
import {
  Baby,
  Coffee,
  ShoppingBasket,
  Trees,
  Mail,
  Scissors,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";

import playground from "@/assets/images/playground.png";
import cafe from "@/assets/images/cafe.png";
import supermarket from "@/assets/images/supermarket.png";
import walkingZone from "@/assets/images/walking-zone.png";
import postOffice from "@/assets/images/post-office.png";
import beautySalon from "@/assets/images/beauty-salon.png";

const amenities = [
  {
    id: "playground",
    title: "Дитячий майданчик",
    icon: Baby,
    image: playground,
    description: "Простір для ігор та дитячих пригод.",
  },
  {
    id: "cafe",
    title: "Кав'ярня",
    icon: Coffee,
    image: cafe,
    description: "Улюблена кава зовсім поруч із домом.",
  },
  {
    id: "supermarket",
    title: "Супермаркет",
    icon: ShoppingBasket,
    image: supermarket,
    description: "Усе необхідне для щоденних покупок.",
  },
  {
    id: "walking",
    title: "Прогулянкова зона",
    icon: Trees,
    image: walkingZone,
    description: "Зелений простір для відпочинку на свіжому повітрі.",
  },
  {
    id: "post",
    title: "Поштове відділення",
    icon: Mail,
    image: postOffice,
    description: "Зручно отримувати та відправляти посилки.",
  },
  {
    id: "beauty",
    title: "Салон краси",
    icon: Scissors,
    image: beautySalon,
    description: "Турбота про себе неподалік від дому.",
  },
];

const About = () => {
  const [activeAmenity, setActiveAmenity] = useState(amenities[0]);

  return (
    <Section id="about">
      <SectionHeading title="ТУТ ПЕРЕДБАЧЕНО">
        <SectionSubtitle>Все, що потрібне для комфортного життя!</SectionSubtitle>
      </SectionHeading>

      <div className="grid items-stretch gap-5 md:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)] lg:grid-cols-[minmax(340px,0.72fr)_minmax(0,2fr)]">
        <div className="grid grid-cols-2 grid-rows-3 gap-2.5">
          {amenities.map((amenity) => {
            const Icon = amenity.icon;
            const isActive = activeAmenity.id === amenity.id;

            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => setActiveAmenity(amenity)}
                aria-pressed={isActive}
                className={cn(
                  "relative flex min-h-[110px] min-w-0 cursor-pointer flex-col items-start justify-center gap-3.5 rounded-2xl p-3.5 text-left text-neutral-900 transition-colors min-[421px]:min-h-[120px] min-[421px]:p-[18px] lg:min-h-[155px] lg:gap-6 lg:px-6 lg:py-[25px]",
                  isActive ? "bg-gold-active" : "bg-gold-soft hover:bg-amber-200"
                )}
              >
                <Icon
                  strokeWidth={1.5}
                  className="size-8 shrink-0 lg:size-[39px]"
                />

                <span className="max-w-[150px] text-[13px] leading-[1.4] font-bold min-[421px]:text-sm lg:text-base">
                  {amenity.title}
                </span>

                {isActive && (
                  <ArrowRight
                    size={22}
                    className="absolute right-2 bottom-2.5 w-[17px] min-[421px]:right-4 min-[421px]:bottom-[22px] min-[421px]:w-auto"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[300px] min-w-0 overflow-hidden rounded-2xl bg-neutral-100 md:min-h-[400px] lg:min-h-[465px]">
          <img
            key={activeAmenity.id}
            src={activeAmenity.image}
            alt={activeAmenity.title}
            className="block size-full max-h-[430px] min-h-[300px] animate-in object-cover fade-in duration-300 md:max-h-none md:min-h-[400px] lg:min-h-[465px]"
          />

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-black/70 px-[18px] pt-10 pb-[18px] text-white min-[421px]:px-[30px] min-[421px]:pt-[50px] min-[421px]:pb-[25px]">
            <span className="text-[19px] font-bold min-[421px]:text-[22px]">
              {activeAmenity.title}
            </span>
            <p className="mt-2 text-sm leading-normal">
              {activeAmenity.description}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
