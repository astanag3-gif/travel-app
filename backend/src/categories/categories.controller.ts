import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Список категорий' })
  @ApiResponse({ status: 200, description: 'Массив категорий' })
  findAll() {
    return this.prisma.category.findMany({
      orderBy: { id: 'asc' },
    });
  }
}