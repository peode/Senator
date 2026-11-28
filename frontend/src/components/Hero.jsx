import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/stores/siteImagesStore";
import { useSiteText } from "@/stores/siteTextsStore";

// Нативний dialog сам тримає фокус усередині, закривається через Esc і повертає фокус на кнопку
const VideoDialog = ({ poster, onClose }) => {
  const dialogRef = useRef(null);

  // layout-ефект: close() має спрацювати до видалення з DOM, інакше фокус не повернеться
  useLayoutEffect(() => {
    const dialog = dialogRef.current;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Відео про ЖК Senator"
      onCancel={onClose}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none bg-black/80"
    >
      <div
        className="flex size-full items-center justify-center"
        onClick={(event) => event.target === event.currentTarget && onClose()}
      >
        <div className="overflow-hidden rounded-[10px] bg-black">
          <video
            className="block max-h-[90vh] max-w-[94vw]"
            poster={poster}
            autoPlay
            controls
            playsInline
          >
            <source src="/video/senator-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/video/senator.mp4" type="video/mp4" />
          </video>
        </div>

        <button
          type="button"
          className="absolute top-6 right-[3.5%] flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/75 bg-white/10 text-white transition-colors hover:bg-white/25"
          onClick={onClose}
          aria-label="Закрити відео"
        >
          <X size={28} />
        </button>
      </div>
    </dialog>
  );
};

const Hero = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const hero = useSiteImage()("hero");
  const t = useSiteText();

  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-ink text-white">
      {hero && (
        <img
          src={hero}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover"
        />
      )}

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(12_27_34/78%)_0%,rgb(12_27_34/48%)_48%,rgb(12_27_34/12%)_100%),linear-gradient(0deg,rgb(12_27_34/30%)_0%,transparent_45%)]" />

      <div className="relative z-10 max-w-[850px] px-[5%] pt-[135px] pb-[120px] sm:pt-[155px] md:px-[3.5%] md:pt-[clamp(170px,21vh,230px)] md:pb-[150px]">
        <p className="mb-4 text-xs font-bold tracking-[2px] text-brand sm:tracking-[3px]">
          {t("hero.eyebrow")}
        </p>

        <h1 className="text-[38px] leading-[1.1] font-bold tracking-[-1.5px] sm:text-[clamp(39px,9vw,60px)] md:text-[clamp(42px,5.5vw,76px)]">
          {t("hero.title")}
          <br />
          <span className="text-gold">{t("hero.accent")}</span>
        </h1>

        <p className="mt-6 mb-[30px] max-w-[410px] text-sm leading-[1.7] text-white/85 md:max-w-[480px] md:text-base">
          {t("hero.text")}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="gold"
            size="xl"
            className="h-[50px] px-[25px] font-bold"
            render={<Link to="/apartments" />}
            nativeButton={false}
          >
            {t("hero.button")}
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon-lg"
              className="size-12 rounded-full border-white/75 bg-white/10 text-white hover:bg-white/25 hover:text-white"
              onClick={() => setVideoOpen(true)}
              aria-label="Переглянути відео"
            >
              <Play size={20} fill="currentColor" />
            </Button>

            <span className="text-xs font-semibold tracking-[1.2px] whitespace-nowrap" aria-hidden="true">
              {t("hero.video")}
            </span>
          </div>
        </div>
      </div>

      {videoOpen && <VideoDialog poster={hero} onClose={() => setVideoOpen(false)} />}
    </section>
  );
};

export default Hero;
