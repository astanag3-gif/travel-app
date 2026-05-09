"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, MapPin } from "lucide-react";
import type { Excursion } from "@/types";

interface ExcursionCardProps {
  excursion: Excursion;
}

export function ExcursionCard({ excursion }: ExcursionCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-KZ").format(price);

  const formatDuration = (hours: number) => {
    if (hours === 1) return "1 час";
    if (hours < 5) return `${hours} часа`;
    return `${hours} часов`;
  };

  return (
    <Card className="group overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={excursion.imageUrl}
          alt={excursion.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/640x360/e2e8f0/94a3b8?text=GuidedTrip";
          }}
        />
        {excursion.category && (
          <Badge className="absolute top-3 left-3 bg-blue-600 text-white hover:bg-blue-700">
            {excursion.category.name}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3.5rem]">
          {excursion.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2">
          {excursion.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" />
            {formatDuration(excursion.duration)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-500" />
            до {excursion.maxPeople} чел.
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-blue-500" />
            {excursion.format}
          </span>
        </div>

        {excursion.tags && excursion.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {excursion.tags.slice(0, 3).map((et) => (
              <Badge
                key={et.tag.id}
                variant="outline"
                className="text-xs text-gray-600 border-gray-300"
              >
                {et.tag.name}
              </Badge>
            ))}
            {excursion.tags.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-200">
                +{excursion.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(excursion.price)} ₸
            </span>
            <span className="text-xs text-gray-400 block">за человека</span>
          </div>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/excursions/${excursion.id}`}>Подробнее</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}