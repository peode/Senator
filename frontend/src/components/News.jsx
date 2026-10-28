import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/NewsCard";
import { Section, SectionHeading } from "@/components/Section";
import { useNews } from "@/lib/content";

const News = () => {
  const latestNews = useNews().news.slice(0, 3);

  return (
    <Section id="news" className="bg-surface">
      <SectionHeading title="НОВИНИ">
        <Button
          variant="link"
          className="h-auto gap-2 p-0 text-base font-bold text-neutral-950 hover:text-brand hover:no-underline"
          render={<Link to="/news" />}
          nativeButton={false}
        >
          Усі новини <ArrowRight size={18} />
        </Button>
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {latestNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  );
};

export default News;
