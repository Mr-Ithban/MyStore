import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsString, Length, Matches, MaxLength } from 'class-validator';
import { USER_ROLES, type UserRole } from '../../auth/auth.types.js';
export class CreateUserDto {
  @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value) @IsString() @Length(20, 60) name!: string;
  @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim().toLowerCase() : value) @IsEmail() @MaxLength(255) email!: string;
  @IsString() @Length(8, 16) @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/, { message: 'password must contain an uppercase letter and a special character' }) password!: string;
  @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value) @IsString() @MaxLength(400) address!: string;
  @IsIn(USER_ROLES) role!: UserRole;
}
