import { Link } from "react-router-dom";
import PageBanner from "@/components/PageBanner";
import { Section } from "@/components/Section";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <>
    <Seo title="Сторінку не знайдено" noindex />
    <PageBanner title="Сторінку не знайдено" />

    <Section>
      <div className="mx-auto flex max-w-[520px] flex-col items-center text-center">
        <p className="text-base leading-relaxed text-slate-600 md:text-lg">
          Можливо, посилання застаріло або в адресі є помилка.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="gold" size="xl" className="px-7" render={<Link to="/apartments" />} nativeButton={false}>
            Обрати квартиру
          </Button>
          <Button variant="outline" size="xl" className="px-7" render={<Link to="/" />} nativeButton={false}>
            На головну
          </Button>
        </div>
      </div>
    </Section>
  </>
);

export default NotFound;
