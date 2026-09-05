import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export class StoreQueryDto {
  @IsOptional() @IsString() @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value) search?: string;
  @IsOptional() @IsIn(['name', 'address', 'email', 'overallRating']) sortBy: 'name' | 'address' | 'email' | 'overallRating' = 'name';
  @IsOptional() @IsIn(['asc', 'desc']) sortOrder: 'asc' | 'desc' = 'asc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}
