import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

const mockRealtor = {
  id: '64da34804e6405d221df5f19---',
  name: 'Saeed',
  email: 'Stockholm@gmail.com',
  phone: '23904092394',
};

const mockHome = {
  id: '64da3e8ab4d187996dff8f3e',
  address: '123 Main St',
  listed_date: '2023-08-14T14:47:38.312Z',
  price: 250000,
  land_size: 0.25,
  city: 'Stockholm',
  realtorId: '64da34804e6405d221df5f19',
  property_type: PropertyType.RESIDENTIAL,
  image: 'https://example.com/images/home123.jpg',
  number_of_edrooms: 3,
  number_of_bathrooms: 2.5,
};

describe('HomeController', () => {
  let controller: HomeController;
  let service: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            findAll: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockRealtor),
            update: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    service = module.get<HomeService>(HomeService);
  });

  describe('findAll', () => {
    it('should construct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(service, 'findAll').mockImplementation(mockGetHomes);
      await controller.findAll(
        'Stockholm',
        '2000',
        '34000034',
        PropertyType.RESIDENTIAL,
      );
      expect(mockGetHomes).toBeCalledWith({
        city: 'Stockholm',
        price: {
          lte: 34000034,
          gte: 2000,
        },
        propertyType: 'RESIDENTIAL',
      });
    });
  });

  describe('update', () => {
    const mockHome = {
      city: 'Stockholm',
      price: 12000,
      numberOfBathrooms: 1,
      numberOfBedrooms: 2,
      propertyType: PropertyType.RESIDENTIAL,
      landSize: 55,
      address: 'Sodermalm 13 , lgh 1201',
      images: [
        {
          url: 'src.jpg',
        },
      ],
    };
    it('should throw error if realtor didnt add the home', async () => {
      const mockedUser = {
        name: 'Ali',
        id: '33',
        iat: 3333,
        exp: 2222,
      };
      expect(() =>
        controller.update('5', mockHome, mockedUser),
      ).rejects.toThrowError(UnauthorizedException);
    });

    // test also if id match so the update function should be called
  });
});
