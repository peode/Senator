import { z } from "zod";

const text = (max) => z.string().trim().min(1, "Обов'язкове поле").max(max, "Занадто довге значення");

// ключ із бібліотеки сайту або власне фото (data:/http URL, стиснене в браузері)
const image = z.string().min(1, "Оберіть фото").max(3_000_000, "Фото занадто велике");

export const leadSchema = z.object({
  name: text(100),
  phone: z
    .string()
    .trim()
    .max(25, "Занадто довгий номер")
    .regex(/^\+?[\d\s()-]+$/, "Введіть коректний номер телефону")
    .refine((value) => {
      const digits = value.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15;
    }, "Введіть коректний номер телефону"),
  comment: z
    .string()
    .trim()
    .max(1000, "Занадто довгий коментар")
    .optional()
    .transform((value) => value || null),
  // приманка для ботів: люди це поле не бачать і не заповнюють
  website: z.string().optional(),
});

export const leadStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "DONE"]),
});

export const newsSchema = z.object({
  date: z.iso.date("Невірна дата"),
  title: text(200),
  text: text(500),
  image,
  paragraphs: z.array(text(10_000)).max(100),
  gallery: z.array(image).max(20),
});

export const loginSchema = z.object({ password: z.string().min(1).max(200) });

export const idSchema = z.coerce.number().int().positive();
