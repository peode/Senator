import { Link } from "react-router-dom";
import { Newspaper, TriangleAlert } from "lucide-react";
import NewsCard, { NewsCardSkeleton } from "@/components/NewsCard";
import PageBanner from "@/components/PageBanner";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { useNews, useNewsStore } from "@/stores/newsStore";
import { useSiteText } from "@/stores/siteTextsStore";

const NEWS_GRID = "grid gap-6 xl:grid-cols-2";

const NewsNotice = ({ icon: Icon, title, text, children }) => (
  <div className="mx-auto flex max-w-[520px] flex-col items-center py-6 text-center md:py-12">
    <span className="flex size-16 items-center justify-center rounded-full bg-white text-brand-dark shadow-card">
      <Icon size={28} />
    </span>
    <h2 className="mt-6 text-2xl leading-tight font-extrabold md:text-3xl">{title}</h2>
    <p className="mt-3 text-base leading-relaxed text-slate-600">{text}</p>
    {children}
  </div>
);

const News = () => {
  const { news, loading, error } = useNews();
  const fetchNews = useNewsStore((state) => state.fetchNews);
  const t = useSiteText();

  return (
    <>
      <PageBanner title={t("news.banner")} subtitle={t("news.subtitle")} />

      <Section className="bg-surface">
        {loading ? (
          <div className={NEWS_GRID}>
            {[1, 2, 3, 4].map((key) => (
              <NewsCardSkeleton key={key} row />
            ))}
          </div>
        ) : error ? (
          <NewsNotice
            icon={TriangleAlert}
            title="Не вдалося завантажити новини"
            text="Перевірте з'єднання з інтернетом і спробуйте ще раз."
          >
            <Button
              variant="gold"
              size="xl"
              className="mt-6 px-7"
              onClick={() => fetchNews({ force: true })}
            >
              Спробувати ще раз
            </Button>
          </NewsNotice>
        ) : news.length === 0 ? (
          <NewsNotice
            icon={Newspaper}
            title="Новин поки немає"
            text="Незабаром тут з'являться новини про хід будівництва та життя комплексу."
          >
            <Button
              variant="gold"
              size="xl"
              className="mt-6 px-7"
              render={<Link to="/apartments" />}
              nativeButton={false}
            >
              Обрати квартиру
            </Button>
          </NewsNotice>
        ) : (
          <div className={NEWS_GRID}>
            {news.map((item) => (
              <NewsCard key={item.id} item={item} row />
            ))}
          </div>
        )}
      </Section>
    </>
  );
};

export default News;
