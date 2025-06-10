
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface FoodItem {
  id: string;
  provider_id: string;
  name: string;
  description?: string;
  cuisine_type: string;
  price_per_tray: number;
  tray_size: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_available: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useFoodItems = (providerId?: string) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFoodItems = async () => {
    try {
      let query = supabase.from('food_items').select('*');
      
      if (providerId) {
        query = query.eq('provider_id', providerId);
      } else if (user && !providerId) {
        // If no providerId specified and user is logged in, get their items (for provider dashboard)
        query = query.eq('provider_id', user.id);
      } else {
        // For public food items view, show all available items
        query = query.eq('is_available', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setFoodItems(data || []);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createFoodItem = async (itemData: Omit<FoodItem, 'id' | 'provider_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('food_items')
        .insert([{ ...itemData, provider_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setFoodItems(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Menu item added successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating food item:', error);
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateFoodItem = async (id: string, updates: Partial<FoodItem>) => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFoodItems(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Success!",
        description: "Menu item updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating food item:', error);
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, [user, providerId]);

  return {
    foodItems,
    loading,
    createFoodItem,
    updateFoodItem,
    refetch: fetchFoodItems
  };
};
