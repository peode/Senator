import * as settingsRepository from "../repositories/settingsRepository.js";

const serializeSettings = ({ id, updatedAt, ...rest }) => rest;

export const getSettings = async () => {
  const settings = await settingsRepository.find();
  return settings && serializeSettings(settings);
};

export const saveSettings = async (data) => serializeSettings(await settingsRepository.save(data));
