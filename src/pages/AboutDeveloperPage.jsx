import {
  ArrowUpRight,
  Building2,
  HardHat,
  ShieldCheck,
  Handshake,
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import courtyard from "@/assets/images/courtyard.png";
import { SocialIcon } from "@/components/SocialIcons";
import { socialLabels } from "@/data/socials";
import { useSettings } from "@/lib/content";

// Тимчасові тексти — замінити реальною інформацією про забудовника
const values = [
  {
    icon: Building2,
    title: "Сучасні комплекси",
    text: "Будуємо житло в Чернівцях із продуманими плануваннями та впорядкованими дворами.",
  },
  {
    icon: HardHat,
    title: "Якість будівництва",
    text: "Контролюємо кожен етап: від фундаменту до оздоблення, використовуючи перевірені матеріали.",
  },
  {
    icon: ShieldCheck,
    title: "Надійність",
    text: "Працюємо прозоро й відповідально, дотримуючись домовленостей із покупцями.",
  },
  {
    icon: Handshake,
    title: "Турбота про мешканців",
    text: "Створюємо комфортне середовище: безпечні двори, паркінг та інфраструктуру поруч.",
  },
];

const socialHints = {
  facebook: "Новини та анонси",
  instagram: "Фото та відео з будівництва",
  youtube: "Відео про комплекс",
};

const AboutDeveloper = () => {
  const { socials } = useSettings();

  return (
    <>
      <PageBanner title="Про забудовника" subtitle="Смеречина — Чернівці" />

      <Section>
        <SectionHeading title="СМЕРЕЧИНА" />

        <div className="grid items-center gap-8 md:gap-[60px] lg:grid-cols-2">
          <div className="space-y-5 text-base leading-[1.8] text-slate-700 md:text-[17px]">
            <p className="text-[clamp(19px,1.7vw,24px)] leading-normal font-semibold text-neutral-950">
              Смеречина — забудовник із Чернівців, який створює житло для тих,
              хто цінує комфорт, безпеку та якість.
            </p>
            <p>
              ЖК «Senator» на вулиці Руській — наш проєкт, у якому поєднано
              сучасну архітектуру, продумані планування та закриту територію
              без автомобілів.
            </p>
            <p>
              Ми будуємо так, щоб мешканці відчували, що вони вдома, з першого
              дня: з інфраструктурою, паркінгом і зеленими просторами поруч.
            </p>
          </div>

          <img
            src={courtyard}
            alt="ЖК Senator"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading title="НАШІ ПРИНЦИПИ" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <Card
              key={title}
              className="gap-0 rounded-2xl py-8 shadow-card ring-0"
            >
              <CardHeader className="gap-0">
                <span className="mb-5 inline-flex size-[58px] items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <CardTitle className="mb-2.5 text-xl font-bold">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-[15px] leading-[1.65] text-slate-600">
                {text}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="МИ В СОЦМЕРЕЖАХ">
          <SectionSubtitle>Слідкуйте за ходом будівництва</SectionSubtitle>
        </SectionHeading>

        <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
          {Object.entries(socials).map(([key, href]) => (
            <li key={key} className="contents">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-5 rounded-2xl bg-surface p-6 transition-colors hover:bg-brand/10"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-card transition-colors group-hover:bg-brand group-hover:text-white">
                  <SocialIcon name={key} size={26} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold">
                    {socialLabels[key]}
                  </span>
                  <span className="block text-sm text-slate-500">
                    {socialHints[key]}
                  </span>
                </span>

                <ArrowUpRight
                  size={22}
                  className="shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-dark"
                />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
};

export default AboutDeveloper;
