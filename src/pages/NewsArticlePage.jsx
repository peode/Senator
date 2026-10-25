import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { useNews, formatDate } from "@/lib/content";
import { resolveImage } from "@/data/images";

const NewsArticle = () => {
  const { id } = useParams();
  const news = useNews();
  const article = news.find((item) => String(item.id) === id);

  if (!article) {
    return (
      <>
        <PageBanner title="Новину не знайдено" />
        <Section>
          <Button
            variant="link"
            className="gap-2 p-0 text-base font-bold"
            render={<Link to="/news" />}
            nativeButton={false}
          >
            <ArrowLeft size={18} /> Усі новини
          </Button>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageBanner title={article.title} subtitle={formatDate(article.date)} />

      <Section>
        <article className="mx-auto max-w-[900px]">
          <img
            src={resolveImage(article.image)}
            alt={article.title}
            className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover"
          />

          <div className="space-y-5 text-base leading-[1.8] text-slate-700 md:text-lg">
            {article.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {article.gallery.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {article.gallery.map((image, index) => (
                <img
                  key={index}
                  src={resolveImage(image)}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}

          <Button
            variant="link"
            className="mt-10 gap-2 p-0 text-base font-bold hover:text-brand hover:no-underline"
            render={<Link to="/news" />}
            nativeButton={false}
          >
            <ArrowLeft size={18} /> Усі новини
          </Button>
        </article>
      </Section>
    </>
  );
};

export default NewsArticle;
