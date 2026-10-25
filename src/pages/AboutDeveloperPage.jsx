import { Building2, HardHat, ShieldCheck, Handshake } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { Section, SectionHeading } from "@/components/Section";
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
      <SectionHeading title="МИ В СОЦМЕРЕЖАХ" />

      <div className="flex flex-wrap gap-4">
        {Object.entries(socials).map(([key, href]) => {
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-3 rounded-full border border-neutral-300 px-6 text-sm font-medium transition-colors hover:border-brand hover:text-brand-dark"
            >
              <SocialIcon name={key} size={18} />
              {socialLabels[key]}
            </a>
          );
        })}
      </div>
    </Section>
  </>
  );
};

export default AboutDeveloper;
