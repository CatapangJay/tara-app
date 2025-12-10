export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  coordinates: Coordinates;
  address: string;
  landmark?: string;
}

export interface Route {
  origin: Location;
  destination: Location;
  distance: number; // in kilometers
  duration: number; // in minutes
  polyline?: string;
}
