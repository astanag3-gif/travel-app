import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookingDto) {
    const excursion = await this.prisma.excursion.findUnique({
      where: { id: dto.excursionId },
    });

    if (!excursion) {
      throw new NotFoundException('Экскурсия не найдена');
    }

    const totalPrice = excursion.price * dto.people;

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        excursionId: dto.excursionId,
        people: dto.people,
        totalPrice,
        date: new Date(dto.date),
        phone: dto.phone,
      },
    });

    return booking;
  }

  async findMy(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        excursion: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            duration: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Это не ваше бронирование');
    }

    await this.prisma.booking.delete({ where: { id } });

    return { message: 'Бронирование отменено' };
  }
}