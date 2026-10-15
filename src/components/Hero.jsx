import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import courtyard from "@/assets/images/courtyard.png";

const socials = [
  { href: "https://www.facebook.com/", label: "Facebook", short: "f" },
  { href: "https://www.instagram.com/", label: "Instagram", short: "ig" },
  { href: "https://www.youtube.com/", label: "YouTube", short: "yt" },
];

const Hero = () => {
  const scrollToVideo = () => {
    document.getElementById("video")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-[#24343c] text-white">
      <div
        className="absolute inset-0 -z-20 scale-[1.01] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${courtyard})` }}
      />

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(12_27_34/78%)_0%,rgb(12_27_34/48%)_48%,rgb(12_27_34/12%)_100%),linear-gradient(0deg,rgb(12_27_34/30%)_0%,transparent_45%)]" />

      <section className="relative z-10 max-w-[850px] px-[5%] pt-[135px] pb-[120px] min-[421px]:pt-[155px] md:px-[3.5%] md:pt-[clamp(170px,21vh,230px)] md:pb-[150px]">
        <p className="mb-4 text-[10px] font-bold tracking-[2px] text-brand min-[421px]:text-xs min-[421px]:tracking-[3px]">
          НОВИЙ РІВЕНЬ КОМФОРТУ
        </p>

        <h1 className="text-[38px] leading-[1.1] font-bold tracking-[-1.5px] min-[421px]:text-[clamp(39px,9vw,60px)] md:text-[clamp(42px,5.5vw,76px)]">
          ЖК «Senator»
          <br />
          <span className="text-gold">Будинок високого рангу</span>
        </h1>

        <p className="mt-6 mb-[30px] max-w-[410px] text-[13px] leading-[1.7] text-white/85 min-[421px]:text-sm md:max-w-[480px] md:text-base">
          Сучасна архітектура, продумані планування
          та комфорт для всієї родини.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="gold"
            size="xl"
            className="h-[50px] px-[25px] font-bold"
            render={<a href="/apartments" />}
            nativeButton={false}
          >
            Обрати квартиру
          </Button>

          <Button
            variant="outline"
            size="icon-lg"
            className="size-12 rounded-full border-white/75 bg-white/10 text-white hover:bg-white/25 hover:text-white"
            onClick={scrollToVideo}
            aria-label="Переглянути відео"
          >
            <Play size={20} fill="currentColor" />
          </Button>

          <span className="text-[9px] font-semibold tracking-[1.2px] min-[421px]:text-[10px]">
            ПЕРЕГЛЯНУТИ ВІДЕО
          </span>
        </div>
      </section>

      <div className="absolute right-[5%] bottom-[38px] z-20 flex gap-[18px] md:top-1/2 md:right-[3.5%] md:bottom-auto md:-translate-y-1/2 md:flex-col">
        {socials.map(({ href, label, short }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="flex items-center justify-center text-[15px] leading-none font-bold text-white uppercase transition-colors hover:text-brand"
          >
            {short}
          </a>
        ))}
      </div>

      <div id="video" className="absolute bottom-0">
        {/* Пізніше тут можна розмістити відео про житловий комплекс */}
      </div>
    </main>
  );
};

export default Hero;
