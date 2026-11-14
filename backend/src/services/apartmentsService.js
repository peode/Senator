import * as apartmentsRepository from "../repositories/apartmentsRepository.js";

const serializeUnit = ({ id, floor, apartment: { id: apartmentId, sectionId, rooms, area, section } }) => ({
  id,
  apartmentId,
  sectionId,
  floor,
  rooms,
  area,
  pricePerMeter: section.price,
  totalPrice: Math.round(area * section.price),
});

// Вартість — похідна (площа × ціна секції), тому бюджет перевіряємо вже після запиту до бази
export const listApartmentsForSale = async ({ budgetTo, ...filters }) => {
  const apartments = (await apartmentsRepository.findForSale(filters)).map(serializeUnit);
  return budgetTo === undefined
    ? apartments
    : apartments.filter(({ totalPrice }) => totalPrice <= budgetTo);
};

export const updateApartmentUnit = (id, data) => apartmentsRepository.updateUnit(id, data);
