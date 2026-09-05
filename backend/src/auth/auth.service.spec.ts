import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: any;
  let jwtService: any;

  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'user@example.com',
    passwordHash: '',
    address: '123 Test St',
    role: 'USER' as const,
  };

  beforeEach(async () => {
    mockUser.passwordHash = await bcrypt.hash('Password123!', 10);

    prismaService = {
      client: {
        orm: {
          public: {
            User: {
              where: jest.fn().mockReturnThis(),
              first: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      },
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      prismaService.client.orm.public.User.first.mockResolvedValue(null);
      prismaService.client.orm.public.User.create.mockImplementation((data: any) =>
        Promise.resolve({ id: 'new-id', ...data }),
      );

      const result = await authService.register({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'Password123!',
        address: '123 St',
      });

      expect(result).toHaveProperty('id', 'new-id');
      expect(result).toHaveProperty('email', 'newuser@example.com');
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should throw ConflictException if email already exists', async () => {
      prismaService.client.orm.public.User.first.mockResolvedValue(mockUser);

      await expect(
        authService.register({
          name: 'Test User',
          email: 'user@example.com',
          password: 'Password123!',
          address: '123 St',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user and return access token', async () => {
      prismaService.client.orm.public.User.first.mockResolvedValue(mockUser);

      const result = await authService.login({
        email: 'user@example.com',
        password: 'Password123!',
      });

      expect(result).toHaveProperty('accessToken', 'mock-jwt-token');
      expect(result.user).toHaveProperty('email', 'user@example.com');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      prismaService.client.orm.public.User.first.mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'user@example.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
