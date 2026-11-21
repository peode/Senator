import * as textsRepository from "../repositories/textsRepository.js";

export const listTexts = async () =>
  Object.fromEntries((await textsRepository.findAll()).map(({ key, value }) => [key, value]));

export const saveTexts = async (texts) => {
  const entries = Object.entries(texts);
  await textsRepository.save(
    entries.filter(([, value]) => value),
    entries.filter(([, value]) => !value).map(([key]) => key),
  );
  return listTexts();
};
