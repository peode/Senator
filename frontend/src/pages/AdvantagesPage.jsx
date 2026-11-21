import { Link } from "react-router-dom";
import PageBanner from "@/components/PageBanner";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveImage } from "@/data/images";
import { useAdvantages, useAdvantagesStore } from "@/stores/advantagesStore";
import { useLeadModalStore } from "@/stores/leadModalStore";
import { useSiteText } from "@/stores/siteTextsStore";

const ADVANTAGE_ROW = "grid items-center gap-6 md:gap-10 lg:grid-cols-2 lg:gap-20";

const Advantages = () => {
  const openLeadModal = useLeadModalStore((state) => state.open);
  const { advantages, loading, error } = useAdvantages("PAGE");
  const fetchAdvantages = useAdvantagesStore((state) => state.fetchAdvantages);
  const t = useSiteText();

  return (
    <>
      <PageBanner title={t("advantages.banner")} subtitle={t("advantages.subtitle")} />

      <Section>
        {loading ? (
          <div className="flex flex-col gap-14 md:gap-20 lg:gap-28">
            {[1, 2].map((key) => (
              <div key={key} className={ADVANTAGE_ROW}>
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/5" />
                  <Skeleton className="h-5 w-full max-w-[560px]" />
                  <Skeleton className="h-5 w-4/5 max-w-[560px]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="text-base text-slate-600 md:text-lg">
              Не вдалося завантажити переваги. Спробуйте ще раз.
            </p>
            <Button
              variant="gold"
              size="xl"
              className="px-7"
              onClick={() => fetchAdvantages({ force: true })}
            >
              Спробувати ще раз
            </Button>
          </div>
        ) : advantages.length === 0 ? (
          <p className="text-center text-base text-slate-600 md:text-lg">
            Незабаром тут з'явиться опис переваг комплексу.
          </p>
        ) : (
          <div className="flex flex-col gap-14 md:gap-20 lg:gap-28">
            {advantages.map(({ id, title, image, text }, index) => (
              <article key={id} className={ADVANTAGE_ROW}>
                <img
                  src={resolveImage(image)}
                  alt={title}
                  loading="lazy"
                  className={`aspect-[4/3] w-full rounded-2xl object-cover ${
                    index % 2 === 1 ? "lg:order-last" : ""
                  }`}
                />

                <div>
                  <p className="text-[clamp(56px,7vw,104px)] leading-none font-extrabold text-brand/35">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-[clamp(26px,3vw,42px)] leading-[1.15] font-extrabold">
                    {title}
                  </h2>
                  <p className="mt-4 max-w-[560px] text-base leading-[1.8] text-slate-600 md:text-lg">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <section className="bg-ink px-[5%] py-14 text-white md:py-20">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between lg:px-[3%]">
          <div>
            <h2 className="text-[clamp(26px,3vw,42px)] leading-[1.15] font-extrabold">
              {t("advantages.ctaTitle")}
            </h2>
            <p className="mt-3 text-base text-white/70 md:text-lg">
              {t("advantages.ctaText")}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="gold"
              size="xl"
              className="px-7"
              render={<Link to="/apartments" />}
              nativeButton={false}
            >
              {t("advantages.ctaButton")}
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-white/30 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
              onClick={() => openLeadModal()}
            >
              {t("advantages.ctaLead")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Advantages;
