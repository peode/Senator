import { toImageData } from "../lib/imageData.js";
import * as imagesRepository from "../repositories/imagesRepository.js";

const serializeImage = ({ key, width, height, updatedAt }) => ({
  key,
  // версія в адресі: нове зображення одразу видно попри довгий кеш
  src: `/api/images/${key}?v=${updatedAt.getTime()}`,
  width,
  height,
});

export const listImages = async () => (await imagesRepository.findAll()).map(serializeImage);

export const getImage = async (key) => {
  const row = await imagesRepository.findImage(key);
  return row && Buffer.from(row.image);
};

export const saveImage = async (key, image) =>
  serializeImage(await imagesRepository.upsert(key, toImageData(image)));

export const deleteImage = (key) => imagesRepository.remove(key);
