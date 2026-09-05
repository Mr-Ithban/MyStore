import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateRatingDto } from './dto/create-rating.dto.js'; import type { UpdateRatingDto } from './dto/update-rating.dto.js';
type Rating = { id: string; userId: string; storeId: string; rating: number };
@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, dto: CreateRatingDto) { const store = await this.prisma.client.orm.public.Store.where({ id: dto.storeId }).first(); if (!store) throw new NotFoundException('Store not found.'); if (await this.findOwnRecord(userId, dto.storeId)) throw new ConflictException('You have already rated this store. Use the update endpoint instead.'); return this.prisma.client.orm.public.Rating.create({ userId, storeId: dto.storeId, rating: dto.rating }) as Promise<Rating>; }
  async update(userId: string, storeId: string, dto: UpdateRatingDto) { const rating = await this.findOwnRecord(userId, storeId); if (!rating) throw new NotFoundException('Rating not found.'); return this.prisma.client.orm.public.Rating.where({ id: rating.id }).update({ rating: dto.rating }) as Promise<Rating>; }
  async findOwn(userId: string, storeId: string) { const rating = await this.findOwnRecord(userId, storeId); if (!rating) throw new NotFoundException('Rating not found.'); return rating; }
  private findOwnRecord(userId: string, storeId: string) { return this.prisma.client.orm.public.Rating.where({ userId, storeId }).first() as Promise<Rating | null>; }
}
