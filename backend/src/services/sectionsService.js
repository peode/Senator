import * as sectionsRepository from "../repositories/sectionsRepository.js";

const serializeSection = ({ updatedAt, apartments, ...rest }) => ({
  ...rest,
  apartments: apartments.map(({ sectionId, ...apartment }) => apartment),
});

export const listSections = async () => (await sectionsRepository.findAll()).map(serializeSection);

export const updateSection = async (id, data) =>
  serializeSection(await sectionsRepository.update(id, data));
