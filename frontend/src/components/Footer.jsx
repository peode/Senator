import { useState } from "react";
import { Button } from "@/components/ui/button";
import LeadModal from "@/components/LeadModal";
import { Separator } from "@/components/ui/separator";
import { SocialIcon } from "@/components/SocialIcons";
import { socialLabels } from "@/data/socials";
import { phoneHref, useSettings } from "@/lib/content";
import Logo from "@/assets/icons/SenatorLogo.jpg";

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
  const [leadOpen, setLeadOpen] = useState(false);
  const { phone, address, hours, socials } = useSettings();

  return (
    <footer className="w-full bg-ink px-[6%] pt-11 pb-9 text-white/85 min-[851px]:px-[4.7%] min-[851px]:pt-[70px] min-[851px]:pb-[50px]">
      <div className="mx-auto grid max-w-[1800px] grid-cols-2 items-start gap-x-6 gap-y-9 min-[851px]:gap-x-8 min-[1351px]:grid-cols-[1.1fr_1.4fr_1fr_1fr_1.4fr] min-[1351px]:gap-10 max-[1350px]:min-[851px]:grid-cols-[1fr_1.3fr_1fr_1fr]">
        <div className="col-span-2 min-[851px]:col-span-1">
          <a href="/" className="block w-fit">
            <img
              src={Logo}
              alt="Senator"
              className="block h-auto w-[140px] mix-blend-screen brightness-140 grayscale invert min-[851px]:w-[170px]"
            />
          </a>
        </div>

        <div className="col-span-2 flex flex-col items-start gap-4 min-[851px]:col-span-1">
          <h3 className="text-base font-medium tracking-wide text-white">Відділ Продажу</h3>

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
            <a key={href} href={href} className={navLinkClass}>
              {label}
            </a>
          ))}
        </nav>

        <nav
          className="flex flex-col items-start gap-4"
          aria-label="Додаткова навігація"
        >
          {secondaryLinks.map(({ href, label }) => (
            <a key={href} href={href} className={navLinkClass}>
              {label}
            </a>
          ))}
        </nav>

        <div className="col-span-2 flex flex-col items-start gap-5 min-[1351px]:col-span-1 max-[1350px]:min-[851px]:col-start-2 max-[1350px]:min-[851px]:col-end-[-1]">
          <p className="text-base font-medium tracking-wide text-white">
            Ми в соцмережах
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
            onClick={() => setLeadOpen(true)}
          >
            Залишити заявку на дзвінок
          </Button>
        </div>
      </div>

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />

      <Separator className="mx-auto mt-12 max-w-[1800px] bg-white/10" />
      <p className="mx-auto mt-6 max-w-[1800px] text-sm font-light text-white/50">
        © {new Date().getFullYear()} ЖК «Senator». Усі права захищено.
      </p>
    </footer>
  );
};

export default Footer;
