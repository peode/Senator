import { idSchema, sectionSchema } from "../lib/schemas.js";
import * as sectionsService from "../services/sectionsService.js";

export const list = async (req, res) => {
  res.json(await sectionsService.listSections());
};

export const update = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  res.json(await sectionsService.updateSection(id, sectionSchema.parse(req.body)));
};
