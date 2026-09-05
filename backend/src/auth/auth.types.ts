export const USER_ROLES = ['ADMIN', 'USER', 'STORE_OWNER'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface AuthenticatedUser {
  sub: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload extends AuthenticatedUser {
  iat?: number;
  exp?: number;
}
