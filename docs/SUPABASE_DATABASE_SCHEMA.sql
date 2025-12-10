-- Tara App - Complete Supabase Database Schema
-- Run this SQL in Supabase SQL Editor after creating your project

-- ============================================================================
-- 0. ENABLE POSTGIS EXTENSION (Required for location features)
-- ============================================================================

-- Enable PostGIS extension for geography/geometry types
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- 1. USERS TABLE (extends auth.users)
-- ============================================================================

CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) CHECK (role IN ('passenger', 'driver', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================================
-- 2. DRIVERS TABLE
-- ============================================================================

CREATE TABLE public.drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_expiry DATE NOT NULL,
  license_photo_url TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verification_notes TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  subscription_plan VARCHAR(20) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium')),
  is_online BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT false,
  current_location GEOGRAPHY(POINT),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Drivers can view own record" 
  ON public.drivers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Drivers can update own record" 
  ON public.drivers FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Drivers can insert own record" 
  ON public.drivers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "All users can view approved drivers" 
  ON public.drivers FOR SELECT 
  USING (verification_status = 'approved');

-- Trigger for updated_at
CREATE TRIGGER on_drivers_updated
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================================
-- 3. VEHICLES TABLE
-- ============================================================================

CREATE TABLE public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('tricycle', 'motorcycle', 'car', 'van')),
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(30) NOT NULL,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 4,
  photo_url TEXT,
  or_cr_url TEXT, -- Official Receipt / Certificate of Registration
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Drivers can manage own vehicles" 
  ON public.vehicles FOR ALL 
  USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

CREATE POLICY "All users can view approved vehicles" 
  ON public.vehicles FOR SELECT 
  USING (verification_status = 'approved');

-- Trigger for updated_at
CREATE TRIGGER on_vehicles_updated
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================================
-- 4. PASSENGERS TABLE
-- ============================================================================

CREATE TABLE public.passengers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  favorite_locations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Passengers can view own record" 
  ON public.passengers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Passengers can update own record" 
  ON public.passengers FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Passengers can insert own record" 
  ON public.passengers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER on_passengers_updated
  BEFORE UPDATE ON public.passengers
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================================
-- 5. RIDES TABLE
-- ============================================================================

CREATE TABLE public.rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  passenger_id UUID REFERENCES public.passengers(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  
  -- Locations
  pickup_location GEOGRAPHY(POINT) NOT NULL,
  pickup_address TEXT NOT NULL,
  dropoff_location GEOGRAPHY(POINT) NOT NULL,
  dropoff_address TEXT NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN 
    ('pending', 'accepted', 'driver_arriving', 'in_progress', 'completed', 'cancelled')),
  
  -- Pricing
  estimated_fare DECIMAL(10,2),
  final_fare DECIMAL(10,2),
  distance_km DECIMAL(10,2),
  
  -- Ratings
  passenger_rating INTEGER CHECK (passenger_rating >= 1 AND passenger_rating <= 5),
  driver_rating INTEGER CHECK (driver_rating >= 1 AND driver_rating <= 5),
  passenger_feedback TEXT,
  driver_feedback TEXT,
  
  -- Timestamps
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Passengers can view own rides" 
  ON public.rides FOR SELECT 
  USING (passenger_id IN (SELECT id FROM public.passengers WHERE user_id = auth.uid()));

CREATE POLICY "Drivers can view assigned rides" 
  ON public.rides FOR SELECT 
  USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

CREATE POLICY "Passengers can create rides" 
  ON public.rides FOR INSERT 
  WITH CHECK (passenger_id IN (SELECT id FROM public.passengers WHERE user_id = auth.uid()));

CREATE POLICY "Passengers can update own rides" 
  ON public.rides FOR UPDATE 
  USING (passenger_id IN (SELECT id FROM public.passengers WHERE user_id = auth.uid()));

CREATE POLICY "Drivers can update assigned rides" 
  ON public.rides FOR UPDATE 
  USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER on_rides_updated
  BEFORE UPDATE ON public.rides
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================================

-- User lookups
CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- Driver lookups
CREATE INDEX idx_drivers_user_id ON public.drivers(user_id);
CREATE INDEX idx_drivers_verification_status ON public.drivers(verification_status);
CREATE INDEX idx_drivers_is_online ON public.drivers(is_online);
CREATE INDEX idx_drivers_is_available ON public.drivers(is_available);

-- Vehicle lookups
CREATE INDEX idx_vehicles_driver_id ON public.vehicles(driver_id);
CREATE INDEX idx_vehicles_plate_number ON public.vehicles(plate_number);
CREATE INDEX idx_vehicles_verification_status ON public.vehicles(verification_status);

-- Passenger lookups
CREATE INDEX idx_passengers_user_id ON public.passengers(user_id);

-- Ride lookups
CREATE INDEX idx_rides_passenger_id ON public.rides(passenger_id);
CREATE INDEX idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX idx_rides_status ON public.rides(status);
CREATE INDEX idx_rides_requested_at ON public.rides(requested_at DESC);

-- Geospatial indexes for location-based queries
CREATE INDEX idx_drivers_location ON public.drivers USING GIST(current_location);
CREATE INDEX idx_rides_pickup_location ON public.rides USING GIST(pickup_location);

-- ============================================================================
-- 7. FUNCTIONS FOR BUSINESS LOGIC
-- ============================================================================

-- Function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, phone, email, full_name)
  VALUES (
    NEW.id,
    NEW.phone,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Function to find nearby drivers
CREATE OR REPLACE FUNCTION public.find_nearby_drivers(
  search_location GEOGRAPHY,
  search_radius_meters INTEGER DEFAULT 5000
)
RETURNS TABLE (
  driver_id UUID,
  user_id UUID,
  full_name VARCHAR,
  rating DECIMAL,
  distance_meters DOUBLE PRECISION,
  vehicle_type VARCHAR,
  plate_number VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id AS driver_id,
    d.user_id,
    u.full_name,
    d.rating,
    ST_Distance(d.current_location, search_location) AS distance_meters,
    v.vehicle_type,
    v.plate_number
  FROM public.drivers d
  JOIN public.users u ON d.user_id = u.id
  LEFT JOIN public.vehicles v ON v.driver_id = d.id AND v.is_active = true
  WHERE 
    d.is_online = true 
    AND d.is_available = true
    AND d.verification_status = 'approved'
    AND ST_DWithin(d.current_location, search_location, search_radius_meters)
  ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. REALTIME SUBSCRIPTIONS
-- ============================================================================

-- Enable realtime for rides table (so passengers and drivers get live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.rides;

-- Enable realtime for drivers table (for live driver location updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
