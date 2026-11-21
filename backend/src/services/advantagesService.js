import * as advantagesRepository from "../repositories/advantagesRepository.js";

export const listAdvantages = () => advantagesRepository.findAll();

export const createAdvantage = async (data) =>
  advantagesRepository.create({
    ...data,
    position: await advantagesRepository.nextPosition(data.placement),
  });

export const updateAdvantage = (id, data) => advantagesRepository.update(id, data);

export const deleteAdvantage = (id) => advantagesRepository.remove(id);

export const reorderAdvantages = async (ids) => {
  await advantagesRepository.reorder(ids);
};
