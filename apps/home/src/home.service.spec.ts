import { Test, TestingModule } from '@nestjs/testing';
import { HomeService, homeSelect } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

const mockGetHomes = [
  {
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
    images: [
      {
        url: 'a.jpg',
      },
    ],
  },
];

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

const mockImages = [
  {
    id: '1',
    url: 'a.jpg',
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;
  const filters = {
    city: 'Stockholm',
    propertyType: PropertyType.RESIDENTIAL,
    price: {
      lte: 10,
      gte: 1000000,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should prisma calls findMany with correct filters', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.findAll(filters);
      expect(mockPrismaFindManyHomes).toBeCalledWith({
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
    });

    it('should throw error if no home matched!', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(undefined);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.findAll(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createHomeParams = {
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

    it('should call prisma.home.create if given correct payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      const result = await service.create(createHomeParams, '5');

      expect(mockCreateHome).toBeCalledWith({
        data: {
          city: 'Stockholm',
          price: 12000,
          number_of_bathrooms: 1,
          number_of_bedrooms: 2,
          propertyType: PropertyType.RESIDENTIAL,
          land_size: 55,
          address: 'Sodermalm 13 , lgh 1201',
          realtorId: '5',
        },
      });

      expect(result).toEqual(mockHome);
    });

    it('should call prisma.image.createMany if given correct payload', async () => {
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImage);

      const result = await service.create(createHomeParams, '5');

      expect(mockCreateManyImage).toBeCalledWith({
        data: [
          {
            url: 'src.jpg',
            homeId: '64da3e8ab4d187996dff8f3e',
          },
        ],
      });

      expect(result).toEqual(mockHome);
    });
  });
});
