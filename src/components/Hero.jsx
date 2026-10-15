import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import courtyard from "@/assets/images/courtyard.png";
import "./Hero.css";

const Hero = () => {
  const scrollToVideo = () => {
    document.getElementById("video")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="home-page">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${courtyard})` }}
      />

      <div className="hero-overlay" />

      <section className="hero-content">

        <p className="hero-eyebrow">НОВИЙ РІВЕНЬ КОМФОРТУ</p>

        <h1>
          ЖК «Senator»
          <br />
          <span>Будинок високого рангу</span>
        </h1>

        <p className="hero-description">
          Сучасна архітектура, продумані планування
          та комфорт для всієї родини.
        </p>

        <div className="hero-buttons">
          <Button
            className="apartment-button"
            onClick={() => {
              window.location.href = "/apartments";
            }}
          >
            Обрати квартиру
          </Button>

          <button
            className="play-button"
            onClick={scrollToVideo}
            aria-label="Переглянути відео"
          >
            <Play size={20} fill="currentColor" />
          </button>

          <span className="play-caption">ПЕРЕГЛЯНУТИ ВІДЕО</span>
        </div>
      </section>

      <div className="hero-socials">
        <a href="https://www.facebook.com/" aria-label="Facebook">
          <span className="social-label">f</span>
        </a>
        <a href="https://www.instagram.com/" aria-label="Instagram">
          <span className="social-label">ig</span>
        </a>
        <a href="https://www.youtube.com/" aria-label="YouTube">
          <span className="social-label">yt</span>
        </a>
      </div>

      <div id="video" className="video-anchor">
        {/* Пізніше тут можна розмістити відео про житловий комплекс */}
      </div>
    </main>
  );
};

export default Hero;