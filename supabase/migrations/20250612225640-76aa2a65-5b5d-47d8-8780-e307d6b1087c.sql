
-- Create enums for food categories
CREATE TYPE food_category AS ENUM (
  'veg', 'non_veg', 'halal', 'jain', 'kosher', 'dessert', 'snacks', 
  'drinks', 'salad', 'rice', 'breads', 'fusion', 'regional', 
  'south_indian', 'north_indian', 'indochinese', 'tandoor'
);

-- Create enums for tray sizes
CREATE TYPE tray_size AS ENUM ('full', 'half', 'quarter');

-- Create enums for order status
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'declined', 'cancelled');

-- Update the existing providers table to match new requirements
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Create menus table
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update food_items table to reference menus and add new fields
ALTER TABLE food_items 
ADD COLUMN IF NOT EXISTS menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS category food_category NOT NULL DEFAULT 'veg',
ADD COLUMN IF NOT EXISTS price_full_tray DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_half_tray DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_quarter_tray DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Drop the old price_per_tray column if it exists
ALTER TABLE food_items DROP COLUMN IF EXISTS price_per_tray;

-- Update events table to match new requirements
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_name TEXT,
ADD COLUMN IF NOT EXISTS number_of_guests INTEGER;

-- Create carts table
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  tray_size tray_size NOT NULL DEFAULT 'full',
  quantity INTEGER NOT NULL DEFAULT 1,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  is_backup_provider BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update orders table to match new requirements
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS primary_provider_id UUID REFERENCES providers(id),
ADD COLUMN IF NOT EXISTS backup_provider_id UUID REFERENCES providers(id),
ADD COLUMN IF NOT EXISTS total_price_primary DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_price_backup DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS order_status order_status DEFAULT 'pending';

-- Add admin role to user_role enum
DO $$ BEGIN
    ALTER TYPE user_role ADD VALUE 'admin';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable RLS on new tables
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for menus (public read, provider write)
CREATE POLICY "Anyone can view menus" ON menus FOR SELECT USING (true);
CREATE POLICY "Providers can manage their menus" ON menus 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM providers p 
    WHERE p.id = provider_id AND p.user_id = auth.uid()
  )
);

-- Create RLS policies for carts
CREATE POLICY "Users can manage their carts" ON carts 
FOR ALL USING (customer_id = auth.uid());

-- Create RLS policies for cart_items
CREATE POLICY "Users can manage their cart items" ON cart_items 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM carts c 
    WHERE c.id = cart_id AND c.customer_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_menus_provider_id ON menus(provider_id);
CREATE INDEX idx_food_items_menu_id ON food_items(menu_id);
CREATE INDEX idx_carts_event_id ON carts(event_id);
CREATE INDEX idx_carts_customer_id ON carts(customer_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_provider_id ON cart_items(provider_id);
