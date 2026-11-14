import * as sectionsRepository from "../repositories/sectionsRepository.js";

const serializeSection = ({ updatedAt, apartments, ...rest }) => ({
  ...rest,
  apartments: apartments.map(({ sectionId, units, ...apartment }) => ({
    ...apartment,
    units: units.map(({ apartmentId, ...unit }) => unit),
  })),
});

export const listSections = async () => (await sectionsRepository.findAll()).map(serializeSection);

export const updateSection = async (id, data) =>
  serializeSection(await sectionsRepository.update(id, data));
