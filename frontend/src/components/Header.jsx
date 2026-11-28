import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { phoneHref } from "@/lib/content";
import { useLeadModalStore } from "@/stores/leadModalStore";
import { logoClass } from "@/data/siteImages";
import { useSettings } from "@/stores/settingsStore";
import { useSiteImage } from "@/stores/siteImagesStore";

const navLinks = [
  { href: "/", label: "Про проєкт" },
  { href: "/advantages", label: "Переваги" },
  { href: "/apartments", label: "Планування" },
  { href: "/news", label: "Новини" },
  { href: "/aboutdeveloper", label: "Про забудовника" },
  { href: "/contacts", label: "Контакти" },
];

const Header = () => {
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openLeadModal = useLeadModalStore((state) => state.open);
  const { phone } = useSettings();
  const siteImage = useSiteImage();
  const isHome = useLocation().pathname === "/";
  // над першим екраном шапка прозора, а під час прокрутки потрібне тло під текст
  const overHero = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (event) => {
      if (!headerRef.current.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-100 flex h-[76px] items-center justify-between gap-1.5 px-[5%] text-white transition-colors sm:px-[3.5%] lg:h-[88px] lg:gap-7 ${
        overHero ? "bg-linear-to-b from-ink/55 to-transparent" : "bg-ink"
      }`}
    >
      <Link to="/" className="flex shrink-0 items-center">
        <img
          src={siteImage("logo")}
          alt="Senator"
          className={`block h-auto w-[104px] min-[360px]:w-[130px] sm:w-[150px] ${logoClass}`}
        />
      </Link>

      <nav
        id="site-menu"
        aria-label="Основне меню"
        className={`${
          menuOpen ? "flex" : "hidden"
        } absolute top-full left-0 w-full flex-col items-start bg-ink px-[5%] py-5 lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:gap-3 lg:bg-transparent lg:p-0 xl:gap-5`}
      >
        {navLinks.map(({ href, label }) => (
          <NavLink
            key={href}
            to={href}
            end={href === "/"}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `group relative w-full border-b border-white/10 py-3 text-sm font-medium whitespace-normal transition-colors hover:text-brand lg:w-auto lg:border-0 lg:py-1.5 lg:text-xs lg:whitespace-nowrap xl:text-[13px] ${
                isActive ? "text-brand" : ""
              }`
            }
          >
            {({ isActive }) => (
              <>
                {label}
                <span
                  className={`absolute inset-x-0 bottom-0 hidden h-0.5 origin-left rounded-full bg-brand transition-transform group-hover:scale-x-100 lg:block ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-0 lg:gap-4">
        <a
          href={phoneHref(phone)}
          aria-label={`Зателефонувати: ${phone}`}
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors hover:text-brand"
        >
          <Phone size={20} />
          <span className="hidden xl:inline">{phone}</span>
        </a>

        <Button
          variant="gold"
          className="h-11 px-3 text-xs sm:px-5 sm:text-[13px]"
          onClick={() => {
            setMenuOpen(false);
            openLeadModal();
          }}
        >
          <span className="sm:hidden">Заявка</span>
          <span className="hidden sm:inline">Залишити заявку на дзвінок</span>
        </Button>
      </div>

      <button
        type="button"
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center text-white lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={menuOpen}
        aria-controls="site-menu"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </header>
  );
};

export default Header;
