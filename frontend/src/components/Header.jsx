import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadModalStore } from "@/stores/leadModalStore";
import Logo from "@/assets/icons/SenatorLogo.jpg";

const navLinks = [
  { href: "/", label: "Про проект" },
  { href: "/advantages", label: "Переваги" },
  { href: "/apartments", label: "Планування" },
  { href: "/news", label: "Новини" },
  { href: "/aboutdeveloper", label: "Про забудовника" },
  { href: "/contacts", label: "Контакти" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const openLeadModal = useLeadModalStore((state) => state.open);
  const isHome = useLocation().pathname === "/";

  return (
    <header
      className={`inset-x-0 top-0 z-100 flex items-center justify-between gap-2.5 px-[5%] text-white sm:px-[3.5%] lg:gap-7 ${
        isHome
          ? "absolute min-h-[75px] bg-linear-to-b from-ink/55 to-transparent py-4 sm:min-h-[85px] sm:py-[22px] lg:min-h-[100px]"
          : "relative h-[100px] bg-ink"
      }`}
    >
      <Link to="/" className="flex shrink-0 items-center">
        {/* темний логотип на білому фоні -> білий на прозорому */}
        <img
          src={Logo}
          alt="Senator"
          className="block h-auto w-[130px] mix-blend-screen brightness-140 grayscale invert sm:w-[170px]"
        />
      </Link>

      <nav
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

      <div className="ml-auto flex shrink-0 items-center gap-4 lg:ml-0">
        <Button
          variant="gold"
          className="h-auto px-3 py-2.5 text-[10px] sm:px-5 sm:py-3.5 sm:text-[13px]"
          onClick={() => {
            setMenuOpen(false);
            openLeadModal();
          }}
        >
          <span className="sm:hidden">Заявка на дзвінок</span>
          <span className="hidden sm:inline">Залишити заявку на дзвінок</span>
        </Button>
      </div>

      <button
        type="button"
        className="flex shrink-0 cursor-pointer items-center justify-center text-white lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </header>
  );
};

export default Header;
