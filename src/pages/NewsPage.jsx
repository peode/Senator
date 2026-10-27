import PageBanner from "@/components/PageBanner";
import NewsCard from "@/components/NewsCard";
import { Section } from "@/components/Section";
import { useNews } from "@/lib/content";

const News = () => {
  const { news, loading, error } = useNews();

  return (
    <>
      <PageBanner title="Новини" />

      <Section className="bg-surface">
        {loading ? null : error ? (
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
