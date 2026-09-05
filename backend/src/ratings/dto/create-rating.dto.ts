import { Type } from 'class-transformer';
import { IsInt, IsUUID, Max, Min } from 'class-validator';
export class CreateRatingDto { @IsUUID() storeId!: string; @Type(() => Number) @IsInt() @Min(1) @Max(5) rating!: number; }
