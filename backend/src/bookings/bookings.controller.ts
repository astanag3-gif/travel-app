import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Записаться на экскурсию' })
  @ApiResponse({ status: 201, description: 'Бронирование создано' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Экскурсия не найдена' })
  create(@Request() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Мои бронирования' })
  @ApiResponse({ status: 200, description: 'Список бронирований' })
  findMy(@Request() req: any) {
    return this.bookingsService.findMy(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Отменить бронирование' })
  @ApiResponse({ status: 200, description: 'Бронирование отменено' })
  @ApiResponse({ status: 403, description: 'Чужое бронирование' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.bookingsService.remove(id, req.user.id);
  }
}