import { siteImageKeySchema, siteImageSchema } from "../lib/schemas.js";
import * as imagesService from "../services/imagesService.js";

export const list = async (req, res) => {
  res.json(await imagesService.listImages());
};

export const getOne = async (req, res) => {
  const image = await imagesService.getImage(req.params.key);
  if (!image) return res.status(404).json({ error: "Запис не знайдено" });
  res.set("Cache-Control", "public, max-age=31536000, immutable").type("jpeg").send(image);
};

export const save = async (req, res) => {
  const key = siteImageKeySchema.parse(req.params.key);
  res.json(await imagesService.saveImage(key, siteImageSchema.parse(req.body)));
};

export const remove = async (req, res) => {
  await imagesService.deleteImage(siteImageKeySchema.parse(req.params.key));
  res.status(204).end();
};
