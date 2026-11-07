import { settingsSchema } from "../lib/schemas.js";
import * as settingsService from "../services/settingsService.js";

export const get = async (req, res) => {
  const settings = await settingsService.getSettings();
  if (!settings) return res.status(404).json({ error: "Налаштування не знайдено" });
  res.json(settings);
};

export const update = async (req, res) => {
  res.json(await settingsService.saveSettings(settingsSchema.parse(req.body)));
};
