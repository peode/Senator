import { Link } from "react-router-dom";
import { ArrowRight, Building2, CarFront, Ruler, CalendarCheck } from "lucide-react";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";
import { useSiteImage } from "@/stores/siteImagesStore";
import { useSiteText } from "@/stores/siteTextsStore";

const stats = [
  { icon: Building2, key: "overview.stat1" },
  { icon: CarFront, key: "overview.stat2" },
  { icon: Ruler, key: "overview.stat3" },
  { icon: CalendarCheck, key: "overview.stat4" },
];

const Overview = () => {
  const siteImage = useSiteImage();
  const t = useSiteText();

  return (
    <Section id="overview">
      <SectionHeading title={t("overview.title")}>
        <SectionSubtitle>{t("overview.subtitle")}</SectionSubtitle>
      </SectionHeading>

      <div className="grid items-center gap-8 md:gap-[60px] lg:grid-cols-2">
        <div className="space-y-[18px] text-[15px] leading-[1.75] text-slate-700 md:text-[17px]">
          <p className="text-[clamp(19px,1.7vw,24px)] leading-normal font-semibold text-neutral-950">
            {t("overview.lead")}
          </p>
          <p>{t("overview.text1")}</p>
          <p>{t("overview.text2")}</p>
        </div>

        <Link
          to="/apartments"
          className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-card-hover outline-none focus-visible:ring-3 focus-visible:ring-brand/50"
        >
          <img
            src={siteImage("overview")}
            alt="Вигляд на ЖК Senator згори"
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-3 text-sm font-bold text-ink shadow-card transition-colors group-hover:bg-gold-hover md:bottom-5 md:left-5 md:px-5">
            {t("overview.button")}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>

      <ul className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:mt-[60px] lg:grid-cols-4">
        {stats.map(({ icon: Icon, key }) => (
          <li
            key={key}
            className="flex flex-col gap-1 bg-ink px-4 py-5 text-white md:px-8 md:py-7"
          >
            <Icon size={26} strokeWidth={1.5} className="mb-2 text-gold" />
            <strong className="text-[clamp(28px,3vw,42px)] leading-[1.1] font-extrabold">
              {t(`${key}.value`)}
            </strong>
            <span className="text-sm text-white/70">{t(`${key}.label`)}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default Overview;
