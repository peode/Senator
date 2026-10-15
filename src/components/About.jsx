
import { useState } from "react";
import {
  Baby,
  Coffee,
  ShoppingBasket,
  Trees,
  Mail,
  Scissors,
  ArrowRight,
} from "lucide-react";
import "./About.css";

import playground from "@/assets/images/playground.png";
import cafe from "@/assets/images/cafe.png";
import supermarket from "@/assets/images/supermarket.png";
import walkingZone from "@/assets/images/walking-zone.png";
import postOffice from "@/assets/images/post-office.png";
import beautySalon from "@/assets/images/beauty-salon.png";

const amenities = [
  {
    id: "playground",
    title: "Дитячий майданчик",
    icon: Baby,
    image: playground,
    description: "Простір для ігор та дитячих пригод.",
  },
  {
    id: "cafe",
    title: "Кав'ярня",
    icon: Coffee,
    image: cafe,
    description: "Улюблена кава зовсім поруч із домом.",
  },
  {
    id: "supermarket",
    title: "Супермаркет",
    icon: ShoppingBasket,
    image: supermarket,
    description: "Усе необхідне для щоденних покупок.",
  },
  {
    id: "walking",
    title: "Прогулянкова зона",
    icon: Trees,
    image: walkingZone,
    description: "Зелений простір для відпочинку на свіжому повітрі.",
  },
  {
    id: "post",
    title: "Поштове відділення",
    icon: Mail,
    image: postOffice,
    description: "Зручно отримувати та відправляти посилки.",
  },
  {
    id: "beauty",
    title: "Салон краси",
    icon: Scissors,
    image: beautySalon,
    description: "Турбота про себе неподалік від дому.",
  },
];

const About = () => {
  const [activeAmenity, setActiveAmenity] = useState(amenities[0]);

  return (
    <section className="about-section" id="about">
      <div className="about-heading">
        <div className="about-title">
          <span className="about-title-line" />
          <h2>ТУТ ПЕРЕДБАЧЕНО</h2>
        </div>

        <p>Все, що потрібне для комфортної життя!</p>
      </div>

      <div className="about-content">
        <div className="amenities-grid">
          {amenities.map((amenity) => {
            const Icon = amenity.icon;
            const isActive = activeAmenity.id === amenity.id;

            return (
              <button
                key={amenity.id}
                type="button"
                className={`amenity-card ${
                  isActive ? "amenity-card-active" : ""
                }`}
                onClick={() => setActiveAmenity(amenity)}
                aria-pressed={isActive}
              >
                <Icon className="amenity-icon" strokeWidth={1.5} />

                <span className="amenity-title">
                  {amenity.title}
                </span>

                {isActive && (
                  <ArrowRight className="amenity-arrow" size={22} />
                )}
              </button>
            );
          })}
        </div>

        <div className="about-image-wrapper">
          <img
            key={activeAmenity.id}
            src={activeAmenity.image}
            alt={activeAmenity.title}
            className="about-image"
          />

          <div className="about-image-caption">
            <span>{activeAmenity.title}</span>
            <p>{activeAmenity.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
