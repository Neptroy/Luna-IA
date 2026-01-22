export const database_schema = `-- Drop existing tables if they exist
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS hotel_config;

-- Create rooms table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity INT NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create guests table
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    id_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reservations table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled')) DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    direction TEXT CHECK (direction IN ('inbound', 'outbound')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create hotel_config table
CREATE TABLE hotel_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_name TEXT NOT NULL,
    address TEXT,
    timezone TEXT DEFAULT 'UTC',
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    webhook_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_config ENABLE ROW LEVEL SECURITY;

-- Simple test policies (allow all for authenticated users)
CREATE POLICY "Allow all for authenticated" ON rooms FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON guests FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON reservations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON hotel_config FOR ALL TO authenticated USING (true);
`;
