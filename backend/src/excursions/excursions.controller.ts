import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExcursionsService } from './excursions.service';
import { CreateExcursionDto, UpdateExcursionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Excursions')
@Controller('excursions')
export class ExcursionsController {
  constructor(private excursionsService: ExcursionsService) {}

  @Get()
  @ApiOperation({ summary: 'Список экскурсий с пагинацией и фильтрами' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 9 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiResponse({ status: 200, description: 'Список экскурсий' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.excursionsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Одна экскурсия' })
  @ApiResponse({ status: 200, description: 'Экскурсия найдена' })
  @ApiResponse({ status: 404, description: 'Не найдена' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.excursionsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать экскурсию (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Экскурсия создана' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Нет прав (не ADMIN)' })
  create(@Body() dto: CreateExcursionDto) {
    return this.excursionsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить экскурсию (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Экскурсия обновлена' })
  @ApiResponse({ status: 404, description: 'Не найдена' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExcursionDto,
  ) {
    return this.excursionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить экскурсию (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Экскурсия удалена' })
  @ApiResponse({ status: 404, description: 'Не найдена' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.excursionsService.remove(id);
  }
}