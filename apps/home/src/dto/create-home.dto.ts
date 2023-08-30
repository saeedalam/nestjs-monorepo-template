import { PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateHomeDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsPositive()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  landSize: number;

  @IsNotEmpty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];

  // @IsString()
  // @IsNotEmpty()
  // realtorId: string;
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}
