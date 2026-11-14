export const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const formatDate = (iso) => {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
};

// «15 жовтня 2026» по частинах: день, місяць у родовому відмінку, рік
export const dateParts = (iso) => {
  const [day, month] = new Date(`${iso}T00:00:00Z`)
    .toLocaleDateString("uk-UA", { day: "numeric", month: "long", timeZone: "UTC" })
    .split(" ");
  return { day, month, year: iso.slice(0, 4) };
};
