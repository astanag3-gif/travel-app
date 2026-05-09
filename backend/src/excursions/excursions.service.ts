import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExcursionDto, UpdateExcursionDto } from './dto';

@Injectable()
export class ExcursionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 9;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    const [data, total] = await Promise.all([
      this.prisma.excursion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.excursion.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const excursion = await this.prisma.excursion.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!excursion) {
      throw new NotFoundException('Экскурсия не найдена');
    }

    return excursion;
  }

  async create(dto: CreateExcursionDto) {
    const { tagIds, ...data } = dto;

    const excursion = await this.prisma.excursion.create({
      data: {
        ...data,
        tags: tagIds
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    return excursion;
  }

  async update(id: number, dto: UpdateExcursionDto) {
    await this.findOne(id);

    const { tagIds, ...data } = dto;

    if (tagIds) {
      await this.prisma.excursionTag.deleteMany({
        where: { excursionId: id },
      });
    }

    const excursion = await this.prisma.excursion.update({
      where: { id },
      data: {
        ...data,
        tags: tagIds
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    return excursion;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.excursionTag.deleteMany({
      where: { excursionId: id },
    });

    await this.prisma.booking.deleteMany({
      where: { excursionId: id },
    });

    await this.prisma.excursion.delete({ where: { id } });

    return { message: 'Экскурсия удалена' };
  }
}