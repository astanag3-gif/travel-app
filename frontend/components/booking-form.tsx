"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CalendarDays, Phone, Users } from "lucide-react";

const bookingSchema = z.object({
  people: z.coerce
    .number()
    .min(1, "Минимум 1 человек")
    .max(50, "Максимум 50 человек"),
  date: z.string().min(1, "Укажите дату"),
  phone: z
    .string()
    .min(10, "Введите корректный номер телефона")
    .regex(/^[\d\s\+\-\(\)]+$/, "Некорректный формат телефона"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  excursionId: number;
  price: number;
  maxPeople: number;
}

export function BookingForm({ excursionId, price, maxPeople }: BookingFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema) as Resolver<BookingFormData>,
    defaultValues: {
      people: 1,
      date: "",
      phone: "",
    },
  });

  const peopleCount = watch("people") || 1;
  const totalPrice = price * peopleCount;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("ru-KZ").format(value);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast.error("Войдите в аккаунт, чтобы записаться");
      router.push("/auth/login");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/bookings", {
        excursionId,
        people: data.people,
        date: new Date(data.date).toISOString(),
        phone: data.phone,
      });
      toast.success("Вы успешно записались на экскурсию!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Не удалось записаться. Попробуйте позже.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-lg font-semibold text-gray-900 mb-1">
          {formatPrice(price)} ₸{" "}
          <span className="text-sm font-normal text-gray-500">за человека</span>
        </p>
        <p className="text-sm text-gray-500 mt-3 mb-4">
          Войдите, чтобы записаться на экскурсию
        </p>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push("/auth/login")}
        >
          Войти
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-lg font-semibold text-gray-900 mb-4">
        Записаться на экскурсию
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="people" className="flex items-center gap-1.5 mb-1.5">
            <Users className="h-4 w-4 text-blue-500" />
            Количество человек
          </Label>
          <Input
            id="people"
            type="number"
            min={1}
            max={maxPeople}
            {...register("people", { valueAsNumber: true })}
          />
          {errors.people && (
            <p className="mt-1 text-sm text-red-500">{errors.people.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="date" className="flex items-center gap-1.5 mb-1.5">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            Дата экскурсии
          </Label>
          <Input id="date" type="date" min={minDate} {...register("date")} />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-1.5 mb-1.5">
            <Phone className="h-4 w-4 text-blue-500" />
            Контактный телефон
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+7 777 123 4567"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="rounded-lg bg-gray-50 p-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">Итого:</span>
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(totalPrice)} ₸
          </span>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
        >
          {submitting ? "Отправка..." : "Записаться"}
        </Button>
      </form>
    </div>
  );
}