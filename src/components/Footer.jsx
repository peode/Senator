
// import {
//    Facebook,
//    Instagram,
//    Youtube,
// } from "lucide-react";
import "./Footer.css";
import Logo from "@/assets/icons/SenatorLogo.jpg";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Логотипи */}
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            <img src={Logo} alt="Senator" />
          </a>
        </div>

        {/* Контактна інформація */}
        <div className="footer-contacts">
          <h3>Відділ Продажу</h3>

          <a
            href="https://maps.google.com/?q=Чернівці,+вул.+Мізюна,+20"
            target="_blank"
            rel="noreferrer"
          >
            Чернівці, вул. Мізюна, 20
          </a>

          <p>
            Пн - Пт: з 09:00 по 19:00
            <br />
            Сб: з 10:00 до 15:00
          </p>

          <a href="tel:+380501991122">
            +38 (050) 199-11-22
          </a>
        </div>

        {/* Навігація */}
        <nav className="footer-nav" aria-label="Основна навігація">
          <a href="/">Про проект</a>
          <a href="/advantages">Переваги</a>
          <a href="/apartments">Планування</a>
          <a href="/constructionprogress">Хід будівництва</a>
        </nav>

        <nav
          className="footer-nav footer-nav-secondary"
          aria-label="Додаткова навігація"
        >
          <a href="/news">Новини</a>
          <a href="/aboutdeveloper">Про забудовника</a>
          <a href="/contacts">Контакти</a>
        </nav>

        {/* Соціальні мережі та консультація */}
        <div className="footer-social">
          <p className="footer-social-title">
            Ми в соціальних мережах
          </p>

          {/* <div className="footer-social-links"> */}
            {/* <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={35} fill="currentColor" />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={35} />
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <Youtube size={39} fill="currentColor" />
            </a>
          </div> */}

          <a className="footer-consultation" href="/contacts">
            Отримати консультацію
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
