
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Provider {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  location: string;
  provider_type: 'restaurant' | 'independent_caterer' | 'cloud_kitchen';
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
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
        .from('providers')
        .select(`
          id,
          user_id,
          name,
          description,
          location,
          provider_type,
          phone,
          email,
          website,
          image_url,
          is_active,
          created_at,
          updated_at,
          reviews(rating),
          food_items(id)
        `)
        .eq('is_active', true);
      
      if (providerType) {
        query = query.eq('provider_type', providerType);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to include calculated fields
      const transformedData = (data || []).map(provider => ({
        ...provider,
        average_rating: provider.reviews?.length > 0 
          ? provider.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / provider.reviews.length 
          : 0,
        review_count: provider.reviews?.length || 0,
        food_item_count: provider.food_items?.length || 0
      }));

      setProviders(transformedData);
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
