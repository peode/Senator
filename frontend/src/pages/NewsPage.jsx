import PageBanner from "@/components/PageBanner";
import NewsCard, { NewsCardSkeleton } from "@/components/NewsCard";
import { Section } from "@/components/Section";
import { useNews } from "@/stores/newsStore";

const News = () => {
  const { news, loading, error } = useNews();

  return (
    <>
      <PageBanner title="Новини" />

      <Section className="bg-surface">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <NewsCardSkeleton key={key} />
            ))}
          </div>
        ) : error ? (
          <p className="text-slate-600">Не вдалося завантажити новини. Спробуйте пізніше.</p>
        ) : news.length === 0 ? (
          <p className="text-slate-600">Новин поки немає.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
};

export default News;
