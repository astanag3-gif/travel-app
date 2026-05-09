import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Список всех тегов' })
  @ApiResponse({ status: 200, description: 'Массив тегов' })
  async findAll() {
    return this.prisma.tag.findMany();
  }
}