import { idSchema, sectionPlanSchema, sectionSchema } from "../lib/schemas.js";
import * as sectionsService from "../services/sectionsService.js";

export const list = async (req, res) => {
  res.json(await sectionsService.listSections());
};

export const update = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  res.json(await sectionsService.updateSection(id, sectionSchema.parse(req.body)));
};

export const planImage = async (req, res) => {
  const image = await sectionsService.getPlanImage(idSchema.parse(req.params.id));
  if (!image) return res.status(404).json({ error: "Запис не знайдено" });
  res.set("Cache-Control", "public, max-age=31536000, immutable").type("jpeg").send(image);
};

export const updatePlan = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  res.json(await sectionsService.updateSectionPlan(id, sectionPlanSchema.parse(req.body)));
};
