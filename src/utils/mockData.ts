import { SAN_PABLO_CENTER, SAN_PABLO_LANDMARKS } from '../constants/philippines';
import { Driver, VehicleType } from '../types/driver.types';
import { Passenger } from '../types/passenger.types';
import { Ride } from '../types/ride.types';

// Mock Passenger User
export const MOCK_PASSENGER: Passenger = {
  id: 'passenger-001',
  name: 'Maria Santos',
  email: 'maria.santos@example.com',
  phone: '+63 917 123 4567',
  role: 'passenger',
  profilePhoto: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=MS',
  rating: 4.8,
  totalTrips: 24,
  memberSince: '2024-01-15T00:00:00.000Z',
  savedLocations: {
    home: 'Brgy. San Jose, San Pablo City',
    work: 'SM City San Pablo',
  },
};

// Mock Driver User
export const MOCK_DRIVER: Driver = {
  id: 'driver-001',
  name: 'Juan dela Cruz',
  email: 'juan.delacruz@example.com',
  phone: '+63 918 765 4321',
  role: 'driver',
  profilePhoto: 'https://via.placeholder.com/150/4169E1/FFFFFF?text=JC',
  rating: 4.9,
  totalTrips: 156,
  memberSince: '2023-06-01T00:00:00.000Z',
  vehicle: {
    type: 'sedan',
    make: 'Toyota',
    model: 'Vios',
    year: 2020,
    color: 'White',
    plateNumber: 'ABC 1234',
    capacity: 4,
  },
  isOnline: false,
  currentLocation: SAN_PABLO_CENTER,
  subscription: {
    plan: 'pro',
    price: 1999,
    startDate: '2024-11-01T00:00:00.000Z',
    endDate: '2024-12-01T00:00:00.000Z',
    isActive: true,
  },
  earnings: {
    today: 1250,
    week: 5600,
    month: 18750,
    total: 125000,
  },
};

// Generate mock drivers around San Pablo City
export function generateMockDrivers(count: number = 5): Driver[] {
  const drivers: Driver[] = [];
  const vehicleTypes: VehicleType[] = ['sedan', 'suv', 'tricycle', 'motorcycle'];
  const names = [
    'Pedro Garcia',
    'Jose Reyes',
    'Antonio Cruz',
    'Carlos Lopez',
    'Miguel Torres',
    'Francisco Ramos',
    'Manuel Flores',
    'Ricardo Gonzales',
  ];
  
  const vehicles = {
    sedan: ['Toyota Vios', 'Honda City', 'Mazda 3', 'Hyundai Accent'],
    suv: ['Toyota Fortuner', 'Mitsubishi Montero', 'Ford Everest', 'Isuzu mu-X'],
    tricycle: ['Tricycle', 'Tricycle', 'Tricycle', 'Tricycle'],
    motorcycle: ['Honda TMX', 'Yamaha Mio', 'Suzuki Raider', 'Kawasaki Barako'],
  };
  
  for (let i = 0; i < count; i++) {
    const vehicleType = vehicleTypes[i % vehicleTypes.length];
    const vehicleModel = vehicles[vehicleType][i % vehicles[vehicleType].length];
    
    // Generate random location near San Pablo Center
    const latOffset = (Math.random() - 0.5) * 0.02; // ~1km radius
    const lonOffset = (Math.random() - 0.5) * 0.02;
    
    drivers.push({
      id: `driver-${String(i + 1).padStart(3, '0')}`,
      name: names[i % names.length],
      email: `driver${i + 1}@example.com`,
      phone: `+63 ${Math.floor(900000000 + Math.random() * 100000000)}`,
      role: 'driver',
      profilePhoto: `https://via.placeholder.com/150/${Math.floor(Math.random() * 16777215).toString(16)}/FFFFFF?text=D${i + 1}`,
      rating: 4.5 + Math.random() * 0.5,
      totalTrips: Math.floor(Math.random() * 200) + 50,
      memberSince: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      vehicle: {
        type: vehicleType,
        make: vehicleModel.split(' ')[0],
        model: vehicleModel.split(' ')[1] || vehicleModel,
        year: 2018 + Math.floor(Math.random() * 6),
        color: ['White', 'Black', 'Silver', 'Blue', 'Red'][Math.floor(Math.random() * 5)],
        plateNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(1000 + Math.random() * 9000)}`,
        capacity: vehicleType === 'motorcycle' ? 1 : vehicleType === 'tricycle' ? 3 : vehicleType === 'sedan' ? 4 : 6,
      },
      isOnline: Math.random() > 0.3,
      currentLocation: {
        latitude: SAN_PABLO_CENTER.latitude + latOffset,
        longitude: SAN_PABLO_CENTER.longitude + lonOffset,
      },
      subscription: {
        plan: ['basic', 'pro', 'premium'][Math.floor(Math.random() * 3)] as 'basic' | 'pro' | 'premium',
        price: [999, 1999, 2999][Math.floor(Math.random() * 3)],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      },
      earnings: {
        today: Math.floor(Math.random() * 2000),
        week: Math.floor(Math.random() * 10000),
        month: Math.floor(Math.random() * 30000),
        total: Math.floor(Math.random() * 200000),
      },
    });
  }
  
  return drivers;
}

// Generate mock ride history
export function generateMockRideHistory(count: number = 5): Ride[] {
  const rides: Ride[] = [];
  const drivers = generateMockDrivers(count);
  
  for (let i = 0; i < count; i++) {
    const pickup = SAN_PABLO_LANDMARKS[Math.floor(Math.random() * SAN_PABLO_LANDMARKS.length)];
    const destination = SAN_PABLO_LANDMARKS[Math.floor(Math.random() * SAN_PABLO_LANDMARKS.length)];
    
    const fare = Math.floor(50 + Math.random() * 200);
    const requestedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const acceptedAt = new Date(requestedAt.getTime() + 30000);
    const startedAt = new Date(acceptedAt.getTime() + 5 * 60000);
    const completedAt = new Date(startedAt.getTime() + 15 * 60000);
    
    rides.push({
      id: `ride-${String(i + 1).padStart(3, '0')}`,
      passenger: MOCK_PASSENGER,
      driver: drivers[i],
      route: {
        origin: pickup,
        destination: destination,
        distance: 5 + Math.random() * 10,
        duration: 10 + Math.floor(Math.random() * 20),
      },
      vehicleType: drivers[i].vehicle.type,
      fare: {
        baseFare: Math.floor(fare * 0.4),
        distanceFare: Math.floor(fare * 0.6),
        total: fare,
        currency: 'PHP',
      },
      payment: {
        id: `payment-${String(i + 1).padStart(3, '0')}`,
        amount: fare,
        method: ['cash', 'gcash', 'paymaya'][Math.floor(Math.random() * 3)] as 'cash' | 'gcash' | 'paymaya',
        status: 'completed',
        timestamp: completedAt.toISOString(),
        tip: Math.random() > 0.5 ? [20, 50, 100][Math.floor(Math.random() * 3)] : undefined,
      },
      status: 'completed',
      requestedAt: requestedAt.toISOString(),
      acceptedAt: acceptedAt.toISOString(),
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      ratings: {
        passengerRating: 4 + Math.random(),
        driverRating: 4 + Math.random(),
      },
    });
  }
  
  return rides.sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
}
