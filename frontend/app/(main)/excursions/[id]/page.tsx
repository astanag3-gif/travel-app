"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { BookingForm } from "@/components/booking-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Users,
  MapPin,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Excursion } from "@/types";

export default function ExcursionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const fetchExcursion = async () => {
      setLoading(true);
      try {
        const res = await api.get<Excursion>(`/excursions/${id}`);
        setExcursion(res.data);
      } catch {
        setError("Экскурсия не найдена");
      } finally {
        setLoading(false);
      }
    };
    fetchExcursion();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    setConfirmDelete(false);
    try {
      await api.delete(`/excursions/${id}`);
      toast.success("Экскурсия удалена");
      router.push("/excursions");
    } catch {
      toast.error("Не удалось удалить экскурсию");
      setDeleting(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-KZ").format(price);

  const formatDuration = (hours: number) => {
    if (hours === 1) return "1 час";
    if (hours < 5) return `${hours} часа`;
    return `${hours} часов`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-40 mb-6" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-[16/9] w-full rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !excursion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Экскурсия не найдена
          </h2>
          <p className="mt-2 text-gray-500">
            Возможно, она была удалена или ссылка неверна
          </p>
          <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700">
            <Link href="/excursions">Вернуться к каталогу</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/excursions"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к каталогу
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <img
                src={excursion.imageUrl}
                alt={excursion.title}
                className="w-full aspect-[16/9] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/1280x720/e2e8f0/94a3b8?text=GuidedTrip";
                }}
              />
              {excursion.category && (
                <Badge className="absolute top-4 left-4 bg-blue-600 text-white hover:bg-blue-700">
                  {excursion.category.name}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {excursion.title}
              </h1>

              {isAdmin && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/excursions/${excursion.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Редактировать
                    </Link>
                  </Button>
                  {confirmDelete ? (
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {deleting ? "Удаление..." : "Да, удалить"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDelete(false)}
                      >
                        Отмена
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDelete(true)}
                      disabled={deleting}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Удалить
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5">
                <Clock className="h-4 w-4 text-blue-500" />
                {formatDuration(excursion.duration)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5">
                <Users className="h-4 w-4 text-blue-500" />
                до {excursion.maxPeople} человек
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5">
                <MapPin className="h-4 w-4 text-blue-500" />
                {excursion.format}
              </span>
            </div>

            {excursion.tags && excursion.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {excursion.tags.map((et) => (
                  <Badge
                    key={et.tag.id}
                    variant="outline"
                    className="text-sm text-gray-600 border-gray-300"
                  >
                    {et.tag.name}
                  </Badge>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Об экскурсии
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {excursion.description}
              </p>
            </div>

            <div className="lg:hidden">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatPrice(excursion.price)} ₸{" "}
                <span className="text-sm font-normal text-gray-500">
                  за человека
                </span>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <BookingForm
              excursionId={excursion.id}
              price={excursion.price}
              maxPeople={excursion.maxPeople}
            />
          </div>
        </div>
      </div>
    </div>
  );
}