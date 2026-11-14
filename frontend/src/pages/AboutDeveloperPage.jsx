import {
  ArrowUpRight,
  Building2,
  Layers,
  ShieldCheck,
  SquareParking,
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import courtyard from "@/assets/images/courtyard.webp";
import { SocialIcon } from "@/components/SocialIcons";
import { socialLabels } from "@/data/socials";
import { useSettings } from "@/stores/settingsStore";

const companyFacts = [
  { label: "Компанія", value: "ТОВ «Буковинський квартал»" },
  { label: "Зареєстрована", value: "у 2016 році" },
  { label: "Діяльність", value: "Будівництво житлових і нежитлових будівель" },
  { label: "ЄДРПОУ", value: "40676338" },
];

const projectFacts = [
  {
    icon: Building2,
    title: "16 будинків",
    text: "ЖК «Senator» на вулиці Руській, 236Б будується чергами та об'єднує будинки в один квартал.",
  },
  {
    icon: Layers,
    title: "Монолітний каркас",
    text: "Будинки зводяться за монолітно-каркасною технологією, стіни — з керамоблоку.",
  },
  {
    icon: ShieldCheck,
    title: "Закрита територія",
    text: "Територія комплексу закрита для стороннього транспорту та відвідувачів.",
  },
  {
    icon: SquareParking,
    title: "Підземний паркінг",
    text: "У комплексі передбачено дворівневий підземний паркінг.",
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
      <PageBanner title="Про забудовника" subtitle="Буковинський квартал — Чернівці" />

      <Section>
        <SectionHeading title="БУКОВИНСЬКИЙ КВАРТАЛ" />

        <div className="grid items-center gap-8 md:gap-[60px] lg:grid-cols-2">
          <div className="space-y-5 text-base leading-[1.8] text-slate-700 md:text-[17px]">
            <p className="text-[clamp(19px,1.7vw,24px)] leading-normal font-semibold text-neutral-950">
              «Буковинський квартал» — чернівецька будівельна компанія, яка
              зводить житловий комплекс «Senator».
            </p>
            <p>
              Компанію зареєстровано в Чернівцях у 2016 році, її основна
              діяльність — будівництво житлових і нежитлових будівель.
              ЖК «Senator» на вулиці Руській, 236Б — її головний проєкт:
              квартал із 16 будинків, закритою територією та підземним
              паркінгом.
            </p>

            <dl className="grid gap-x-8 gap-y-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
              {companyFacts.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className="text-base font-semibold text-neutral-950">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <img
            src={courtyard}
            alt="ЖК Senator"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading title="ЩО МИ БУДУЄМО" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projectFacts.map(({ icon: Icon, title, text }) => (
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
