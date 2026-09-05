import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('StoresService', () => {
  let storesService: StoresService;
  let prismaService: any;

  const mockStore = {
    id: 'store-1',
    name: 'Tech Store',
    email: 'tech@store.com',
    address: '100 Main St',
    ownerId: 'owner-1',
  };

  const mockRating = {
    id: 'rating-1',
    userId: 'user-1',
    storeId: 'store-1',
    rating: 5,
  };

  async function* asyncGenerator<T>(array: T[]): AsyncIterable<T> {
    for (const item of array) {
      yield item;
    }
  }

  beforeEach(async () => {
    prismaService = {
      client: {
        orm: {
          public: {
            Store: {
              all: jest.fn().mockImplementation(() => asyncGenerator([mockStore])),
              where: jest.fn().mockReturnThis(),
              first: jest.fn(),
            },
            Rating: {
              all: jest.fn().mockImplementation(() => asyncGenerator([mockRating])),
            },
            User: {
              all: jest.fn().mockImplementation(() => asyncGenerator([])),
            },
          },
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    storesService = module.get<StoresService>(StoresService);
  });

  describe('findAll', () => {
    it('should return paginated stores with ratings', async () => {
      const result = await storesService.findAll('user-1', {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 'store-1',
        name: 'Tech Store',
        overallRating: 5,
        userRating: 5,
      });
    });
  });

  describe('findOne', () => {
    it('should return single store detail', async () => {
      prismaService.client.orm.public.Store.first.mockResolvedValue(mockStore);

      const result = await storesService.findOne('store-1', 'user-1');
      expect(result).toMatchObject({
        id: 'store-1',
        overallRating: 5,
        userRating: 5,
      });
    });

    it('should throw NotFoundException if store does not exist', async () => {
      prismaService.client.orm.public.Store.first.mockResolvedValue(null);

      await expect(storesService.findOne('non-existent', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
