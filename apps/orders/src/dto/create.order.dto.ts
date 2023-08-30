import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsString()
  homeId: string;

  @IsString()
  letter: string;
}
