import { Building2, CarFront, Ruler, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";
import courtyard from "@/assets/images/courtyard.png";

const stats = [
  { icon: Building2, value: "10", label: "поверхів у будинках" },
  { icon: CarFront, value: "2", label: "рівні підземного паркінгу" },
  { icon: Ruler, value: "2,8 м", label: "висота стель" },
  { icon: CalendarCheck, value: "2029", label: "завершення будівництва" },
];

const Overview = () => {
  return (
    <Section id="overview">
      <SectionHeading title="ПРО КОМПЛЕКС">
        <SectionSubtitle>ЖК «Senator» — будинок високого рангу</SectionSubtitle>
      </SectionHeading>

      <div className="grid items-center gap-8 md:gap-[60px] lg:grid-cols-2">
        <div className="space-y-[18px] text-[15px] leading-[1.75] text-slate-700 md:text-[17px]">
          <p className="text-[clamp(19px,1.7vw,24px)] leading-normal font-semibold text-neutral-950">
            «Senator» — сучасний житловий комплекс на вулиці Руській, 236Б
            у Чернівцях, створений для тих, хто цінує комфорт, безпеку
            та продумані рішення.
          </p>
          <p>
            Монолітно-каркасна технологія, індивідуальне опалення в кожній
            квартирі, закрита територія без автомобілів та власне укриття —
            усе для спокійного життя. На перших поверхах розміщені
            комерційні приміщення, тож щоденні потреби закриваються без
            виїзду з комплексу.
          </p>
          <p>
            Планування включають зручні квартири з панорамними вікнами,
            лоджіями та гардеробними, а також дворівневі квартири
            для найвибагливіших мешканців.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-[0_20px_45px_rgb(12_27_34/15%)]">
          <img
            src={courtyard}
            alt="Двір ЖК Senator"
            className="block max-h-[480px] min-h-[340px] w-full object-cover"
          />
        </div>
      </div>

      <ul className="mt-9 grid grid-cols-2 gap-3 md:mt-[60px] md:gap-5 lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <li key={label} className="contents">
            <Card className="gap-1.5 rounded-2xl border-0 px-4 py-[18px] shadow-card ring-0 md:px-6 md:py-[26px]">
              <CardContent className="flex flex-col gap-1.5">
                <Icon size={30} strokeWidth={1.5} className="mb-2 text-brand" />
                <strong className="text-[clamp(30px,3vw,42px)] leading-[1.1] font-extrabold">
                  {value}
                </strong>
                <span className="text-sm text-slate-500">{label}</span>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default Overview;
