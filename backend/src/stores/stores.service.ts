import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { StoreQueryDto } from './dto/store-query.dto.js';
type Store = { id: string; name: string; email: string; address: string; ownerId: string };
type Rating = { id: string; userId: string; storeId: string; rating: number };
export type StoreResponse = Omit<Store, 'ownerId'> & { overallRating: number | null; userRating: number | null };
@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(userId: string, query: StoreQueryDto) {
    const [stores, ratings] = await Promise.all([this.collect(this.prisma.client.orm.public.Store.all()), this.collect(this.prisma.client.orm.public.Rating.all())]);
    const needle = query.search?.toLowerCase();
    const data = stores.filter((s) => !needle || s.name.toLowerCase().includes(needle) || s.address.toLowerCase().includes(needle)).map((s) => this.toResponse(s, ratings, userId));
    const direction = query.sortOrder === 'asc' ? 1 : -1;
    data.sort((a, b) => (query.sortBy === 'overallRating' ? (a.overallRating ?? -1) - (b.overallRating ?? -1) : a[query.sortBy].localeCompare(b[query.sortBy])) * direction);
    const total = data.length; const start = (query.page - 1) * query.limit;
    return { data: data.slice(start, start + query.limit), meta: { total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) } };
  }
  async findOne(id: string, userId: string) { const [store, ratings] = await Promise.all([this.prisma.client.orm.public.Store.where({ id }).first() as Promise<Store | null>, this.collect(this.prisma.client.orm.public.Rating.all())]); if (!store) throw new NotFoundException('Store not found.'); return this.toResponse(store, ratings, userId); }
  private toResponse(store: Store, ratings: Rating[], userId: string): StoreResponse { const list = ratings.filter((r) => r.storeId === store.id); const { ownerId: _, ...publicStore } = store; return { ...publicStore, overallRating: list.length ? Number((list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(2)) : null, userRating: list.find((r) => r.userId === userId)?.rating ?? null }; }
  private async collect<T>(rows: AsyncIterable<T>): Promise<T[]> { const results: T[] = []; for await (const row of rows) results.push(row); return results; }
}
