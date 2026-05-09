"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Вы вышли из системы");
    router.push("/");
    setMobileOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/excursions", label: "Экскурсии" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <MapPin className="h-6 w-6" />
          <span>GuidedTrip</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/excursions/new">
                  <Button variant="outline" size="sm">
                    + Экскурсия
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  {user?.name}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-gray-500">
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Войти</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Регистрация</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <hr className="my-2" />

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Личный кабинет
                </Link>
                {isAdmin && (
                  <Link
                    href="/excursions/new"
                    className="rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    + Создать экскурсию
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Войти
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}