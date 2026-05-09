import Link from "next/link";
import { MapPin, Clock, Users, Star } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: "Экскурсии по Астане",
      desc: "Обзорные, вечерние, детские и тематические маршруты по столице",
    },
    {
      icon: Clock,
      title: "От 1.5 до 5 часов",
      desc: "Городские экскурсии на любой вкус и расписание",
    },
    {
      icon: Users,
      title: "Индивидуально и в группе",
      desc: "Пешие, автобусные, индивидуальные и групповые форматы",
    },
    {
      icon: Star,
      title: "Профессиональные гиды",
      desc: "Опытные экскурсоводы, влюблённые в Астану",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Откройте Астану
              <span className="block text-amber-400">с лучшими гидами</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Пешие, автобусные и тематические экскурсии по столице Казахстана.
              Выберите маршрут, забронируйте онлайн — и вперёд!
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/excursions"
                className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-amber-600"
              >
                Смотреть экскурсии
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Создать аккаунт
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60L1440 60L1440 0C1200 50 240 50 0 0L0 60Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Почему GuidedTrip?
            </h2>
            <p className="mt-3 text-gray-600">
              Всё для идеального знакомства с Астаной
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Готовы исследовать Астану?
          </h2>
          <p className="mt-3 text-gray-600">
            Зарегистрируйтесь и забронируйте свою первую экскурсию
          </p>
          <Link
            href="/excursions"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700"
          >
            Перейти к экскурсиям
          </Link>
        </div>
      </section>
    </>
  );
}