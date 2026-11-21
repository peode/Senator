import AdvantageIcon from "@/components/AdvantageIcon";
import { Section, SectionHeading, SectionLink } from "@/components/Section";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdvantages } from "@/stores/advantagesStore";
import { useSiteText } from "@/stores/siteTextsStore";

const CELL = "bg-white p-5 md:p-8 lg:p-10";

const Benefits = () => {
  const { advantages, loading } = useAdvantages("HOME");
  const t = useSiteText();

  if (!loading && advantages.length === 0) return null;

  return (
    <Section id="benefits" className="bg-surface">
      <SectionHeading title={t("benefits.title")}>
        <SectionLink to="/advantages">{t("benefits.link")}</SectionLink>
      </SectionHeading>

      <ul className="grid gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-card md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [1, 2, 3, 4, 5, 6].map((key) => (
              <li key={key} className={CELL}>
                <Skeleton className="mb-5 size-8" />
                <Skeleton className="h-6 w-3/5" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
              </li>
            ))
          : advantages.map(({ id, icon, title, text }) => (
              <li key={id} className={`grid grid-cols-[auto_1fr] gap-x-4 md:block ${CELL}`}>
                <AdvantageIcon
                  name={icon}
                  size={32}
                  strokeWidth={1.4}
                  className="text-brand-dark md:mb-5"
                />
                <div>
                  <h3 className="text-lg leading-snug font-bold md:text-xl">{title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-slate-600">{text}</p>
                </div>
              </li>
            ))}
      </ul>
    </Section>
  );
};

export default Benefits;
