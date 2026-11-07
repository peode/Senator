import * as newsRepository from "../repositories/newsRepository.js";

const serializeNews = ({ date, createdAt, updatedAt, ...rest }) => ({
  ...rest,
  date: date.toISOString().slice(0, 10),
});

const toNewsData = ({ date, ...rest }) => ({ ...rest, date: new Date(`${date}T00:00:00.000Z`) });

export const listNews = async () => (await newsRepository.findAll()).map(serializeNews);

export const getArticle = async (id) => {
  const article = await newsRepository.findById(id);
  return article && serializeNews(article);
};

export const createArticle = async (data) =>
  serializeNews(await newsRepository.create(toNewsData(data)));

export const updateArticle = async (id, data) =>
  serializeNews(await newsRepository.update(id, toNewsData(data)));

export const deleteArticle = (id) => newsRepository.remove(id);
