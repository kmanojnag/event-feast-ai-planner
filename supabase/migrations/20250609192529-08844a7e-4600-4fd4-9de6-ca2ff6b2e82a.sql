
-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  cuisine_type TEXT NOT NULL,
  budget DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'booking', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_items table for provider menus
CREATE TABLE public.food_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT NOT NULL,
  price_per_tray DECIMAL(10,2) NOT NULL CHECK (price_per_tray > 0),
  tray_size TEXT NOT NULL, -- e.g., "Serves 10-12 people"
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for booking system
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events NOT NULL,
  provider_id UUID REFERENCES auth.users NOT NULL,
  customer_id UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table for individual food items in an order
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES public.food_items NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider_availability table
CREATE TABLE public.provider_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  max_orders INTEGER DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for food_items
CREATE POLICY "Anyone can view available food items" ON public.food_items
  FOR SELECT USING (is_available = true);

CREATE POLICY "Providers can view their own food items" ON public.food_items
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Providers can create food items" ON public.food_items
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own food items" ON public.food_items
  FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Providers can delete their own food items" ON public.food_items
  FOR DELETE USING (auth.uid() = provider_id);

-- RLS Policies for orders
CREATE POLICY "Customers can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Providers can view orders for them" ON public.orders
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can update order status" ON public.orders
  FOR UPDATE USING (auth.uid() = provider_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.customer_id = auth.uid() OR orders.provider_id = auth.uid())
    )
  );

CREATE POLICY "Customers can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- RLS Policies for provider_availability
CREATE POLICY "Anyone can view provider availability" ON public.provider_availability
  FOR SELECT USING (true);

CREATE POLICY "Providers can manage their availability" ON public.provider_availability
  FOR ALL USING (auth.uid() = provider_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON public.events 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at 
  BEFORE UPDATE ON public.food_items 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
