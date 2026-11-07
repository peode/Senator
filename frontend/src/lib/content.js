export const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const formatDate = (iso) => {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
};
