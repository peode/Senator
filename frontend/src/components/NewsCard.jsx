import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dateParts } from "@/lib/content";
import { cn } from "@/lib/utils";
import { resolveImage } from "@/data/images";

// row — фото збоку від тексту, починаючи з ширини планшета
const IMAGE_SIZE = "aspect-[3/2]";
const IMAGE_SIZE_ROW = "aspect-[3/2] sm:aspect-auto sm:min-h-[250px] sm:w-[44%] sm:shrink-0";

export const NewsDate = ({ date, className }) => {
  const { day, month, year } = dateParts(date);

  return (
    <time dateTime={date} className={className}>
      {day} {month} {year}
    </time>
  );
};

const NewsCard = ({ item, row = false, headingLevel: Heading = "h3" }) => (
  <Card className="group h-full gap-0 rounded-2xl py-0 shadow-card ring-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover has-focus-visible:ring-3 has-focus-visible:ring-focus">
    <Link
      to={`/news/${item.id}`}
      className={cn("flex h-full flex-col outline-none", row && "sm:flex-row")}
    >
      <div className={cn("relative overflow-hidden", row ? IMAGE_SIZE_ROW : IMAGE_SIZE)}>
        <img
          src={resolveImage(item.image)}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <NewsDate
          date={item.date}
          className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[13px] font-semibold text-ink"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <Heading className="line-clamp-3 text-[19px] leading-[1.3] font-bold text-ink transition-colors group-hover:text-brand-dark md:text-xl">
          {item.title}
        </Heading>
        <p className="mt-2.5 mb-5 line-clamp-3 text-[15px] leading-relaxed text-slate-600">
          {item.text}
        </p>

        <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-ink">
          Читати
          <ArrowRight
            size={16}
            className="text-brand-dark transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  </Card>
);

export const NewsCardSkeleton = ({ row = false }) => (
  <Card className={cn("h-full gap-0 rounded-2xl py-0 shadow-card ring-0", row && "sm:flex-row")}>
    <Skeleton className={cn("rounded-none", row ? IMAGE_SIZE_ROW : IMAGE_SIZE)} />
    <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-3 h-4 w-16" />
    </div>
  </Card>
);

export default NewsCard;
