"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждено",
  CANCELLED: "Отменено",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<Booking[]>("/bookings/my");
        setBookings(res.data);
      } catch {
        toast.error("Не удалось загрузить бронирования");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    setCancellingId(bookingId);
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Бронирование отменено");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Ошибка при отмене";
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Профиль */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Личный кабинет</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Имя:</span> {user?.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Роль:</span>{" "}
            <Badge variant="outline">
              {user?.role === "ADMIN" ? "Администратор" : "Пользователь"}
            </Badge>
          </p>
        </CardContent>
      </Card>

      {/* Ссылка на создание — только для ADMIN */}
      {user?.role === "ADMIN" && (
        <div className="mb-6">
          <Link href="/excursions/new">
            <Button>+ Создать экскурсию</Button>
          </Link>
        </div>
      )}

      {/* Бронирования */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Мои бронирования
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <p className="mb-4">У вас пока нет бронирований</p>
            <Link href="/excursions">
              <Button variant="outline">Перейти к каталогу</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/excursions/${booking.excursion?.id ?? booking.excursionId}`}
                      className="text-lg font-semibold text-blue-600 hover:underline"
                    >
                      {booking.excursion?.title ?? `Экскурсия #${booking.excursionId}`}
                    </Link>
                    <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                      <p>Дата: {formatDate(booking.date)}</p>
                      <p>Участников: {booking.people}</p>
                      <p>Телефон: {booking.phone}</p>
                      <p className="font-medium text-gray-900">
                        Итого: {booking.totalPrice.toLocaleString("ru-RU")} ₸
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={statusColors[booking.status] ?? ""}
                      variant="secondary"
                    >
                      {statusLabels[booking.status] ?? booking.status}
                    </Badge>
                    {booking.status !== "CANCELLED" && (
                      confirmCancelId === booking.id ? (
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={cancellingId === booking.id}
                            onClick={() => {
                              setConfirmCancelId(null);
                              handleCancel(booking.id);
                            }}
                          >
                            {cancellingId === booking.id ? "Отмена..." : "Да, отменить"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmCancelId(null)}
                          >
                            Нет
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => setConfirmCancelId(booking.id)}
                        >
                          Отменить
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}