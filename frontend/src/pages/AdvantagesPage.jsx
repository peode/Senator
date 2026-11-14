import { Link } from "react-router-dom";
import PageBanner from "@/components/PageBanner";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { useLeadModalStore } from "@/stores/leadModalStore";
import courtyard from "@/assets/images/courtyard.webp";
import topView from "@/assets/images/complex-top-view.jpg";
import supermarket from "@/assets/images/supermarket.webp";
import walkingZone from "@/assets/images/walking-zone.webp";
import playground from "@/assets/images/playground.webp";
import cafe from "@/assets/images/cafe.webp";

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

const Advantages = () => {
  const openLeadModal = useLeadModalStore((state) => state.open);

  return (
    <>
      <PageBanner title="Переваги" subtitle="Чому мешканці обирають «Senator»" />

      <Section>
        <div className="flex flex-col gap-14 md:gap-20 lg:gap-28">
          {advantages.map(({ title, image, text }, index) => (
            <article
              key={title}
              className="grid items-center gap-6 md:gap-10 lg:grid-cols-2 lg:gap-20"
            >
              <img
                src={image}
                alt={title}
                loading="lazy"
                className={`aspect-[4/3] w-full rounded-2xl object-cover ${
                  index % 2 === 1 ? "lg:order-last" : ""
                }`}
              />

              <div>
                <p className="text-[clamp(56px,7vw,104px)] leading-none font-extrabold text-brand/35">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 text-[clamp(26px,3vw,42px)] leading-[1.15] font-extrabold">
                  {title}
                </h2>
                <p className="mt-4 max-w-[560px] text-base leading-[1.8] text-slate-600 md:text-lg">
                  {text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-ink px-[5%] py-14 text-white md:py-20">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between lg:px-[3%]">
          <div>
            <h2 className="text-[clamp(26px,3vw,42px)] leading-[1.15] font-extrabold">
              Оберіть свою квартиру в «Senator»
            </h2>
            <p className="mt-3 text-base text-white/70 md:text-lg">
              Подивіться планування або залиште заявку — менеджер усе розповість.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="gold"
              size="xl"
              className="px-7"
              render={<Link to="/apartments" />}
              nativeButton={false}
            >
              Обрати квартиру
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-white/30 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
              onClick={() => openLeadModal()}
            >
              Залишити заявку
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Advantages;
