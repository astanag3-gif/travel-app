"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { ExcursionCard } from "@/components/excursion-card";
import { ExcursionCardSkeleton } from "@/components/excursion-card-skeleton";
import { CatalogFilters } from "@/components/catalog-filters";
import { Pagination } from "@/components/pagination";
import { MapPin } from "lucide-react";
import type { Excursion, PaginationMeta } from "@/types";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

const LIMIT = 9;

export default function ExcursionsPage() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId]);

  const fetchExcursions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number> = {
        page,
        limit: LIMIT,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryId) params.categoryId = categoryId;

      const res = await api.get<{ data: Excursion[]; meta: PaginationMeta }>(
        "/excursions",
        { params }
      );

      setExcursions(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setError("Не удалось загрузить экскурсии. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryId]);

  useEffect(() => {
    fetchExcursions();
  }, [fetchExcursions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
            <MapPin className="h-4 w-4" />
            <span>Астана, Казахстан</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Экскурсии по Астане
          </h1>
          <p className="mt-2 text-gray-600">
            Откройте столицу Казахстана с профессиональными гидами — от
            исторических мечетей до ночных панорам
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <CatalogFilters
          search={search}
          categoryId={categoryId}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryId}
        />

        <div className="mt-6">
          {meta && !loading && (
            <p className="mb-4 text-sm text-gray-500">
              {meta.total === 0
                ? "Ничего не найдено"
                : `Найдено: ${meta.total} ${
                    meta.total === 1
                      ? "экскурсия"
                      : meta.total < 5
                      ? "экскурсии"
                      : "экскурсий"
                  }`}
            </p>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchExcursions}
                className="mt-3 text-sm font-medium text-blue-600 hover:underline"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <ExcursionCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && !error && excursions.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {excursions.map((excursion) => (
                <ExcursionCard key={excursion.id} excursion={excursion} />
              ))}
            </div>
          )}

          {!loading && !error && excursions.length === 0 && (
            <div className="py-16 text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Экскурсии не найдены
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Попробуйте изменить параметры поиска или выбрать другую категорию
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategoryId(null);
                }}
                className="mt-4 text-sm font-medium text-blue-600 hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}

          {meta && meta.totalPages > 1 && !loading && (
            <div className="mt-8">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}