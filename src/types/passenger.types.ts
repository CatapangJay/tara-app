import { User } from './user.types';

export interface Passenger extends User {
  savedLocations?: {
    home?: string;
    work?: string;
    favorites?: string[];
  };
}
