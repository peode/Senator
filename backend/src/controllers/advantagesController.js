import { advantageOrderSchema, advantageSchema, idSchema } from "../lib/schemas.js";
import * as advantagesService from "../services/advantagesService.js";

export const list = async (req, res) => {
  res.json(await advantagesService.listAdvantages());
};

export const create = async (req, res) => {
  const advantage = await advantagesService.createAdvantage(advantageSchema.parse(req.body));
  res.status(201).json(advantage);
};

export const update = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  res.json(await advantagesService.updateAdvantage(id, advantageSchema.parse(req.body)));
};

export const remove = async (req, res) => {
  await advantagesService.deleteAdvantage(idSchema.parse(req.params.id));
  res.status(204).end();
};

export const reorder = async (req, res) => {
  await advantagesService.reorderAdvantages(advantageOrderSchema.parse(req.body).ids);
  res.status(204).end();
};
