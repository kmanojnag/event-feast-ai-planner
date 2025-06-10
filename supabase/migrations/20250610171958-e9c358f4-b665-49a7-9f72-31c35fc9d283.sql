
-- Create provider_types enum
CREATE TYPE public.provider_type AS ENUM ('restaurant', 'independent_caterer', 'cloud_kitchen');

-- Create providers table
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  provider_type provider_type NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, customer_id)
);

-- Enable RLS on providers table
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for providers
CREATE POLICY "Anyone can view active providers" 
  ON public.providers 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Providers can insert their own profile" 
  ON public.providers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can update their own profile" 
  ON public.providers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their own profile even if inactive" 
  ON public.providers 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Customers can insert their own reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  USING (auth.uid() = customer_id);

-- Add foreign key constraint to food_items table to link with providers
ALTER TABLE public.food_items 
ADD CONSTRAINT food_items_provider_fkey 
FOREIGN KEY (provider_id) REFERENCES public.providers(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_providers_type ON public.providers(provider_type);
CREATE INDEX idx_providers_location ON public.providers(location);
CREATE INDEX idx_reviews_provider ON public.reviews(provider_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_food_items_provider ON public.food_items(provider_id);
CREATE INDEX idx_food_items_cuisine ON public.food_items(cuisine_type);
CREATE INDEX idx_food_items_dietary ON public.food_items(is_vegetarian, is_vegan);

-- Create updated_at trigger for providers
CREATE TRIGGER update_providers_updated_at 
    BEFORE UPDATE ON public.providers 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for reviews
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON public.reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create a view for provider statistics
CREATE VIEW public.provider_stats AS
SELECT 
    p.id,
    p.name,
    p.provider_type,
    p.location,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as review_count,
    COUNT(fi.id) as food_item_count
FROM public.providers p
LEFT JOIN public.reviews r ON p.id = r.provider_id
LEFT JOIN public.food_items fi ON p.id = fi.provider_id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.provider_type, p.location;
