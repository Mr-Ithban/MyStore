import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AdminService', () => {
  let adminService: AdminService;
  let prismaService: any;

  const mockUser = {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: 'hash',
    address: 'Admin Addr',
    role: 'ADMIN' as const,
  };

  const mockStore = {
    id: 'store-1',
    name: 'Admin Store',
    email: 'admin@store.com',
    address: 'Store Addr',
    ownerId: 'owner-1',
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
            User: {
              all: jest.fn().mockImplementation(() => asyncGenerator([mockUser])),
              where: jest.fn().mockReturnThis(),
              first: jest.fn(),
              create: jest.fn(),
            },
            Store: {
              all: jest.fn().mockImplementation(() => asyncGenerator([mockStore])),
              where: jest.fn().mockReturnThis(),
              first: jest.fn(),
              create: jest.fn(),
            },
            Rating: {
              all: jest.fn().mockImplementation(() => asyncGenerator([])),
            },
          },
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
  });

  describe('dashboard', () => {
    it('should return metrics counts', async () => {
      const result = await adminService.dashboard();
      expect(result).toEqual({
        totalUsers: 1,
        totalStores: 1,
        totalRatings: 0,
      });
    });
  });

  describe('listUsers', () => {
    it('should list users without passwordHash', async () => {
      const result = await adminService.listUsers({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).not.toHaveProperty('passwordHash');
      expect(result.data[0]).toMatchObject({ id: 'user-1', email: 'admin@example.com' });
    });
  });
});
