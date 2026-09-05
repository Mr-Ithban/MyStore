import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { ChangePasswordDto } from './dto/change-password.dto.js';
import type { UserRole } from './auth.types.js';

type Varchar<Length extends number> = string & { readonly __varcharLength: Length };
const varchar = <Length extends number>(value: string) => value as Varchar<Length>;

type DatabaseUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  address: string;
  role: UserRole;
};

type PublicUser = Omit<DatabaseUser, 'passwordHash'>;

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<PublicUser> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const user = await this.prisma.client.orm.public.User.create({
      name: varchar<60>(dto.name),
      email: varchar<255>(dto.email),
      passwordHash: varchar<255>(passwordHash),
      address: varchar<400>(dto.address),
      role: 'USER',
    });

    return this.toPublicUser(user);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: PublicUser }> {
    const user = await this.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, user: this.toPublicUser(user) };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.client.orm.public.User.where({ id: userId }).first();
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect.');
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, this.saltRounds);
    await this.prisma.client.orm.public.User.where({ id: userId }).update({ passwordHash: varchar<255>(passwordHash) });
  }

  private async findByEmail(email: string): Promise<DatabaseUser | null> {
    return this.prisma.client.orm.public.User.where({ email: varchar<255>(email) }).first();
  }

  private toPublicUser(user: DatabaseUser): PublicUser {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }
}
