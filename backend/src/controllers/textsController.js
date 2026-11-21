import { siteTextsSchema } from "../lib/schemas.js";
import * as textsService from "../services/textsService.js";

export const list = async (req, res) => {
  res.json(await textsService.listTexts());
};

export const save = async (req, res) => {
  res.json(await textsService.saveTexts(siteTextsSchema.parse(req.body).texts));
};
