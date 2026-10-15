import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/Section";
import courtyard from "@/assets/images/courtyard.png";
import walkingZone from "@/assets/images/walking-zone.png";
import playground from "@/assets/images/playground.png";

// Тимчасові дані — замінити реальними новинами
const news = [
  {
    id: 1,
    date: "15.10.2026",
    title: "Тривають роботи над будинками першої черги",
    text: "Завершуємо фасадні роботи та підключення інженерних мереж.",
    image: courtyard,
  },
  {
    id: 2,
    date: "02.10.2026",
    title: "Благоустрій території: зелені зони та велодоріжки",
    text: "Розпочато планування внутрішнього двору з прогулянковою зоною.",
    image: walkingZone,
  },
  {
    id: 3,
    date: "20.09.2026",
    title: "Дитячий майданчик у закритому дворі",
    text: "Безпечний простір для ігор без автомобілів на території.",
    image: playground,
  },
];

const News = () => {
  return (
    <Section id="news" className="bg-surface">
      <SectionHeading title="НОВИНИ">
        <Button
          variant="link"
          className="h-auto gap-2 p-0 text-base font-bold text-neutral-950 hover:text-brand hover:no-underline"
          render={<Link to="/news" />}
          nativeButton={false}
        >
          Усі новини <ArrowRight size={18} />
        </Button>
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <Card
            key={item.id}
            className="group gap-0 rounded-2xl py-0 shadow-[0_6px_24px_rgb(12_27_34/7%)] ring-0"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="block size-full object-cover transition-transform duration-400 group-hover:scale-105"
              />
            </div>
            <CardHeader className="gap-2 px-6 pt-[22px]">
              <Badge
                variant="ghost"
                className="h-auto px-0 text-[13px] font-bold tracking-wide text-brand-dark"
                render={<time dateTime={item.date.split(".").reverse().join("-")} />}
              >
                {item.date}
              </Badge>
              <CardTitle className="text-[19px] leading-[1.35] font-bold">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pt-2.5 pb-7">
              <CardDescription className="text-[15px] leading-relaxed text-slate-600">
                {item.text}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default News;
