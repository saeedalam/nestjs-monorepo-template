import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { ResponseDto } from './dto/response.dto';
import { PropertyType } from '@prisma/client';
import { DatabaseService } from '@app/common/database/database.service';

interface IFilters {
  city?: string;
  propertyType: PropertyType;
  price: {
    lte: number;
    gte: number;
  };
}

export const homeSelect = {
  id: true,
  address: true,
  listed_date: true,
  price: true,
  land_size: true,
  city: true,
  realtorId: true,
  number_of_bathrooms: true,
  number_of_bedrooms: true,
  propertyType: true,
};

@Injectable()
export class HomeService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    {
      city,
      price,
      numberOfBathrooms,
      numberOfBedrooms,
      propertyType,
      landSize,
      address,
      images,
    }: CreateHomeDto,
    userId: string,
  ) {
    const home = await this.databaseService.home.create({
      data: {
        city,
        price,
        propertyType,
        land_size: landSize,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        address,
        realtorId: userId,
      },
    });

    const imgList = images.map((image) => {
      return { ...image, homeId: home.id };
    });

    await this.databaseService.image.createMany({
      data: imgList,
    });

    return new ResponseDto(home);
  }

  async findAll(filters: IFilters): Promise<ResponseDto[]> {
    const homes = await this.databaseService.home.findMany({
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filters,
    });

    if (!homes) {
      throw new NotFoundException('No home matched!');
    }

    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0]?.url };
      delete fetchHome.images;
      return new ResponseDto(fetchHome);
    });
  }

  async findOne(id: string) {
    const home = await this.databaseService.home.findUnique({
      where: {
        id,
      },
    });

    Logger.log(home);

    return new ResponseDto(home);
  }

  //practice : get dto classes in controllers  /get dto interfaces in services
  async update(id: string, updateHomeDto: UpdateHomeDto) {
    const home = await this.databaseService.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException('Home not found!');
    }

    const updatedHome = await this.databaseService.home.update({
      data: updateHomeDto,
      where: {
        id,
      },
    });

    Logger.log(updatedHome);

    return new ResponseDto(updatedHome);
  }

  async remove(id: string) {
    await this.databaseService.image.deleteMany({
      where: {
        homeId: id,
      },
    });

    await this.databaseService.home.delete({
      where: {
        id,
      },
    });
  }

  async getRealtorByHomeId(id: string) {
    const home = await this.databaseService.home.findUnique({
      where: { id },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    if (!home) throw new NotFoundException();
    return home.realtor;
  }
}
