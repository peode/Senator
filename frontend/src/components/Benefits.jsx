import {
  ShieldCheck,
  Flame,
  CarFront,
  LayoutPanelTop,
  Siren,
  Store,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Закрита територія",
    text: "Двір без автомобілів і сторонніх людей — безпечно для дітей і спокійно для дорослих.",
  },
  {
    icon: Flame,
    title: "Індивідуальне опалення",
    text: "Власний двоконтурний котел у кожній квартирі: ви самі керуєте теплом і витратами.",
  },
  {
    icon: CarFront,
    title: "Підземний паркінг",
    text: "Дворівневий паркінг, з'єднаний із будинками ліфтами, та гостьова стоянка надворі.",
  },
  {
    icon: LayoutPanelTop,
    title: "Продумані планування",
    text: "Двостороння орієнтація, панорамні вікна, лоджії, гардеробні та дворівневі квартири.",
  },
  {
    icon: Siren,
    title: "Укриття",
    text: "У комплексі будується сучасне укриття для мешканців.",
  },
  {
    icon: Store,
    title: "Комерція на першому поверсі",
    text: "Магазини та сервіси на першому поверсі — усе потрібне поруч із домом.",
  },
];

const Benefits = () => {
  return (
    <Section id="benefits" className="bg-surface">
      <SectionHeading title="ПЕРЕВАГИ">
        <SectionSubtitle>Чому мешканці обирають «Senator»</SectionSubtitle>
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }) => (
          <Card
            key={title}
            className="gap-0 rounded-2xl px-1 py-8 shadow-card ring-0 transition hover:-translate-y-1 hover:shadow-card-hover"
          >
            <CardHeader className="gap-0">
              <span className="mb-5 inline-flex size-[58px] items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <Icon size={28} strokeWidth={1.5} />
              </span>
              <CardTitle className="mb-2.5 text-xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-[15px] leading-[1.65] text-slate-600">
                {text}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default Benefits;
