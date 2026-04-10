import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, Min, Max } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'The Pragmatic Programmer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Andy Hunt' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ example: 1999 })
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}