
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type FoodCategory = Database['public']['Enums']['food_category'];

export interface FoodItem {
  id: string;
  menu_id?: string;
  provider_id: string;
  name: string;
  description?: string;
  cuisine_type: string;
  category: FoodCategory;
  price_full_tray: number;
  price_half_tray: number;
  price_quarter_tray: number;
  tray_size: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_available: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useFoodItems = (providerId?: string, menuId?: string) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFoodItems = async () => {
    try {
      let query = supabase.from('food_items').select(`
        *,
        menu:menus(title, provider_id)
      `);
      
      if (menuId) {
        query = query.eq('menu_id', menuId);
      } else if (providerId) {
        // Get food items from all menus of this provider
        const { data: menus } = await supabase
          .from('menus')
          .select('id')
          .eq('provider_id', providerId);
        
        if (menus && menus.length > 0) {
          const menuIds = menus.map(m => m.id);
          query = query.in('menu_id', menuIds);
        }
      } else if (user && !providerId && !menuId) {
        // For provider dashboard, get their items
        const { data: providerData } = await supabase
          .from('providers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (providerData) {
          const { data: menus } = await supabase
            .from('menus')
            .select('id')
            .eq('provider_id', providerData.id);
          
          if (menus && menus.length > 0) {
            const menuIds = menus.map(m => m.id);
            query = query.in('menu_id', menuIds);
          }
        }
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
      // Get provider_id for the current user
      const { data: providerData } = await supabase
        .from('providers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!providerData) {
        toast({
          title: "Error",
          description: "Provider profile not found",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('food_items')
        .insert({
          ...itemData,
          provider_id: providerData.id,
          category: itemData.category as FoodCategory
        })
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
      const updateData: any = { ...updates };
      if (updates.category) {
        updateData.category = updates.category as FoodCategory;
      }

      const { data, error } = await supabase
        .from('food_items')
        .update(updateData)
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
  }, [user, providerId, menuId]);

  return {
    foodItems,
    loading,
    createFoodItem,
    updateFoodItem,
    refetch: fetchFoodItems
  };
};
