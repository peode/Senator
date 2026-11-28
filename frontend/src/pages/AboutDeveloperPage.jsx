import {
  ArrowUpRight,
  Building2,
  Layers,
  ShieldCheck,
  SquareParking,
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import Seo from "@/components/Seo";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteImage } from "@/stores/siteImagesStore";
import { useSiteText } from "@/stores/siteTextsStore";
import { SocialIcon } from "@/components/SocialIcons";
import { socialLabels } from "@/data/socials";
import { useSettings } from "@/stores/settingsStore";

const companyFacts = ["fact1", "fact2", "fact3", "fact4"];

const projectFacts = [
  { icon: Building2, key: "project1" },
  { icon: Layers, key: "project2" },
  { icon: ShieldCheck, key: "project3" },
  { icon: SquareParking, key: "project4" },
];

const AboutDeveloper = () => {
  const siteImage = useSiteImage();
  const t = useSiteText();
  const { socials } = useSettings();

  return (
    <>
      <Seo title="Про забудовника" description="Забудовник ЖК «Senator» у Чернівцях: про компанію, проєкт і соціальні мережі." />
      <PageBanner title={t("developer.banner")} subtitle={t("developer.subtitle")} />

      <Section>
        <SectionHeading title={t("developer.title")} />

        <div className="grid items-center gap-8 md:gap-[60px] lg:grid-cols-2">
          <div className="space-y-5 text-base leading-[1.8] text-slate-700 md:text-[17px]">
            <p className="text-[clamp(19px,1.7vw,24px)] leading-normal font-semibold text-ink">
              {t("developer.lead")}
            </p>
            <p>{t("developer.text")}</p>

            <dl className="grid gap-x-8 gap-y-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
              {companyFacts.map((key) => (
                <div key={key}>
                  <dt className="text-sm text-slate-500">{t(`developer.${key}.label`)}</dt>
                  <dd className="text-base font-semibold text-ink">{t(`developer.${key}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <img
            src={siteImage("developer")}
            alt="ЖК Senator"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading title={t("developer.projectTitle")} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projectFacts.map(({ icon: Icon, key }) => (
            <Card
              key={key}
              className="gap-0 rounded-2xl py-8 shadow-card ring-0"
            >
              <CardHeader className="gap-0">
                <span className="mb-5 inline-flex size-[58px] items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <CardTitle className="mb-2.5 text-xl font-bold">{t(`developer.${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent className="text-[15px] leading-[1.65] text-slate-600">
                {t(`developer.${key}.text`)}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title={t("developer.socialTitle")}>
          <SectionSubtitle>{t("developer.socialSubtitle")}</SectionSubtitle>
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
                  <span className="block text-sm text-slate-600">
                    {t(`developer.social.${key}`)}
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
