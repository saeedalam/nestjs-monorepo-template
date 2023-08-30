import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNumber, IsEnum } from 'class-validator';

export class ResponseDto {
  constructor(partial: Partial<ResponseDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  id: string;

  @IsString()
  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  @IsString()
  city: string;

  @Exclude()
  listed_at: Date;

  @Expose({ name: 'listedAt' })
  listedAt() {
    return this.listed_at;
  }

  @IsNumber()
  price: number;

  @IsNumber()
  land_size: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  image: string;

  // Include any other properties you want to expose in the response
}
