// === Enums ===
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

// === Models ===
export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface ExcursionTag {
  tag: Tag;
}

export interface Excursion {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  format: string;
  maxPeople: number;
  categoryId: number;
  createdAt: string;
  category: Category;
  tags: ExcursionTag[];
}

export interface Booking {
  id: number;
  userId: number;
  excursionId: number;
  people: number;
  totalPrice: number;
  status: BookingStatus;
  date: string;
  phone: string;
  createdAt: string;
  excursion: {
    id: number;
    title: string;
    imageUrl: string;
    duration: number;
  };
}

// === API Responses ===
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExcursionsResponse {
  data: Excursion[];
  meta: PaginationMeta;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// === API Request Bodies ===
export interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateExcursionBody {
  title: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  format: string;
  maxPeople: number;
  categoryId: number;
  tagIds: number[];
}

export interface CreateBookingBody {
  excursionId: number;
  people: number;
  date: string;
  phone: string;
}