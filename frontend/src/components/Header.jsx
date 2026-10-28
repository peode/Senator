import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadModal from "@/components/LeadModal";
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
  const [leadOpen, setLeadOpen] = useState(false);
  const isHome = useLocation().pathname === "/";

  return (
    <header
      className={`inset-x-0 top-0 z-100 flex items-center justify-between gap-2.5 px-[5%] text-white min-[521px]:px-[3.5%] min-[1051px]:gap-7 ${
        isHome
          ? "absolute min-h-[75px] bg-linear-to-b from-ink/55 to-transparent py-4 min-[521px]:min-h-[85px] min-[521px]:py-[22px] min-[1051px]:min-h-[100px]"
          : "relative h-[100px] bg-ink"
      }`}
    >
      <a href="/" className="flex shrink-0 items-center">
        {/* темний логотип на білому фоні -> білий на прозорому */}
        <img
          src={Logo}
          alt="Senator"
          className="block h-auto w-[130px] mix-blend-screen brightness-140 grayscale invert min-[521px]:w-[170px]"
        />
      </a>

      <nav
        className={`${
          menuOpen ? "flex" : "hidden"
        } absolute top-full left-0 w-full flex-col items-start bg-ink px-[5%] py-5 min-[1051px]:static min-[1051px]:flex min-[1051px]:w-auto min-[1051px]:flex-row min-[1051px]:items-center min-[1051px]:justify-center min-[1051px]:gap-3 min-[1051px]:bg-transparent min-[1051px]:p-0 min-[1251px]:gap-5`}
      >
        {navLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className="group relative w-full border-b border-white/10 py-3 text-sm font-medium whitespace-normal transition-colors hover:text-brand min-[1051px]:w-auto min-[1051px]:border-0 min-[1051px]:py-1.5 min-[1051px]:text-xs min-[1051px]:whitespace-nowrap min-[1251px]:text-[13px]"
          >
            {label}
            <span className="absolute inset-x-0 bottom-0 hidden h-0.5 origin-left scale-x-0 rounded-full bg-brand transition-transform group-hover:scale-x-100 min-[1051px]:block" />
          </a>
        ))}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-4 min-[1051px]:ml-0">
        <Button
          variant="gold"
          className="h-auto px-3 py-2.5 text-[10px] min-[521px]:px-5 min-[521px]:py-3.5 min-[521px]:text-[13px]"
          onClick={() => {
            setMenuOpen(false);
            setLeadOpen(true);
          }}
        >
          <span className="min-[521px]:hidden">Заявка на дзвінок</span>
          <span className="hidden min-[521px]:inline">Залишити заявку на дзвінок</span>
        </Button>
      </div>

      <button
        type="button"
        className="flex shrink-0 cursor-pointer items-center justify-center text-white min-[1051px]:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
    </header>
  );
};

export default Header;
