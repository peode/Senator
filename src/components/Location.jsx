import {
  MapPin,
  GraduationCap,
  Hospital,
  ShoppingBag,
  TreePine,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";

const places = [
  { icon: GraduationCap, title: "Школи №11 і №42", distance: "≈ 10 хв пішки" },
  { icon: ShoppingBag, title: "Супермаркети та ТРЦ «Екватор»", distance: "≈ 10 хв пішки" },
  { icon: Hospital, title: "Міська клінічна лікарня №1", distance: "≈ 5 хв авто" },
  { icon: TreePine, title: "Озеро та лісопарк", distance: "поруч" },
  { icon: MapPin, title: "Центр міста", distance: "≈ 15 хв авто" },
];

const mapSrc =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("Чернівці, вулиця Руська, 236Б") +
  "&output=embed";

const Location = () => {
  return (
    <Section id="location">
      <SectionHeading title="РОЗТАШУВАННЯ">
        <SectionSubtitle>м. Чернівці, вул. Руська, 236Б</SectionSubtitle>
      </SectionHeading>

      <div className="grid gap-[30px] lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.4fr)]">
        <ul className="flex flex-col gap-3">
          {places.map(({ icon: Icon, title, distance }) => (
            <li key={title} className="contents">
              <Card className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-0 rounded-xl bg-surface px-5 py-[18px] ring-0">
                <Icon size={26} strokeWidth={1.5} className="row-span-2 text-brand" />
                <span className="text-base font-bold">{title}</span>
                <span className="text-sm text-slate-500">{distance}</span>
              </Card>
            </li>
          ))}
        </ul>

        <div className="min-h-[320px] overflow-hidden rounded-2xl bg-slate-200 md:min-h-[420px]">
          <iframe
            title="Розташування ЖК Senator на карті"
            src={mapSrc}
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
