import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import News from "@/components/News";
import { NewsDate } from "@/components/NewsCard";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useArticle } from "@/stores/newsStore";
import { resolveImage } from "@/data/images";

// Нижній відступ шапки відповідає наїзду головного фото (HERO_IMAGE); батько фото — flow-root,
// інакше від'ємний відступ схлопнеться крізь Section і білий фон закриє шапку
const ArticleHeader = ({ overlap = true, children }) => (
  <header
    className={cn(
      "bg-ink px-[5%] pt-8 text-center text-white md:pt-12",
      overlap ? "pb-[calc(clamp(72px,20vw,280px)+36px)]" : "pb-14 md:pb-20"
    )}
  >
    <div className="mx-auto flex max-w-[900px] flex-col items-center">
      <Link
        to="/news"
        className="inline-flex items-center gap-2 rounded text-sm font-semibold text-white/70 transition-colors outline-none hover:text-gold focus-visible:ring-3 focus-visible:ring-brand/50"
      >
        <ArrowLeft size={16} /> Усі новини
      </Link>
      {children}
    </div>
  </header>
);

const HERO_IMAGE =
  "relative mx-auto -mt-[clamp(72px,20vw,280px)] aspect-[16/9] w-full max-w-[1100px] rounded-2xl";

const ArticleTitle = ({ children }) => (
  <h1 className="mt-4 text-[clamp(30px,4.2vw,58px)] leading-[1.1] font-extrabold">{children}</h1>
);

const ArticleSkeleton = () => (
  <>
    <ArticleHeader>
      <Skeleton className="mt-8 h-5 w-36 bg-white/10" />
      <Skeleton className="mt-5 h-12 w-full max-w-[640px] bg-white/10" />
      <Skeleton className="mt-5 h-5 w-full max-w-[420px] bg-white/10" />
    </ArticleHeader>

    <Section className="pt-0 md:pt-0 lg:pt-0">
      <div className="flow-root">
        <Skeleton className={HERO_IMAGE} />
        <div className="mx-auto mt-10 max-w-[720px] space-y-3 md:mt-14">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    </Section>
  </>
);

const NewsArticle = () => {
  const { id } = useParams();
  const { article, loading, error } = useArticle(id);

  if (loading) return <ArticleSkeleton />;

  if (!article) {
    return (
      <>
        <ArticleHeader overlap={false}>
          <ArticleTitle>{error ? "Не вдалося завантажити новину" : "Новину не знайдено"}</ArticleTitle>
        </ArticleHeader>

        <Section>
          <div className="mx-auto flex max-w-[520px] flex-col items-center text-center">
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              {error
                ? "Перевірте з'єднання з інтернетом і оновіть сторінку."
                : "Можливо, її вже прибрали або посилання застаріло."}
            </p>
            <Button
              variant="gold"
              size="xl"
              className="mt-6 px-7"
              render={<Link to="/news" />}
              nativeButton={false}
            >
              Перейти до новин
            </Button>
          </div>
        </Section>
      </>
    );
  }

  const { gallery } = article;

  return (
    <>
      <ArticleHeader>
        <NewsDate date={article.date} className="mt-8 text-sm font-bold tracking-wide text-gold md:text-base" />
        <ArticleTitle>{article.title}</ArticleTitle>
        <p className="mt-4 max-w-[680px] text-base leading-relaxed text-white/75 md:text-lg">{article.text}</p>
      </ArticleHeader>

      <Section className="pt-0 md:pt-0 lg:pt-0">
        <article className="flow-root">
          <img
            src={resolveImage(article.image)}
            alt={article.title}
            className={cn(HERO_IMAGE, "block object-cover shadow-card-hover")}
          />

          <div className="mx-auto mt-10 max-w-[720px] space-y-6 text-base leading-[1.8] text-slate-700 md:mt-14 md:text-lg">
            {article.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {gallery.length > 0 && (
            <div className="mx-auto mt-10 grid max-w-[1100px] gap-4 sm:grid-cols-2 md:mt-14 md:gap-6">
              {gallery.map((image, index) => (
                <img
                  key={index}
                  src={resolveImage(image)}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "aspect-[4/3] w-full rounded-2xl object-cover",
                    // за непарної кількості перше фото на всю ширину, щоб сітка не лишалась із дірою
                    index === 0 && gallery.length % 2 === 1 && "sm:col-span-2 sm:aspect-[16/9]"
                  )}
                />
              ))}
            </div>
          )}
        </article>
      </Section>

      <News titleKey="news.relatedTitle" excludeId={article.id} />
    </>
  );
};

export default NewsArticle;
