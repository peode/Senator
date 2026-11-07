import * as apartmentsRepository from "../repositories/apartmentsRepository.js";

const serializeApartment = ({ id, sectionId, rooms, area, section }) => ({
  id,
  sectionId,
  rooms,
  area,
  pricePerMeter: section.price,
  totalPrice: Math.round(area * section.price),
});

// Вартість — похідна (площа × ціна секції), тому бюджет перевіряємо вже після запиту до бази
export const listApartmentsForSale = async ({ budgetTo, ...filters }) => {
  const apartments = (await apartmentsRepository.findForSale(filters)).map(serializeApartment);
  return budgetTo === undefined
    ? apartments
    : apartments.filter(({ totalPrice }) => totalPrice <= budgetTo);
};
