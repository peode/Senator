import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SocialIcon } from "@/components/SocialIcons";
import { socialLabels } from "@/data/socials";
import { phoneHref } from "@/lib/content";
import { useLeadModalStore } from "@/stores/leadModalStore";
import { useSettings } from "@/stores/settingsStore";
import { logoClass } from "@/data/siteImages";
import { useSiteImage } from "@/stores/siteImagesStore";
import { useSiteText } from "@/stores/siteTextsStore";

const primaryLinks = [
  { href: "/", label: "Про проект" },
  { href: "/advantages", label: "Переваги" },
  { href: "/apartments", label: "Планування" },
];

const secondaryLinks = [
  { href: "/news", label: "Новини" },
  { href: "/aboutdeveloper", label: "Про забудовника" },
  { href: "/contacts", label: "Контакти" },
];

const navLinkClass =
  "text-[15px] font-normal leading-snug text-white/90 transition-colors hover:text-brand";
const contactLinkClass =
  "text-[15px] font-light leading-relaxed text-white/70 transition-colors hover:text-brand";

const Footer = () => {
  const openLeadModal = useLeadModalStore((state) => state.open);
  const { phone, address, hours, socials } = useSettings();
  const siteImage = useSiteImage();
  const t = useSiteText();

  return (
    <footer className="w-full bg-ink px-[6%] pt-11 pb-9 text-white/85 md:px-[4.7%] md:pt-[70px] md:pb-[50px]">
      <div className="mx-auto grid max-w-[1800px] grid-cols-2 items-start gap-x-6 gap-y-9 md:gap-x-8 xl:grid-cols-[1.1fr_1.4fr_1fr_1fr_1.4fr] xl:gap-10 md:max-xl:grid-cols-[1fr_1.3fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="block w-fit">
            <img
              src={siteImage("logo")}
              alt="Senator"
              className={`block h-auto w-[140px] md:w-[170px] ${logoClass}`}
            />
          </Link>
        </div>

        <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-1">
          <h3 className="text-base font-medium tracking-wide text-white">{t("footer.sales")}</h3>

          <a
            className={contactLinkClass}
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noreferrer"
          >
            {address}
          </a>

          <p className="text-[15px] font-light leading-relaxed whitespace-pre-line text-white/70">
            {hours}
          </p>

          <a className={contactLinkClass} href={phoneHref(phone)}>
            {phone}
          </a>
        </div>

        <nav
          className="flex flex-col items-start gap-4"
          aria-label="Основна навігація"
        >
          {primaryLinks.map(({ href, label }) => (
            <Link key={href} to={href} className={navLinkClass}>
              {label}
            </Link>
          ))}
        </nav>

        <nav
          className="flex flex-col items-start gap-4"
          aria-label="Додаткова навігація"
        >
          {secondaryLinks.map(({ href, label }) => (
            <Link key={href} to={href} className={navLinkClass}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="col-span-2 flex flex-col items-start gap-5 xl:col-span-1 md:max-xl:col-start-2 md:max-xl:col-end-[-1]">
          <p className="text-base font-medium tracking-wide text-white">
            {t("footer.socials")}
          </p>

          <div className="flex gap-3">
            {Object.entries(socials).map(([key, href]) => {
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={socialLabels[key]}
                  className="flex size-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-brand hover:text-brand"
                >
                  <SocialIcon name={key} size={18} />
                </a>
              );
            })}
          </div>

          <Button
            variant="gold"
            className="h-11 px-7 text-sm font-medium"
            onClick={() => openLeadModal()}
          >
            {t("footer.button")}
          </Button>
        </div>
      </div>

      <Separator className="mx-auto mt-12 max-w-[1800px] bg-white/10" />
      <p className="mx-auto mt-6 max-w-[1800px] text-sm font-light text-white/50">
        © {new Date().getFullYear()} {t("footer.copyright")}
      </p>
    </footer>
  );
};

export default Footer;
