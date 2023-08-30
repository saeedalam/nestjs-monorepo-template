import { PropertyType } from '@prisma/client';
import { IsString, IsInt, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  numberOfBathrooms?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  landSize?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}
