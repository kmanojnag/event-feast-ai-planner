
-- Create the user_role enum using DO block to handle if it already exists
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('customer', 'provider', 'organizer', 'restaurant', 'caterer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add the role column to profiles table if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'customer'::public.user_role;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Update the role column to NOT NULL with proper default
ALTER TABLE public.profiles 
ALTER COLUMN role SET NOT NULL,
ALTER COLUMN role SET DEFAULT 'customer'::public.user_role;

-- Create a more robust handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value text;
BEGIN
    -- Extract role from metadata, default to 'customer'
    user_role_value := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
    
    -- Ensure the role is valid, default to 'customer' if not
    IF user_role_value NOT IN ('customer', 'provider', 'organizer', 'restaurant', 'caterer') THEN
        user_role_value := 'customer';
    END IF;
    
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
        user_role_value::public.user_role
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and still return NEW to not block user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
