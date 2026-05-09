"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { excursionSchema, type ExcursionFormData } from "@/lib/validator";
import { Category, Tag } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateExcursionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExcursionFormData>({
    resolver: zodResolver(excursionSchema) as Resolver<ExcursionFormData>,
    defaultValues: {
      tagIds: [],
    },
  });

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/excursions");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          api.get<Category[]>("/categories"),
          api.get<Tag[]>("/tags"),
        ]);
        setCategories(catRes.data);
        setTags(tagRes.data);
      } catch {
        toast.error("Не удалось загрузить данные");
      }
    };
    fetchData();
  }, []);

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const onSubmit = async (data: ExcursionFormData) => {
    setLoading(true);
    try {
      await api.post("/excursions", { ...data, tagIds: selectedTags });
      toast.success("Экскурсия создана!");
      router.push("/excursions");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message || "Ошибка при создании экскурсии";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Создать экскурсию
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Название */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Название</Label>
          <Input id="title" {...register("title")} placeholder="Название экскурсии" />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Описание */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Описание</Label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Подробное описание экскурсии..."
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Цена и Продолжительность — в ряд */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Цена (₸)</Label>
            <Input
              id="price"
              type="number"
              step="100"
              {...register("price")}
              placeholder="5000"
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="duration">Длительность (часы)</Label>
            <Input
              id="duration"
              type="number"
              step="0.5"
              {...register("duration")}
              placeholder="2.5"
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>
        </div>

        {/* URL изображения */}
        <div className="space-y-1.5">
          <Label htmlFor="imageUrl">URL изображения</Label>
          <Input
            id="imageUrl"
            {...register("imageUrl")}
            placeholder="https://example.com/photo.jpg"
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        {/* Формат и Макс. участников — в ряд */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="format">Формат</Label>
            <select
              id="format"
              {...register("format")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите формат</option>
              <option value="пешая">Пешая</option>
              <option value="автобусная">Автобусная</option>
              <option value="индивидуальная">Индивидуальная</option>
              <option value="групповая">Групповая</option>
            </select>
            {errors.format && (
              <p className="text-sm text-red-500">{errors.format.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="maxPeople">Макс. участников</Label>
            <Input
              id="maxPeople"
              type="number"
              {...register("maxPeople")}
              placeholder="20"
            />
            {errors.maxPeople && (
              <p className="text-sm text-red-500">{errors.maxPeople.message}</p>
            )}
          </div>
        </div>

        {/* Категория */}
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Категория</Label>
          <select
            id="categoryId"
            {...register("categoryId")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите категорию</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Теги */}
        <div className="space-y-1.5">
          <Label>Теги</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Создание..." : "Создать экскурсию"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}