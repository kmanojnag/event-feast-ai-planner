
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Provider {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  location: string;
  provider_type: 'restaurant' | 'independent_caterer' | 'cloud_kitchen';
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  average_rating?: number;
  review_count?: number;
  food_item_count?: number;
}

export const useProviders = (providerType?: 'restaurant' | 'independent_caterer' | 'cloud_kitchen') => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProviders = async () => {
    try {
      let query = supabase
        .from('provider_stats')
        .select('*');
      
      if (providerType) {
        query = query.eq('provider_type', providerType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [providerType]);

  return {
    providers,
    loading,
    refetch: fetchProviders
  };
};
