import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(8, 16)
  currentPassword!: string;

  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/, { message: 'newPassword must contain an uppercase letter and a special character' })
  newPassword!: string;
}
