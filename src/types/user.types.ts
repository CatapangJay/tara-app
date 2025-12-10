export type UserRole = 'passenger' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePhoto?: string;
  rating: number;
  totalTrips: number;
  memberSince: string; // ISO date string
}

export interface Profile {
  user: User;
  // Additional profile fields can be added here
}
