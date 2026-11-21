import NewsCard, { NewsCardSkeleton } from "@/components/NewsCard";
import { Section, SectionHeading, SectionLink } from "@/components/Section";
import { useNews } from "@/stores/newsStore";
import { useSiteText } from "@/stores/siteTextsStore";

// На планшеті два стовпці, тому третю картку ховаємо, щоб вона не лишалась сама в ряду
const News = ({ titleKey = "news.homeTitle", excludeId }) => {
  const t = useSiteText();
  const { news, loading } = useNews();
  const latestNews = news.filter((item) => item.id !== excludeId).slice(0, 3);

  if (!loading && latestNews.length === 0) return null;

  return (
    <Section id="news" className="bg-surface">
      <SectionHeading title={t(titleKey)}>
        <SectionLink to="/news">{t("news.allLink")}</SectionLink>
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2 md:max-lg:[&>*:nth-child(3)]:hidden lg:grid-cols-3">
        {loading
          ? [1, 2, 3].map((key) => <NewsCardSkeleton key={key} />)
          : latestNews.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>
    </Section>
  );
};

export default News;
