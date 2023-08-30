import { IsString } from 'class-validator';

export class Order {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  homeId: string;

  @IsString()
  letter: string;
}
