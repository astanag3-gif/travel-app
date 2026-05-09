import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Введите email")
    .email("Некорректный формат email"),
  password: z
    .string()
    .min(6, "Минимум 6 символов"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Введите имя"),
  email: z
    .string()
    .min(1, "Введите email")
    .email("Некорректный формат email"),
  password: z
    .string()
    .min(6, "Минимум 6 символов"),
  confirmPassword: z
    .string()
    .min(1, "Подтвердите пароль"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export const excursionSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().min(10, "Описание — минимум 10 символов"),
  price: z.coerce.number().positive("Цена должна быть больше 0"),
  duration: z.coerce.number().positive("Продолжительность должна быть больше 0"),
  imageUrl: z.string().url("Введите корректный URL изображения"),
  format: z.string().min(1, "Выберите формат"),
  maxPeople: z.coerce.number().int().positive("Минимум 1 участник"),
  categoryId: z.coerce.number().int().positive("Выберите категорию"),
  tagIds: z.array(z.number()).optional().default([]),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ExcursionFormData = z.infer<typeof excursionSchema>;