export type PaymentMethod = 'cash' | 'gcash' | 'paymaya' | 'card';

export interface Fare {
  baseFare: number; // in PHP
  distanceFare: number; // in PHP
  total: number; // in PHP
  currency: 'PHP';
}

export interface Payment {
  id: string;
  amount: number; // in PHP
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string; // ISO date string
  tip?: number; // Optional tip in PHP
}
