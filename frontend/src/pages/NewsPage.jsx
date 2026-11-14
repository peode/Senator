import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { Section } from "@/components/Section";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveImage } from "@/data/images";
import { dateParts } from "@/lib/content";
import { useNews } from "@/stores/newsStore";

const FeaturedArticle = ({ item }) => {
  const { day, month, year } = dateParts(item.date);

  return (
    <Link
      to={`/news/${item.id}`}
      className="group grid overflow-hidden rounded-2xl bg-ink text-white lg:grid-cols-[1.4fr_1fr]"
    >
      <div className="aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[460px]">
        <img
          src={resolveImage(item.image)}
          alt=""
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-center gap-4 p-6 md:p-10 lg:p-12">
        <p className="text-sm font-bold tracking-wide text-brand">
          Остання новина · {day} {month} {year}
        </p>
        <h2 className="text-[clamp(26px,2.6vw,40px)] leading-[1.15] font-extrabold">{item.title}</h2>
        <p className="text-base leading-relaxed text-white/70 md:text-lg">{item.text}</p>
        <span className="mt-2 inline-flex items-center gap-2 font-bold text-gold">
          Читати далі
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

const ArticleRow = ({ item }) => {
  const { day, month, year } = dateParts(item.date);

  return (
    <li className="border-t border-slate-200">
      <Link
        to={`/news/${item.id}`}
        className="group grid grid-cols-[64px_1fr] items-center gap-x-4 gap-y-4 py-6 md:grid-cols-[110px_1fr_240px] md:gap-x-8 md:py-8"
      >
        <div className="order-2 self-start md:order-none md:self-center">
          <p className="text-[clamp(34px,4vw,56px)] leading-none font-extrabold text-brand-dark">{day}</p>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            {month} {year}
          </p>
        </div>

        <div className="order-3 md:order-none">
          <h3 className="text-[clamp(19px,1.8vw,26px)] leading-[1.25] font-bold transition-colors group-hover:text-brand-dark">
            {item.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600 md:text-base">{item.text}</p>
        </div>

        <div className="order-1 col-span-2 aspect-[16/9] overflow-hidden rounded-xl md:order-none md:col-span-1 md:aspect-[3/2]">
          <img
            src={resolveImage(item.image)}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
    </li>
  );
};

const NewsSkeleton = () => (
  <>
    <Skeleton className="h-[320px] rounded-2xl lg:h-[460px]" />
    <div className="mt-10 flex flex-col gap-6">
      {[1, 2, 3].map((key) => (
        <Skeleton key={key} className="h-32 rounded-xl" />
      ))}
    </div>
  </>
);

const News = () => {
  const { news, loading, error } = useNews();
  const [latest, ...rest] = news;

  return (
    <>
      <PageBanner title="Новини" subtitle="Як будується ЖК «Senator»" />

      <Section>
        {loading ? (
          <NewsSkeleton />
        ) : error ? (
          <p className="text-slate-600">Не вдалося завантажити новини. Спробуйте пізніше.</p>
        ) : news.length === 0 ? (
          <p className="text-slate-600">Новин поки немає.</p>
        ) : (
          <>
            <FeaturedArticle item={latest} />

            {rest.length > 0 && (
              <ul className="mt-10 border-b border-slate-200 md:mt-14">
                {rest.map((item) => (
                  <ArticleRow key={item.id} item={item} />
                ))}
              </ul>
            )}
          </>
        )}
      </Section>
    </>
  );
};

export default News;
