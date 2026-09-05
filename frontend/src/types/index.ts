export type UserRole = 'ADMIN' | 'USER' | 'STORE_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  averageRating?: number | null;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId?: string;
  overallRating: number | null;
  userRating?: number | null;
  category?: string;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  user?: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  store?: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
}

export interface OwnerStoreDashboard {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number | null;
  ratings: {
    rating: number;
    user: {
      id: string;
      name: string;
      email: string;
      address: string;
    };
  }[];
}

export interface AdminDashboard {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
