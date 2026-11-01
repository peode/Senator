import HouseMap from "@/components/HouseMap";
import Seo from "@/components/Seo";

const Apartments = () => (
  <>
    <Seo
      title="Планування"
      description="Оберіть секцію на карті ЖК «Senator», щоб побачити плани квартир, їхню площу й вартість."
    />
    <HouseMap />
  </>
);

export default Apartments;
