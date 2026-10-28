import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/content";
import { resolveImage } from "@/data/images";

const NewsCard = ({ item }) => (
  <Card className="group h-full gap-0 rounded-2xl py-0 shadow-card ring-0">
    <Link
      to={`/news/${item.id}`}
      tabIndex={-1}
      aria-hidden="true"
      className="block aspect-[16/10] overflow-hidden"
    >
      <img
        src={resolveImage(item.image)}
        alt=""
        loading="lazy"
        className="block size-full object-cover transition-transform duration-400 group-hover:scale-105"
      />
    </Link>

    <CardHeader className="gap-2 px-6 pt-[22px]">
      <Badge
        variant="ghost"
        className="h-auto px-0 text-[13px] font-bold tracking-wide text-brand-dark"
        render={<time dateTime={item.date} />}
      >
        {formatDate(item.date)}
      </Badge>
      <CardTitle className="text-[19px] leading-[1.35] font-bold">
        {item.title}
      </CardTitle>
    </CardHeader>

    <CardContent className="flex flex-1 flex-col px-6 pt-2.5 pb-7">
      <CardDescription className="mb-6 text-[15px] leading-relaxed text-slate-600">
        {item.text}
      </CardDescription>

      <Button
        variant="gold"
        size="xl"
        className="mt-auto w-fit px-6"
        render={<Link to={`/news/${item.id}`} />}
        nativeButton={false}
      >
        Читати далі
      </Button>
    </CardContent>
  </Card>
);

export default NewsCard;
