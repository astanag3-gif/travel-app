import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  excursionId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  people: number;

  @ApiProperty({ example: '2025-07-15T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '+7 777 123 4567' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}