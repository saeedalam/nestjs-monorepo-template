import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class Home {
  id: string;
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
  city: string;
  price: number;
  land_size: number;
  propertyType: PropertyType;
  //   realtor: User;
  //   messages: Message[];
  //   images: Image[];
}
