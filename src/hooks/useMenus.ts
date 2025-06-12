
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Menu {
  id: string;
  provider_id: string;
  title: string;
  description?: string;
  created_at: string;
}

export const useMenus = (providerId?: string) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMenus = async () => {
    try {
      let query = supabase.from('menus').select('*');
      
      if (providerId) {
        query = query.eq('provider_id', providerId);
      } else if (user) {
        // For provider dashboard, get menus for their provider
        const { data: providerData } = await supabase
          .from('providers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (providerData) {
          query = query.eq('provider_id', providerData.id);
        }
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setMenus(data || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({
        title: "Error",
        description: "Failed to load menus",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createMenu = async (menuData: Omit<Menu, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('menus')
        .insert([menuData])
        .select()
        .single();

      if (error) throw error;

      setMenus(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Menu created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating menu:', error);
      toast({
        title: "Error",
        description: "Failed to create menu",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [user, providerId]);

  return {
    menus,
    loading,
    createMenu,
    refetch: fetchMenus
  };
};
