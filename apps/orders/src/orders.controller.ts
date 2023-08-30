import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/impl/create-order-command';
import { Roles } from '@app/common/auth/decorators/role-decorator';
import { UserType } from '@prisma/client';
import { AuthGuard } from '@app/common/auth/guards/auth/auth.guard';
import { CreateOrderDto } from './dto/create.order.dto';
import { GetOrderQuery } from './queries/impl/get-order-query';

@Controller('/orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserType.BUYER)
  @UseGuards(AuthGuard)
  create(@Body() createOrderDto: CreateOrderDto) {
    const command = new CreateOrderCommand(createOrderDto);

    return this.commandBus.execute(command);
  }

  @Get()
  findById(@Param('id') id: string) {
    const query = new GetOrderQuery(id);
    return this.queryBus.execute(query);
  }
}
