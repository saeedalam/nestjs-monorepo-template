import { CreateOrderDto } from '../../dto/create.order.dto';

export class CreateOrderCommand {
  constructor(private readonly createOrderDto: CreateOrderDto) {}
}
