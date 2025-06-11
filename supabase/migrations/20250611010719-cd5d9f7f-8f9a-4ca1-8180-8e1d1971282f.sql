
-- Fix the user_role enum and handle_new_user function
-- First, ensure the user_role enum exists with all required values
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('customer', 'provider', 'organizer', 'restaurant', 'caterer');
EXCEPTION
    WHEN duplicate_object THEN 
    -- If it exists, add missing values
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'restaurant';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'caterer';
END $$;

-- Update the handle_new_user function to handle the role casting properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' IN ('customer', 'provider', 'organizer', 'restaurant', 'caterer') 
      THEN (NEW.raw_user_meta_data->>'role')::user_role
      ELSE 'customer'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
