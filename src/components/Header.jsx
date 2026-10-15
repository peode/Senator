
import { useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import "./Header.css";
import Logo from "@/assets/icons/SenatorLogo.jpg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <a href="/" className="logo">
        <img src={Logo} alt="Senator" />
      </a>

      <nav className={menuOpen ? "nav nav-open" : "nav"}>
        <a href="/" onClick={() => setMenuOpen(false)}>
          Про проект
        </a>
        <a href="/advantages" onClick={() => setMenuOpen(false)}>
          Переваги
        </a>
        <a href="/apartments" onClick={() => setMenuOpen(false)}>
          Планування
        </a>
        <a href="/news" onClick={() => setMenuOpen(false)}>
          Новини
        </a>
        <a
          href="/constructionprogress"
          onClick={() => setMenuOpen(false)}
        >
          Хід будівництва
        </a>
        <a
          href="/aboutdeveloper"
          onClick={() => setMenuOpen(false)}
        >
          Про забудовника
        </a>
        <a href="/contacts" onClick={() => setMenuOpen(false)}>
          Контакти
        </a>
      </nav>

      <div className="header-actions">
        <a className="header-phone" href="tel:+380000000000">
          <Phone size={17} />
          <span>Зателефонувати</span>
        </a>

        <button
          className="btn"
          onClick={() => {
            window.location.href = "/apartments";
          }}
        >
          Обрати квартиру
        </button>
      </div>

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </header>
  );
};

export default Header;