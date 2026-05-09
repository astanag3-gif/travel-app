import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <MapPin className="h-16 w-16 text-blue-200" />
      <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-3 text-lg text-gray-600">
        Страница не найдена. Возможно, она была удалена или перенесена.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        На главную
      </Link>
    </div>
  );
}