"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import api from "@/lib/api";
import type { Category } from "@/types";

interface CatalogFiltersProps {
  search: string;
  categoryId: number | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: number | null) => void;
}

export function CatalogFilters({
  search,
  categoryId,
  onSearchChange,
  onCategoryChange,
}: CatalogFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск экскурсий..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-9"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryId === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className={
            categoryId === null ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
          }
        >
          Все
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={categoryId === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(cat.id)}
            className={
              categoryId === cat.id
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : ""
            }
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
}