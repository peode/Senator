import ApartmentCatalog from "@/components/ApartmentCatalog";
import HouseMap from "@/components/HouseMap";
import Seo from "@/components/Seo";

const Apartments = () => (
  <>
    <Seo
      title="Планування і вільні квартири"
      description="Оберіть секцію на карті ЖК «Senator» або підберіть квартиру за кількістю кімнат, площею й бюджетом."
    />
    <HouseMap />
    <ApartmentCatalog />
  </>
);

export default Apartments;
