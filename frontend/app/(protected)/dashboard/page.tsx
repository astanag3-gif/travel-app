"use client";

import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Calendar, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Личный кабинет
      </h1>

      {/* Профиль */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Профиль
          </CardTitle>
          <CardDescription>Ваши данные</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Имя</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Роль</span>
            <Badge variant={isAdmin ? "default" : "secondary"}>
              <Shield className="mr-1 h-3 w-3" />
              {user?.role}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Дата регистрации</span>
            <span className="font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("ru-RU")
                : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Мои бронирования — заглушка, реализуем на Этапе 7 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Мои бронирования
          </CardTitle>
          <CardDescription>
            Ваши записи на экскурсии
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            У вас пока нет бронирований. Перейдите в{" "}
            <a href="/excursions" className="text-blue-600 hover:underline">
              каталог экскурсий
            </a>
            , чтобы записаться.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}