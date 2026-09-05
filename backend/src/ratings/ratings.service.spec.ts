import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RatingsService } from './ratings.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('RatingsService', () => {
  let ratingsService: RatingsService;
  let prismaService: any;

  const mockStore = { id: 'store-1', name: 'Store 1' };
  const mockRating = { id: 'rating-1', userId: 'user-1', storeId: 'store-1', rating: 4 };

  beforeEach(async () => {
    prismaService = {
      client: {
        orm: {
          public: {
            Store: {
              where: jest.fn().mockReturnThis(),
              first: jest.fn(),
            },
            Rating: {
              where: jest.fn().mockReturnThis(),
              first: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    ratingsService = module.get<RatingsService>(RatingsService);
  });

  describe('create', () => {
    it('should create a rating when valid store and no previous rating exists', async () => {
      prismaService.client.orm.public.Store.first.mockResolvedValue(mockStore);
      prismaService.client.orm.public.Rating.first.mockResolvedValue(null);
      prismaService.client.orm.public.Rating.create.mockResolvedValue(mockRating);

      const result = await ratingsService.create('user-1', { storeId: 'store-1', rating: 4 });
      expect(result).toEqual(mockRating);
    });

    it('should throw NotFoundException if store does not exist', async () => {
      prismaService.client.orm.public.Store.first.mockResolvedValue(null);

      await expect(
        ratingsService.create('user-1', { storeId: 'store-999', rating: 4 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if rating already exists', async () => {
      prismaService.client.orm.public.Store.first.mockResolvedValue(mockStore);
      prismaService.client.orm.public.Rating.first.mockResolvedValue(mockRating);

      await expect(
        ratingsService.create('user-1', { storeId: 'store-1', rating: 4 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update an existing rating', async () => {
      prismaService.client.orm.public.Rating.first.mockResolvedValue(mockRating);
      prismaService.client.orm.public.Rating.update.mockResolvedValue({ ...mockRating, rating: 5 });

      const result = await ratingsService.update('user-1', 'store-1', { rating: 5 });
      expect(result.rating).toBe(5);
    });

    it('should throw NotFoundException if trying to update non-existent rating', async () => {
      prismaService.client.orm.public.Rating.first.mockResolvedValue(null);

      await expect(
        ratingsService.update('user-1', 'store-1', { rating: 5 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
