import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateExcursionDto {
  @ApiProperty({ example: 'Астана — от крепости к величию' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Полная обзорная экскурсия по столице...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 8000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-example' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: 'автобусная' })
  @IsString()
  @IsNotEmpty()
  format: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @IsPositive()
  maxPeople: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: [1, 2], required: false })
  @IsArray()
  @IsOptional()
  tagIds?: number[];
}