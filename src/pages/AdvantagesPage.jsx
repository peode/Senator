import PageBanner from "@/components/PageBanner";
import { Section } from "@/components/Section";
import courtyard from "@/assets/images/courtyard.png";
import topView from "@/assets/images/complex-top-view.jpg";
import supermarket from "@/assets/images/supermarket.png";
import walkingZone from "@/assets/images/walking-zone.png";
import playground from "@/assets/images/playground.png";
import cafe from "@/assets/images/cafe.png";

const advantages = [
  {
    title: "Локація",
    image: walkingZone,
    text: "Вулиця Руська, 236Б у Чернівцях: зручний виїзд, поруч транспорт, парки та зелені зони для прогулянок.",
  },
  {
    title: "Інфраструктура",
    image: supermarket,
    text: "Супермаркет, поштове відділення, салон краси та кав'ярня — усе необхідне на території комплексу або поруч.",
  },
  {
    title: "Закритий двір",
    image: playground,
    text: "Територія без автомобілів і сторонніх людей: безпечно для дітей, спокійно для дорослих, з дитячим майданчиком і зонами відпочинку.",
  },
  {
    title: "Підземний паркінг",
    image: topView,
    text: "Дворівневий паркінг, з'єднаний із будинками ліфтами, та гостьова стоянка надворі.",
  },
  {
    title: "Квартири",
    image: courtyard,
    text: "Двостороння орієнтація, панорамні вікна, лоджії, гардеробні та дворівневі квартири, індивідуальне опалення.",
  },
  {
    title: "Комерція на першому поверсі",
    image: cafe,
    text: "Магазини, кав'ярні та сервіси на першому поверсі — щоденні потреби закриваються без виїзду з комплексу.",
  },
];

const Advantages = () => (
  <>
    <PageBanner title="Переваги" subtitle="Чому мешканці обирають «Senator»" />

    <Section>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {advantages.map(({ title, image, text }) => (
          <article
            key={title}
            tabIndex={0}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink outline-none focus-visible:ring-4 focus-visible:ring-brand"
          >
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus:scale-110"
            />
            <div className="absolute inset-0 bg-ink/45 transition-colors duration-500 group-hover:bg-ink/85 group-focus:bg-ink/85" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
              <h2 className="text-xl font-bold tracking-wide uppercase transition-transform duration-500 group-hover:-translate-y-1 group-focus:-translate-y-1 md:text-2xl">
                {title}
              </h2>
              <p className="max-h-0 translate-y-4 overflow-hidden text-[15px] leading-relaxed text-white/90 opacity-0 transition-all duration-500 group-hover:max-h-48 group-hover:translate-y-0 group-hover:opacity-100 group-focus:max-h-48 group-focus:translate-y-0 group-focus:opacity-100">
                {text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  </>
);

export default Advantages;
