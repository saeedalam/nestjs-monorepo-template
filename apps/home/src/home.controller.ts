import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { ResponseDto } from './dto/response.dto';
import { PropertyType, UserType } from '@prisma/client';
import { AuthGuard } from '@app/common/auth/guards/auth/auth.guard';
import { Roles } from '@app/common/auth/decorators/role-decorator';
import { User } from '@app/common/auth/decorators/user-decorator';
import { UserInfo } from '@app/common/auth/interceptors/user-interceptor';

@Controller('v1/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN, UserType.REALTOR)
  create(@Body() createHomeDto: CreateHomeDto, @User() user: UserInfo) {
    return this.homeService.create(createHomeDto, user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN, UserType.REALTOR, UserType.BUYER)
  findAll(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<ResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHomeDto: UpdateHomeDto,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.update(id, updateHomeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: UserInfo) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.remove(id);
  }
}
