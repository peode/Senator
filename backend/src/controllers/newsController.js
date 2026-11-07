import { idSchema, newsSchema } from "../lib/schemas.js";
import * as newsService from "../services/newsService.js";

export const list = async (req, res) => {
  res.json(await newsService.listNews());
};

export const getOne = async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  const article = id.success && (await newsService.getArticle(id.data));
  if (!article) return res.status(404).json({ error: "Новину не знайдено" });
  res.json(article);
};

export const create = async (req, res) => {
  const article = await newsService.createArticle(newsSchema.parse(req.body));
  res.status(201).location(`${req.baseUrl}/${article.id}`).json(article);
};

export const update = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  res.json(await newsService.updateArticle(id, newsSchema.parse(req.body)));
};

export const remove = async (req, res) => {
  await newsService.deleteArticle(idSchema.parse(req.params.id));
  res.status(204).end();
};
