"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { excursionSchema, type ExcursionFormData } from "@/lib/validator";
import { Category, Tag, Excursion } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditExcursionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExcursionFormData>({
    resolver: zodResolver(excursionSchema) as Resolver<ExcursionFormData>,
  });

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/excursions");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [excRes, catRes, tagRes] = await Promise.all([
          api.get<Excursion>(`/excursions/${id}`),
          api.get<Category[]>("/categories"),
          api.get<Tag[]>("/tags"),
        ]);

        const exc = excRes.data;
        setCategories(catRes.data);
        setTags(tagRes.data);

        reset({
          title: exc.title,
          description: exc.description,
          price: exc.price,
          duration: exc.duration,
          imageUrl: exc.imageUrl,
          format: exc.format,
          maxPeople: exc.maxPeople,
          categoryId: exc.categoryId,
        });

        const currentTagIds = exc.tags?.map((t: { tag?: { id: number }; tagId?: number }) => t.tag?.id ?? t.tagId ?? 0).filter(Boolean) ?? [];
        setSelectedTags(currentTagIds);
      } catch {
        toast.error("Экскурсия не найдена");
        router.replace("/excursions");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, reset, router]);

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((tid) => tid !== tagId)
        : [...prev, tagId]
    );
  };

  const onSubmit = async (data: ExcursionFormData) => {
    setLoading(true);
    try {
      await api.patch(`/excursions/${id}`, { ...data, tagIds: selectedTags });
      toast.success("Экскурсия обновлена!");
      router.push(`/excursions/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message || "Ошибка при обновлении";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "ADMIN") return null;

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Редактировать экскурсию
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Название */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Название</Label>
          <Input id="title" {...register("title")} />
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
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Цена и Продолжительность */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Цена (₸)</Label>
            <Input id="price" type="number" step="100" {...register("price")} />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="duration">Длительность (часы)</Label>
            <Input id="duration" type="number" step="0.5" {...register("duration")} />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>
        </div>

        {/* URL изображения */}
        <div className="space-y-1.5">
          <Label htmlFor="imageUrl">URL изображения</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        {/* Формат и Макс. участников */}
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
            <Input id="maxPeople" type="number" {...register("maxPeople")} />
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
            {loading ? "Сохранение..." : "Сохранить изменения"}
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