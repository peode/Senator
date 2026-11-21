import { z } from "zod";

// найбільше значення INTEGER у PostgreSQL: більше число база не прийме
const MAX_INT = 2_147_483_647;

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

export const sectionSchema = z
  .object({
    status: z.enum(["SELLING", "PLANNED", "SOLD", "COMING_SOON"], "Невірний статус"),
    price: z.number("Невірна ціна").int("Невірна ціна").positive("Невірна ціна").max(MAX_INT, "Невірна ціна").nullable(),
    floors: z.number("Невірна кількість поверхів").int("Невірна кількість поверхів").min(1, "Невірна кількість поверхів").max(50, "Невірна кількість поверхів"),
  })
  .refine(({ status, price }) => status !== "SELLING" || price !== null, {
    path: ["price"],
    error: "Для секції у продажу вкажіть ціну",
  });

const planSize = z.number("Невірний розмір плану").int("Невірний розмір плану").min(1, "Невірний розмір плану").max(10_000, "Невірний розмір плану");

const planPoint = z.tuple([z.number("Невірний контур квартири").min(0).max(10_000), z.number("Невірний контур квартири").min(0).max(10_000)], "Невірний контур квартири");

export const sectionPlanSchema = z.object({
  // лише коли завантажили новий план
  plan: z
    .object({
      image: z.string().max(3_000_000, "Фото занадто велике").regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/, "Невірний формат фото"),
      width: planSize,
      height: planSize,
    })
    .optional(),
  apartments: z
    .array(
      z.object({
        id: z.string().max(50, "Невірна квартира"),
        rooms: z.number("Вкажіть кількість кімнат").int("Вкажіть кількість кімнат").min(1, "Вкажіть кількість кімнат").max(20, "Вкажіть кількість кімнат"),
        area: z.number("Вкажіть площу").positive("Вкажіть площу").max(10_000, "Вкажіть площу"),
        points: z.array(planPoint).min(3, "Контур квартири має щонайменше 3 точки").max(200, "Забагато точок у контурі"),
      }),
    )
    .max(200, "Забагато квартир на плані"),
});

export const apartmentUnitSchema = z.object({ available: z.boolean("Невірний статус") });

const filterNumber = z.coerce.number("Невірне значення фільтра").min(0, "Невірне значення фільтра").optional();

export const apartmentFiltersSchema = z.object({
  rooms: z.coerce.number("Невірне значення фільтра").int("Невірне значення фільтра").min(0, "Невірне значення фільтра").max(MAX_INT, "Невірне значення фільтра").optional(),
  areaFrom: filterNumber,
  areaTo: filterNumber,
  budgetTo: filterNumber,
});

// порожньо — посилання не задане; лише http(s), бо значення потрапляє в href
const socialUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/, error: "Введіть коректне посилання" }),
]);

export const settingsSchema = z.object({
  phone: text(50),
  address: text(300),
  hours: text(300),
  socials: z.object({ facebook: socialUrl, instagram: socialUrl, youtube: socialUrl }),
});

export const loginSchema = z.object({ password: z.string().min(1).max(200) });

export const idSchema = z.coerce.number().int().positive().max(MAX_INT);
